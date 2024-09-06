@api_view(['GET'])
def get_sales(request):
    keyword = request.query_params.get('keyword', '')
    data_periode_start = request.query_params.get('data_periode_start', None)
    data_periode_end = request.query_params.get('data_periode_end', None)
    total_data_show = int(request.query_params.get('total_data_show', 10))
    page = int(request.query_params.get('page', 1))

    offset = (page - 1) * total_data_show

    query = "SELECT * FROM v_sales WHERE 1=1"
    params = []

    if keyword:
        query += " AND (sale_code LIKE %s OR customer LIKE %s)"
        params.extend([f'%{keyword}%', f'%{keyword}%'])

    if data_periode_start and data_periode_end:
        query += " AND sale_date BETWEEN %s AND %s"
        params.extend([data_periode_start, data_periode_end])

    query += " LIMIT %s OFFSET %s"
    params.extend([total_data_show, offset])

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]

    return JsonResponse({
        "status": 200,
        "data": results,
        "total_data_show": total_data_show,
        "page": page
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
        # Insert sale header first
        cursor.execute("INSERT INTO sales (SALE_DATE, CUSTOMER_ID) VALUES (%s, %s) RETURNING SALE_ID", [sale_date, customer_id])
        sale_id = cursor.fetchone()[0]

        # Insert sale items and update product stock
        for item in sale_items:
            product_id = item.get('PRODUCT_ID')
            quantity = item.get('ITEM_QTY')
            
            # Check product stock
            cursor.execute("SELECT PRODUCT_STOCK FROM products WHERE PRODUCT_ID = %s", [product_id])
            product_stock = cursor.fetchone()[0]

            if quantity > product_stock:
                failed_items.append({
                    "PRODUCT_ID": product_id,
                    "message": "Quantity exceeds available stock"
                })
            else:
                # Insert sale item
                cursor.execute("""
                    INSERT INTO sale_items (SALE_ID, PRODUCT_ID, ITEM_QTY, PRODUCT_PRICE) 
                    VALUES (%s, %s, %s, %s)
                """, [sale_id, product_id, quantity, item.get('PRODUCT_PRICE')])

                # Update product stock
                cursor.execute("UPDATE products SET PRODUCT_STOCK = PRODUCT_STOCK - %s WHERE PRODUCT_ID = %s", [quantity, product_id])

                success_items.append({
                    "PRODUCT_ID": product_id,
                    "message": "Item successfully inserted"
                })

        # Update sale_items_total in sales table
        cursor.execute("UPDATE sales SET SALE_ITEMS_TOTAL = %s WHERE SALE_ID = %s", [len(success_items), sale_id])

    return JsonResponse({
        "status": 200,
        "sale_id": sale_id,
        "success_items": success_items,
        "failed_items": failed_items
    }, safe=False)

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