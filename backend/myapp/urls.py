from django.urls import path
from .views.customer_views import get_customers, get_customer, create_customer, update_customer, delete_customer
from .views.product_views import get_products, get_product, get_product_by_code, create_product, update_product, delete_product
from .views.sale_views import get_sales, get_last_sale, get_sale, create_sale, update_sale, delete_sale
from .views.sale_item_views import get_sale_items, get_sale_item, create_sale_item, update_sale_item, delete_sale_item
from .views.additional_views import compare_sales, get_popular_products

urlpatterns = [
    # Customer URLs
    path('customers/', get_customers),
    path('customers/<int:customer_id>/', get_customer),
    path('customers/create/', create_customer),
    path('customers/update/<int:customer_id>/', update_customer),
    path('customers/delete/<int:customer_id>/', delete_customer),
    
    # Product URLs
    path('products/', get_products),
    path('products/<int:product_id>/', get_product),
    path('products/code/<str:product_code>/', get_product_by_code),  # updated path for product by code
    path('products/create/', create_product),
    path('products/update/<int:product_id>/', update_product),
    path('products/delete/<int:product_id>/', delete_product),

    # Sale URLs
    path('sales/', get_sales),
    path('sales/last/', get_last_sale),  # updated path for last sale
    path('sales/<int:sale_id>/', get_sale),
    path('sales/create/', create_sale),
    path('sales/update/<int:sale_id>/', update_sale),
    path('sales/delete/<int:sale_id>/', delete_sale),

    # Sale Item URLs
    path('sale-items/', get_sale_items),
    path('sale-items/<int:item_id>/', get_sale_item),
    path('sale-items/create/', create_sale_item),
    path('sale-items/update/<int:item_id>/', update_sale_item),
    path('sale-items/delete/<int:item_id>/', delete_sale_item),

    # Additional Views for the new test cases
    path('sales/compare/', compare_sales),  # path for comparing sales data over time
    path('products/popular/', get_popular_products),  # path for popular products
]
