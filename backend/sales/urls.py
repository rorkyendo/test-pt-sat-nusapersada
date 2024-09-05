from django.urls import path
from .views import insert_data_sale

urlpatterns = [
    path('api/sales/insert/', insert_data_sale, name='insert_data_sale'),
]
