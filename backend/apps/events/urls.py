from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    # Event Management
    path('', views.EventListView.as_view(), name='event_list'),
    path('<int:pk>/', views.EventDetailView.as_view(), name='event_detail'),
    path('<int:event_id>/join/', views.join_event, name='join_event'),
    path('<int:event_id>/leave/', views.leave_event, name='leave_event'),
    path('<int:event_id>/status/', views.update_event_status, name='update_event_status'),
] 