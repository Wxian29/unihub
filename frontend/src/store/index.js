import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import communityReducer from '../features/community/communitySlice';
import eventReducer from '../features/event/eventSlice';
import postsReducer from '../features/posts/postsSlice';
import notificationReducer from '../features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    event: eventReducer,
    posts: postsReducer,
    notification: notificationReducer,
  },
}); 