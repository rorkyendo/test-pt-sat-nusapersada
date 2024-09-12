from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def get_sales(request):
    keyword = request.query_params.get('keyword', '')
    data_periode_start = request.query_params.get('data_periode_start', None)
    data_periode_end = request.query_params.get('data_periode_end', None)
    total_data_show = int(request.query_params.get('total_data_show', 10))
    page = int(request.query_params.get('page', 1))

    offset = (page - 1) * total_data_show

    query = "SELECT s.SALE_ID, s.SALE_DATE, s.CUSTOMER_ID, s.SALE_ITEMS_TOTAL, c.CUSTOMER_NAME, COALESCE(SUM(si.PRODUCT_PRICE * si.ITEM_QTY), 0) AS TOTAL_PRICE FROM sales s LEFT JOIN customers c ON s.CUSTOMER_ID = c.CUSTOMER_ID LEFT JOIN sale_items si ON s.SALE_ID = si.SALE_ID WHERE 1=1"
    params = []

    if keyword:
        query += " AND (s.SALE_ID LIKE %s OR c.CUSTOMER_NAME LIKE %s)"
        params.extend([f'%{keyword}%', f'%{keyword}%'])

    if data_periode_start and data_periode_end:
        query += " AND s.SALE_DATE BETWEEN %s AND %s"
        params.extend([data_periode_start, data_periode_end])

    query += " GROUP BY s.SALE_ID, s.SALE_DATE, s.CUSTOMER_ID, s.SALE_ITEMS_TOTAL, c.CUSTOMER_NAME ORDER BY SALE_DATE DESC"
    query += " LIMIT %s OFFSET %s"
    params.extend([total_data_show, offset])

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]

    # Count total data for pagination
    count_query = "SELECT COUNT(DISTINCT s.SALE_ID) FROM sales s LEFT JOIN customers c ON s.CUSTOMER_ID = c.CUSTOMER_ID WHERE 1=1"
    count_params = []

    if keyword:
        count_query += " AND (s.SALE_ID LIKE %s OR c.CUSTOMER_NAME LIKE %s)"
        count_params.extend([f'%{keyword}%', f'%{keyword}%'])

    if data_periode_start and data_periode_end:
        count_query += " AND s.SALE_DATE BETWEEN %s AND %s"
        count_params.extend([data_periode_start, data_periode_end])

    with connection.cursor() as cursor:
        cursor.execute(count_query, count_params)
        total_count = cursor.fetchone()[0]

    return JsonResponse({
        "status": 200,
        "data": results,
        "total_data": total_count,
        "total_data_show": total_data_show,
        "total_page": -(-total_count // total_data_show),  # Calculate total pages
        "current_page": page
    }, safe=False)

@api_view(['GET'])
def get_sale(request, sale_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM v_sales WHERE SALE_ID = %s", [sale_id])
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}
    return JsonResponse({"status": 200, "data": result}, safe=False)

@api_view(['GET'])
def get_last_sale(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT sale_id FROM v_sales ORDER BY sale_id DESC LIMIT 1;")
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}
    return JsonResponse({"status": 200, "data": result}, safe=False)

@api_view(['POST'])
def create_sale(request):
    sale_date = request.data.get('SALE_DATE')
    customer_id = request.data.get('CUSTOMER_ID')
    sale_items = request.data.get('SALE_ITEMS')  # List of sale items

    success_items = []
    failed_items = []

    with connection.cursor() as cursor:
        # Insert sale header first (without RETURNING)
        cursor.execute("INSERT INTO sales (SALE_DATE, CUSTOMER_ID) VALUES (%s, %s)", [sale_date, customer_id])

        # Get the last inserted SALE_ID
        sale_id = cursor.lastrowid

        # Insert sale items and update product stock
        for item in sale_items:
            product_id = item.get('PRODUCT_ID')
            quantity = item.get('ITEM_QTY')
            
            # Check product stock
            cursor.execute("SELECT PRODUCT_STOCK FROM products WHERE PRODUCT_ID = %s", [product_id])
            product_stock = cursor.fetchone()[0]

            if quantity > product_stock:
                # Add item to failed_items list
                failed_items.append({
                    "id": product_id,
                    "price": item.get('PRODUCT_PRICE'),
                    "qty": quantity,
                    "status": "Failed - not enough Stock"
                })
            else:
                # Insert sale item if quantity is valid
                cursor.execute("""
                    INSERT INTO sale_items (SALE_ID, PRODUCT_ID, ITEM_QTY, PRODUCT_PRICE) 
                    VALUES (%s, %s, %s, %s)
                """, [sale_id, product_id, quantity, item.get('PRODUCT_PRICE')])

                # Update product stock
                cursor.execute("UPDATE products SET PRODUCT_STOCK = PRODUCT_STOCK - %s WHERE PRODUCT_ID = %s", [quantity, product_id])

                # Add item to success_items list
                success_items.append({
                    "id": product_id,
                    "price": item.get('PRODUCT_PRICE'),
                    "qty": quantity,
                    "status": "Success"
                })

        # Update sale_items_total in sales table
        cursor.execute("UPDATE sales SET SALE_ITEMS_TOTAL = %s WHERE SALE_ID = %s", [len(success_items), sale_id])

    # Create the final response with success and failed items
    response_data = {
        "Code": 200,
        "message": [
            {
                "total_items": len(success_items) + len(failed_items),
                "total_success": len(success_items),
                "total_failed": len(failed_items)
            }
        ],
        "items": success_items + failed_items
    }

    return JsonResponse(response_data, safe=False)


@api_view(['PUT'])
def update_sale(request, sale_id):
    sale_date = request.data.get('SALE_DATE')
    customer_id = request.data.get('CUSTOMER_ID')
    sale_items_total = request.data.get('SALE_ITEMS_TOTAL')
    with connection.cursor() as cursor:
        cursor.execute("""
            UPDATE sales SET SALE_DATE = %s, CUSTOMER_ID = %s, SALE_ITEMS_TOTAL = %s 
            WHERE SALE_ID = %s
        """, [sale_date, customer_id, sale_items_total, sale_id])
    return Response({"status": 200, "message": "Sale updated"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_sale(request, sale_id):
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sales WHERE SALE_ID = %s", [sale_id])
    return Response({"status": 204, "message": "Sale deleted"}, status=status.HTTP_204_NO_CONTENT)