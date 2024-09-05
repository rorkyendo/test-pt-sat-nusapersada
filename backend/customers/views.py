from django.http import JsonResponse
from .models import Customer
from django.db.models import Q

def customer_list(request):
    customer_ids = request.GET.getlist('ids', [])
    customer_name = request.GET.get('name', '')

    if customer_ids:
        customers = Customer.objects.filter(id__in=customer_ids)
    elif customer_name:
        customers = Customer.objects.filter(customer_name__icontains=customer_name)
    else:
        customers = Customer.objects.all()

    data = [{"customer_id": c.id, "customer_name": c.customer_name} for c in customers]
    return JsonResponse(data, safe=False)
