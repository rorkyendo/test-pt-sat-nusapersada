from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def compare_sales(request):
    date_start = request.query_params.get('date_start', None)
    date_end = request.query_params.get('date_end', None)

    with connection.cursor() as cursor:
        query = "SELECT SALE_DATE, SUM(TOTAL_PRICE) as TOTAL_PRICE FROM v_sales WHERE 1=1"
        params = []

        if date_start and date_end:
            query += " AND SALE_DATE BETWEEN %s AND %s"
            params.extend([date_start, date_end])

        query += " GROUP BY SALE_DATE ORDER BY SALE_DATE ASC"
        cursor.execute(query, params)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]

    return JsonResponse({"status": 200, "data": results}, safe=False)

@api_view(['GET'])
def get_popular_products(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT product_id, SUM(total_price) as total_price 
            FROM sale_items 
            GROUP BY product_id 
            ORDER BY total_price DESC 
            LIMIT 5
        """)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]

    return JsonResponse({"status": 200, "data": results}, safe=False)
