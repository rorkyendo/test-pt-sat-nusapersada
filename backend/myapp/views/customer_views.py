from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def get_customers(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM customers")
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]
    return JsonResponse(results, safe=False)

@api_view(['GET'])
def get_customer(request, customer_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM customers WHERE CUSTOMER_ID = %s", [customer_id])
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}
    return JsonResponse(result, safe=False)

@api_view(['POST'])
def create_customer(request):
    customer_name = request.data.get('CUSTOMER_NAME')
    with connection.cursor() as cursor:
        cursor.execute("INSERT INTO customers (CUSTOMER_NAME) VALUES (%s)", [customer_name])
    return Response({'status': 'Customer created'}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_customer(request, customer_id):
    customer_name = request.data.get('CUSTOMER_NAME')
    with connection.cursor() as cursor:
        cursor.execute("UPDATE customers SET CUSTOMER_NAME = %s WHERE CUSTOMER_ID = %s", [customer_name, customer_id])
    return Response({'status': 'Customer updated'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_customer(request, customer_id):
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM customers WHERE CUSTOMER_ID = %s", [customer_id])
    return Response({'status': 'Customer deleted'}, status=status.HTTP_204_NO_CONTENT)
