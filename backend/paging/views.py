from django.core.paginator import Paginator

def paged_sales(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    keyword = request.GET.get('keyword', '')
    page_number = request.GET.get('page', 1)
    page_size = request.GET.get('size', 10)

    sales = Sale.objects.filter(sale_date__range=[start_date, end_date])
    if keyword:
        sales = sales.filter(Q(customer__customer_name__icontains=keyword) | Q(id__icontains=keyword))
    
    paginator = Paginator(sales, page_size)
    page = paginator.get_page(page_number)

    data = [{"sale_id": sale.id, "customer": sale.customer.customer_name} for sale in page]
    return JsonResponse({"data": data, "page": page.number, "total_pages": paginator.num_pages})
