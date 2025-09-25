











from django.urls import path
from .views import create_paypal_order

urlpatterns = [
    path('paypal/order/create/', create_paypal_order, name='create_paypal_order'),
]

