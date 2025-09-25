# tasks/views.py

from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from django.contrib.auth import get_user_model
from django.db import models
from .serializers import TaskSerializer
from .models import Task

# Add TaskListView and its filters
class TaskListView(generics.ListAPIView):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['category', 'budget_range', 'complexity']
    search_fields = ['description', 'client']
    ordering_fields = ['created_at', 'budget_range', 'complexity']

# Add the bulk_delete_tasks view
@api_view(['POST'])
@permission_classes([IsAdminUser])
def bulk_delete_tasks(request):
    ids = request.data.get('ids', [])
    if not ids:
        return Response({"detail": "No IDs provided."}, status=status.HTTP_400_BAD_REQUEST)
    Task.objects.filter(id__in=ids).delete()
    return Response({"detail": f"Deleted {len(ids)} tasks."}, status=status.HTTP_200_OK)

# --- Existing code starts here ---

# Client creates task
class TaskCreateView(generics.CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

# Client list
class ClientTaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(client=self.request.user)

# Admin view: filter by category
class AdminTaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category","status"]
    queryset = Task.objects.all()

# Task management endpoints
class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status', 'complexity', 'budget_range']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'deadline', 'budget_range']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Task.objects.all()
        if getattr(user, 'role', None) == 'expert':
            return Task.objects.filter(
                models.Q(assigned_expert=user)
            )
        return Task.objects.filter(client=user)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    @action(detail=True, methods=['post'])
    def assign_expert(self, request, pk=None):
        task = self.get_object()
        expert_id = request.data.get('expert_id')
        
        if not expert_id:
            return Response(
                {"error": "Expert ID is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            expert = get_user_model().objects.get(id=expert_id, role='expert')
            task.assign_expert(expert)
            return Response(TaskSerializer(task).data)
        except get_user_model().DoesNotExist:
            return Response(
                {"error": "Expert not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def start_work(self, request, pk=None):
        task = self.get_object()
        if request.user != task.assigned_expert:
            return Response(
                {"error": "Only assigned expert can start work"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            task.start_work()
            return Response(TaskSerializer(task).data)
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def request_revision(self, request, pk=None):
        task = self.get_object()
        if request.user != task.client and not request.user.is_staff:
            return Response(
                {"error": "Only client or staff can request revision"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            task.request_revision()
            return Response(TaskSerializer(task).data)
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        task = self.get_object()
        if request.user != task.assigned_expert and not request.user.is_staff:
            return Response(
                {"error": "Only assigned expert or staff can mark as completed"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            task.complete()
            return Response(TaskSerializer(task).data)
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def cancel_task(self, request, pk=None):
        task = self.get_object()
        if request.user != task.client and not request.user.is_staff:
            return Response(
                {"error": "Only client or staff can cancel task"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            task.cancel()
            return Response(TaskSerializer(task).data)
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )