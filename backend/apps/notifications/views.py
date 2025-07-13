from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer

# Create your views here.

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(recipient=user)
        unread = self.request.query_params.get('unread')
        if unread == 'true':
            queryset = queryset.filter(is_read=False)
        return queryset

class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, recipient=request.user)
            notification.is_read = True
            notification.save()
            return Response({'status': 'ok'}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({'detail': 'Notification does not exist'}, status=status.HTTP_404_NOT_FOUND)
