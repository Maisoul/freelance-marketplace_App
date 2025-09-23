from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models.submission import TaskSubmission
from .serializers import TaskSubmissionSerializer
from .permissions import IsExpertOrClientOfTask
from payments.services import PaymentService

class TaskSubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsExpertOrClientOfTask]

    def get_queryset(self):
        """
        Filter submissions based on user role:
        - Experts see their own submissions
        - Clients see submissions for their tasks
        """
        user = self.request.user
        if user.is_staff:
            return TaskSubmission.objects.all()
        
        # For experts, show their submissions
        expert_submissions = TaskSubmission.objects.filter(expert=user)
        
        # For clients, show submissions to their tasks
        client_submissions = TaskSubmission.objects.filter(task__client=user)
        
        # Combine and remove duplicates
        return (expert_submissions | client_submissions).distinct()

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept a submission"""
        submission = self.get_object()
        
        # Only task owner can accept submissions
        if request.user != submission.task.client:
            return Response(
                {"error": "Only the task owner can accept submissions"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Can only accept pending submissions
        if submission.status != 'pending':
            return Response(
                {"error": f"Cannot accept submission with status: {submission.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.status = 'accepted'
        submission.feedback = request.data.get('feedback', '')
        submission.save()
        
        # Update task status
        try:
            with transaction.atomic():
                # Create payment intent if it doesn't exist
                if not hasattr(submission.task, 'payment_intent'):
                    PaymentService.create_payment_intent(submission.task, request.user)

                # Process the payment
                PaymentService.process_payment_success(
                    submission.task.payment_intent.stripe_payment_intent_id
                )

                submission.task.status = 'completed'
                submission.task.save()
                
            return Response(TaskSubmissionSerializer(submission).data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a submission"""
        submission = self.get_object()
        
        # Only task owner can reject submissions
        if request.user != submission.task.client:
            return Response(
                {"error": "Only the task owner can reject submissions"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Can only reject pending submissions
        if submission.status != 'pending':
            return Response(
                {"error": f"Cannot reject submission with status: {submission.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.status = 'rejected'
        submission.feedback = request.data.get('feedback', '')
        submission.save()
        
        # Update task status to allow new submissions
        submission.task.status = 'open'
        submission.task.save()
        
        return Response(TaskSubmissionSerializer(submission).data)

    @action(detail=True, methods=['post'])
    def request_revision(self, request, pk=None):
        """Request revision for a submission"""
        submission = self.get_object()
        
        # Only task owner can request revisions
        if request.user != submission.task.client:
            return Response(
                {"error": "Only the task owner can request revisions"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Can only request revision for pending submissions
        if submission.status != 'pending':
            return Response(
                {"error": f"Cannot request revision for submission with status: {submission.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not request.data.get('feedback'):
            return Response(
                {"error": "Feedback is required when requesting revision"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        submission.status = 'revision'
        submission.feedback = request.data.get('feedback')
        submission.save()
        
        # Update task status
        submission.task.status = 'revision_needed'
        submission.task.save()
        
        return Response(TaskSubmissionSerializer(submission).data)