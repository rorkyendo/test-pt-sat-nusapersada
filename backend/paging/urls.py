from django.urls import path
from .views import paged_sales

urlpatterns = [
    path('api/sales/paging/', paged_sales, name='paged_sales'),
]
