import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

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

const initialState = {
  communities: [],
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
      });
  },
});

export const { clearError } = communitySlice.actions;
export default communitySlice.reducer; 