def insert_data_sale(request):
    # Assuming request data is parsed from POST or JSON
    sale_data = request.POST or request.JSON
    customer_id = sale_data.get('customer_id')
    sale_items = sale_data.get('items', [])
    
    customer = Customer.objects.get(id=customer_id)
    sale = Sale.objects.create(sale_date=timezone.now(), customer=customer)
    
    total_items = 0
    result = []
    for item in sale_items:
        product = Product.objects.get(id=item['product_id'])
        if product.product_stock < item['quantity']:
            result.append({'product_code': product.product_code, 'status': 'Failed', 'message': 'Not enough stock'})
            continue
        
        sale_item = SaleItem.objects.create(
            sale=sale,
            product=product,
            product_price=product.product_price,
            item_qty=item['quantity'],
            is_verify=True
        )
        total_items += 1
        product.product_stock -= item['quantity']
        product.save()
        result.append({'product_code': product.product_code, 'status': 'Success'})
    
    sale.sale_items_total = total_items
    sale.save()

    return JsonResponse({'sale_id': sale.id, 'result': result})
