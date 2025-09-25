# tasks/urls.py

from django.urls import path
from .views import (
    TaskCreateView,
    ClientTaskListView,
    AdminTaskListView,
    TaskListView,
    bulk_delete_tasks,
    TaskViewSet
)

urlpatterns = [
    # General task listing and bulk deletion
    path('list/', TaskListView.as_view(), name='task-list'),
    path('bulk_delete/', bulk_delete_tasks, name='task-bulk-delete'),
    
    # Client-specific views (aliases compatible with frontend)
    path("create/", TaskCreateView.as_view(), name="task_create"),
    path("my-tasks/", ClientTaskListView.as_view(), name="client_tasks"),
    path("../client/tasks/", ClientTaskListView.as_view(), name="client_tasks_alias"),
]

# Note: The TaskViewSet is a ModelViewSet and is typically registered
# with a router in the main project's urls.py, not here.
# For example, in your marketplace/urls.py, you would have:
# from rest_framework.routers import DefaultRouter
# from tasks.views import TaskViewSet
# router = DefaultRouter()
# router.register(r'tasks', TaskViewSet, basename='tasks')
# urlpatterns += router.urls