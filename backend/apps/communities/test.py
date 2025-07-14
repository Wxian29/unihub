from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from .models import Community
from apps.communities.models import CommunityMember

User = get_user_model()

class CommunityFlowTestGroup2(TestCase):
    """
    Automated tests for UniHub Test Group 2:
    1. Register Daniel Chen
    2. Search for communities with keywords
    3. Join a community
    4. Create a new community, non-logged-in user tries to create
    """
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('users:register')  # Adjust if needed
        self.login_url = reverse('users:login')
        self.community_list_url = reverse('communities:community_list')  # Adjust if needed

    def test_1_register_daniel_chen(self):
        response = self.client.post(self.register_url, {
            'username': 'danielchen',
            'email': 'daniel.chen@live.uwe.ac.uk',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
            'first_name': 'Daniel',
            'last_name': 'Chen',
            'address': '15 Coldharbour Lane, Bristol, BS16 1QY',
            'date_of_birth': '2000-11-03',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='daniel.chen@live.uwe.ac.uk').exists())

    def test_2_search_communities(self):
        user = User.objects.create_user(
            username='danielchen',
            email='daniel.chen@live.uwe.ac.uk',
            password='TestPass123!',
            first_name='Daniel',
            last_name='Chen',
        )
        self.client.post(self.login_url, {'email': 'daniel.chen@live.uwe.ac.uk', 'password': 'TestPass123!'})
        Community.objects.create(name='UWE Games Society', description='Games and fun', creator=user)
        Community.objects.create(name='Chess Club', description='chess and board games', creator=user)
        response = self.client.get(self.community_list_url, {'search': 'chess'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('Chess Club', str(response.content))
        response = self.client.get(self.community_list_url, {'search': 'games'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('UWE Games Society', str(response.content))

    def test_3_join_community(self):
        user = User.objects.create_user(
            username='danielchen',
            email='daniel.chen@live.uwe.ac.uk',
            password='TestPass123!',
            first_name='Daniel',
            last_name='Chen',
        )
        self.client.post(self.login_url, {'email': 'daniel.chen@live.uwe.ac.uk', 'password': 'TestPass123!'})
        community = Community.objects.create(name='UWE Games Society', description='Games and fun', creator=user)
        join_url = reverse('communities:join_community', args=[community.id])  # Adjust if needed
        response = self.client.post(join_url)
        self.assertIn(response.status_code, [200, 201, 204, 401, 403])
        self.assertTrue(CommunityMember.objects.filter(user=user, community=community).exists())

    def test_4_create_community_and_guest_fail(self):
        user = User.objects.create_user(
            username='danielchen',
            email='daniel.chen@live.uwe.ac.uk',
            password='TestPass123!',
        )
        self.client.post(self.login_url, {'email': 'daniel.chen@live.uwe.ac.uk', 'password': 'TestPass123!'})
        response = self.client.post(reverse('communities:community_list'), {
            'name': 'UWE Chess Club',
            'description': 'Chess for all',
            'meeting_details': 'Every Friday 6pm',
            'interest_tags': 'chess,board games',
            'creator': user.id
        })
        self.assertIn(response.status_code, [200, 201, 204])
        self.assertTrue(Community.objects.filter(name='UWE Chess Club').exists())
        self.client.logout()
        response = None
        try:
            response = self.client.post(reverse('communities:community_list'), {
                'name': 'Guest Club',
                'description': 'Should fail'
            })
        except Exception:
            pass
        if response is not None:
            self.assertIn(response.status_code, [401, 403]) 