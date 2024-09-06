@api_view(['GET'])
def get_products(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM products")
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]
    return JsonResponse({"status": 200, "data": results}, safe=False)

@api_view(['GET'])
def get_product(request, product_id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM products WHERE PRODUCT_ID = %s", [product_id])
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}
    return JsonResponse({"status": 200, "data": result}, safe=False)

@api_view(['GET'])
def get_product_by_code(request, product_code):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM products WHERE PRODUCT_CODE = %s", [product_code])
        row = cursor.fetchone()
        columns = [col[0] for col in cursor.description]
        result = dict(zip(columns, row)) if row else {}

        if result:
            if result['PRODUCT_STATUS'].lower() == 'hold':
                return JsonResponse({"status": 400, "message": "Product is on hold"}, safe=False)
            elif result['PRODUCT_STOCK'] == 0:
                return JsonResponse({"status": 400, "message": "Product out of stock"}, safe=False)
    
    return JsonResponse({"status": 200, "data": result}, safe=False)

@api_view(['POST'])
def create_product(request):
    product_code = request.data.get('PRODUCT_CODE')
    product_name = request.data.get('PRODUCT_NAME')
    product_price = request.data.get('PRODUCT_PRICE')
    product_status = request.data.get('PRODUCT_STATUS')
    product_stock = request.data.get('PRODUCT_STOCK')
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO products (PRODUCT_CODE, PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_STATUS, PRODUCT_STOCK) 
            VALUES (%s, %s, %s, %s, %s)
        """, [product_code, product_name, product_price, product_status, product_stock])
    return Response({"status": 201, "message": "Product created"}, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_product(request, product_id):
    product_code = request.data.get('PRODUCT_CODE')
    product_name = request.data.get('PRODUCT_NAME')
    product_price = request.data.get('PRODUCT_PRICE')
    product_status = request.data.get('PRODUCT_STATUS')
    product_stock = request.data.get('PRODUCT_STOCK')
    with connection.cursor() as cursor:
        cursor.execute("""
            UPDATE products SET PRODUCT_CODE = %s, PRODUCT_NAME = %s, PRODUCT_PRICE = %s, 
            PRODUCT_STATUS = %s, PRODUCT_STOCK = %s WHERE PRODUCT_ID = %s
        """, [product_code, product_name, product_price, product_status, product_stock, product_id])
    return Response({"status": 200, "message": "Product updated"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_product(request, product_id):
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM products WHERE PRODUCT_ID = %s", [product_id])
    return Response({"status": 204, "message": "Product deleted"}, status=status.HTTP_204_NO_CONTENT)