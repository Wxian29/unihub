import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { getAllTags } from '../../api/community';

export const fetchCommunities = createAsyncThunk(
  'community/fetchCommunities',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/communities/', { params });
      // Compatible backends return objects or arrays
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data.results)) {
        return response.data.results;
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue('Failed to obtain the community list');
    }
  }
);

export const fetchUserCommunities = createAsyncThunk(
  'community/fetchUserCommunities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/communities/user/');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to obtain user communities');
    }
  }
);

export const fetchTags = createAsyncThunk(
  'community/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllTags();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to obtain tags');
    }
  }
);

const initialState = {
  communities: [],
  userCommunities: [],
  tags: [],
  loading: false,
  error: null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.userCommunities = action.payload;
      })
      .addCase(fetchUserCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = Array.isArray(action.payload) ? action.payload : (action.payload.results || []);
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = communitySlice.actions;
export default communitySlice.reducer; 