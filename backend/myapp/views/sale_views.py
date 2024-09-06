from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def get_sales(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM v_sales")
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]
    return JsonResponse(results, safe=False)

@api_view(['GET'])
def get_sale(request, sale_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM v_sales WHERE SALE_ID = %s", [sale_id])
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}
    return JsonResponse(result, safe=False)

@api_view(['GET'])
def get_last_sale(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT sale_id FROM v_sales ORDER BY sale_id DESC LIMIT 1;")
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}
    return JsonResponse(result, safe=False)

@api_view(['POST'])
def create_sale(request):
    sale_date = request.data.get('SALE_DATE')
    customer_id = request.data.get('CUSTOMER_ID')
    sale_items_total = request.data.get('SALE_ITEMS_TOTAL')
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO sales (SALE_DATE, CUSTOMER_ID, SALE_ITEMS_TOTAL) 
            VALUES (%s, %s, %s)
        """, [sale_date, customer_id, sale_items_total])
    return Response({'status': 'Sale created'}, status=status.HTTP_201_CREATED)

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
    return Response({'status': 'Sale updated'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_sale(request, sale_id):
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sales WHERE SALE_ID = %s", [sale_id])
    return Response({'status': 'Sale deleted'}, status=status.HTTP_204_NO_CONTENT)
