def product_detail(request, product_code):
    product = Product.objects.filter(product_code=product_code).first()

    if product:
        if product.product_status == 'hold':
            return JsonResponse({'message': 'Product is on hold.'})
        if product.product_stock == 0:
            return JsonResponse({'message': 'Out of stock.'})
        
        data = {
            "product_code": product.product_code,
            "product_name": product.product_name,
            "product_price": product.product_price,
            "product_stock": product.product_stock
        }
        return JsonResponse(data)
    return JsonResponse({'message': 'Product not found.'})
