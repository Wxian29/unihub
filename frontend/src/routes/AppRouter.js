import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CommunityPage from '../pages/CommunityPage';
import CommunityCreatePage from '../pages/CommunityCreatePage';
import CommunityDetailPage from '../pages/CommunityDetailPage';
import CommunityManagePage from '../pages/CommunityManagePage';
import PostsPage from '../pages/PostsPage';
import PostCreatePage from '../pages/PostCreatePage';
import PostDetailPage from '../pages/PostDetailPage';
import PostEditPage from '../pages/PostEditPage';
import ProfilePage from '../pages/ProfilePage';
import EventsPage from '../pages/EventsPage';
import EventCreatePage from '../pages/EventCreatePage';
import EventDetailPage from '../pages/EventDetailPage';
import EventEditPage from '../pages/EventEditPage';
import NotificationsPage from '../pages/NotificationsPage';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/communities" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
    <Route path="/communities/create" element={<ProtectedRoute><CommunityCreatePage /></ProtectedRoute>} />
    <Route path="/communities/:id" element={<ProtectedRoute><CommunityDetailPage /></ProtectedRoute>} />
    <Route path="/communities/:id/manage" element={<ProtectedRoute><CommunityManagePage /></ProtectedRoute>} />
    <Route path="/communities/:id/post" element={<ProtectedRoute><PostCreatePage /></ProtectedRoute>} />
    <Route path="/posts" element={<ProtectedRoute><PostsPage /></ProtectedRoute>} />
    <Route path="/posts/create" element={<ProtectedRoute><PostCreatePage /></ProtectedRoute>} />
    <Route path="/posts/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
    <Route path="/posts/:id/edit" element={<ProtectedRoute><PostEditPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
    <Route path="/events/create" element={<ProtectedRoute><EventCreatePage /></ProtectedRoute>} />
    <Route path="/events/:eventId" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
    <Route path="/events/:eventId/edit" element={<ProtectedRoute><EventEditPage /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
  </Routes>
);

export default AppRouter; 