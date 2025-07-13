import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

// Get Post list
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/posts/', { params });
      // Compatible backends return objects or arrays
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data.results)) {
        return response.data.results;
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue('Failed to obtain post list');
    }
  }
);

// Get a single post
export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${postId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to obtain post details');
    }
  }
);

// Create post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post('/posts/', postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

// Updates post
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/posts/${postId}/`, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

// delete post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}/`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get post list
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get a single post
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deleting = false;
        state.posts = state.posts.filter(post => post.id !== action.payload);
        if (state.currentPost && state.currentPost.id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPost } = postsSlice.actions;
export default postsSlice.reducer; 