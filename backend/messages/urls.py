# messages/urls.py
from django.urls import path
from .views import MessageListCreateView, ReviewListCreateView, InvoiceListCreateView

urlpatterns = [
    path('messages/', MessageListCreateView.as_view(), name='messages'),
    path('reviews/', ReviewListCreateView.as_view(), name='reviews'),
    path('invoices/', InvoiceListCreateView.as_view(), name='invoices'),
]
