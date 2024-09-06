from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def get_customers(request):
    # Retrieve all customers or filter by name if provided in query parameters
    customer_name = request.query_params.get('CUSTOMER_NAME', None)
    customer_ids = request.query_params.getlist('customer_ids', None)

    with connection.cursor() as cursor:
        if customer_name:
            cursor.execute("SELECT * FROM customers WHERE CUSTOMER_NAME LIKE %s", ['%' + customer_name + '%'])
        elif customer_ids:
            format_strings = ','.join(['%s'] * len(customer_ids))
            cursor.execute(f"SELECT * FROM customers WHERE CUSTOMER_ID IN ({format_strings})", customer_ids)
        else:
            cursor.execute("SELECT * FROM customers")
        
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]

    return JsonResponse({"status": 200, "data": results}, safe=False)

@api_view(['GET'])
def get_customer(request, customer_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM customers WHERE CUSTOMER_ID = %s", [customer_id])
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}
    return JsonResponse({"status": 200, "data": result}, safe=False)

@api_view(['POST'])
def create_customer(request):
    customer_name = request.data.get('CUSTOMER_NAME')
    with connection.cursor() as cursor:
        cursor.execute("INSERT INTO customers (CUSTOMER_NAME) VALUES (%s)", [customer_name])
    return Response({"status": 201, "message": "Customer created"}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_customer(request, customer_id):
    customer_name = request.data.get('CUSTOMER_NAME')
    with connection.cursor() as cursor:
        cursor.execute("UPDATE customers SET CUSTOMER_NAME = %s WHERE CUSTOMER_ID = %s", [customer_name, customer_id])
    return Response({"status": 200, "message": "Customer updated"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_customer(request, customer_id):
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM customers WHERE CUSTOMER_ID = %s", [customer_id])
    return Response({"status": 204, "message": "Customer deleted"}, status=status.HTTP_204_NO_CONTENT)
