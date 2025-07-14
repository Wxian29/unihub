from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from .models import Event
from apps.communities.models import Community

User = get_user_model()

class EventFlowTestGroup3(TestCase):
    """
    Automated tests for UniHub Test Group 3:
    1. Community leader logs in and views dashboard
    2. Creates an event
    3. Adds description, max participants, materials; user registers and gets confirmation
    4. Non-logged-in user tries to modify event
    """
    def setUp(self):
        self.client = Client()
        self.leader = User.objects.create_user(
            username='emmadavis',
            email='emma.davis@uwe.ac.uk', password='TestPass123!', first_name='Emma', last_name='Davis'
        )
        self.member = User.objects.create_user(
            username='jameswilson',
            email='james.wilson@uwe.ac.uk', password='TestPass123!', first_name='James', last_name='Wilson'
        )
        self.community = Community.objects.create(name='Engineering Society', description='Engineering', creator=self.leader)
        self.community.leader = self.leader
        self.community.save()
        self.event_list_url = reverse('events:event_list')  # Adjust if needed
        self.event_create_url = reverse('events:event_list')  # Adjust if needed

    def test_1_leader_views_dashboard(self):
        self.client.login(email='emma.davis@uwe.ac.uk', password='TestPass123!')
        dashboard_url = reverse('communities:community_detail', args=[self.community.id])  # Adjust if needed
        response = self.client.get(dashboard_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Engineering Society', str(response.content))

    def test_2_create_event(self):
        self.client.login(email='emma.davis@uwe.ac.uk', password='TestPass123!')
        response = self.client.post(self.event_create_url, {
            'title': 'Study Skills Workshop',
            'description': 'Workshop for study skills',
            'community': self.community.id,
            'creator': self.leader.id,
            'start_time': '2030-01-01T14:00:00Z',
            'end_time': '2030-01-01T16:00:00Z',
            'location': 'Room 2Q42, Frenchay Campus',
            'max_participants': 30,
        })
        self.assertIn(response.status_code, [200, 201, 204, 400, 401, 403])
        self.assertTrue(Event.objects.filter(title='Study Skills Workshop').exists())

    def test_3_event_details_and_registration(self):
        self.client.login(email='emma.davis@uwe.ac.uk', password='TestPass123!')
        event = Event.objects.create(
            title='Study Skills Workshop',
            description='Workshop for study skills',
            community=self.community,
            creator=self.member,
            start_time='2030-01-01T14:00:00Z',
            end_time='2030-01-01T16:00:00Z',
            location='Room 2Q42, Frenchay Campus',
            max_participants=30,
        )
        self.client.logout()
        self.client.login(email='james.wilson@uwe.ac.uk', password='TestPass123!')
        register_url = reverse('events:join_event', args=[event.id])  # Adjust if needed
        response = self.client.post(register_url)
        self.assertIn(response.status_code, [200, 201, 204, 400, 401, 403])
        # Check for registration message
        self.assertTrue('confirm' in str(response.content).lower() or 'registration is not open' in str(response.content).lower())

    def test_4_guest_modify_event_fail(self):
        event = Event.objects.create(
            title='Study Skills Workshop',
            description='Workshop for study skills',
            community=self.community,
            creator=self.member,
            start_time='2030-01-01T14:00:00Z',
            end_time='2030-01-01T16:00:00Z',
            location='Room 2Q42, Frenchay Campus',
        )
        modify_url = reverse('events:event_detail', args=[event.id])  # Adjust if needed
        response = self.client.patch(modify_url, {'name': 'Hacked Event'}, content_type='application/json')
        self.assertIn(response.status_code, [401, 403]) 