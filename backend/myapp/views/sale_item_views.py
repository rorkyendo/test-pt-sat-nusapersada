from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def get_sale_items(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM sale_items")
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]
    return JsonResponse(results, safe=False)

@api_view(['GET'])
def get_sale_item(request, item_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM sale_items WHERE ITEM_ID = %s", [item_id])
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}
    return JsonResponse(result, safe=False)

@api_view(['POST'])
def create_sale_item(request):
    sale_id = request.data.get('SALE_ID')
    product_id = request.data.get('PRODUCT_ID')
    product_price = request.data.get('PRODUCT_PRICE')
    item_qty = request.data.get('ITEM_QTY')
    is_verify = request.data.get('IS_VERIFY')
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO sale_items (SALE_ID, PRODUCT_ID, PRODUCT_PRICE, ITEM_QTY, IS_VERIFY) 
            VALUES (%s, %s, %s, %s, %s)
        """, [sale_id, product_id, product_price, item_qty, is_verify])
    return Response({'status': 'Sale item created'}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_sale_item(request, item_id):
    sale_id = request.data.get('SALE_ID')
    product_id = request.data.get('PRODUCT_ID')
    product_price = request.data.get('PRODUCT_PRICE')
    item_qty = request.data.get('ITEM_QTY')
    is_verify = request.data.get('IS_VERIFY')
    with connection.cursor() as cursor:
        cursor.execute("""
            UPDATE sale_items SET SALE_ID = %s, PRODUCT_ID = %s, PRODUCT_PRICE = %s, 
            ITEM_QTY = %s, IS_VERIFY = %s WHERE ITEM_ID = %s
        """, [sale_id, product_id, product_price, item_qty, is_verify, item_id])
    return Response({'status': 'Sale item updated'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_sale_item(request, item_id):
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM sale_items WHERE ITEM_ID = %s", [item_id])
    return Response({'status': 'Sale item deleted'}, status=status.HTTP_204_NO_CONTENT)
