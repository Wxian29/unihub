import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/events/', { params });
      // Compatible backends return objects or arrays
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data.results)) {
        return response.data.results;
      } else {
        return [];
      }
    } catch (error) {
      return rejectWithValue('Failed to get the event list');
    }
  }
);

export const fetchEventDetail = createAsyncThunk(
  'event/fetchEventDetail',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/${eventId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to obtain event details');
    }
  }
);

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post('/events/', eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'event/updateEvent',
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/events/${eventId}/`, eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update event failed');
    }
  }
);

export const joinEvent = createAsyncThunk(
  'event/joinEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/events/${eventId}/join/`);
      return { eventId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const leaveEvent = createAsyncThunk(
  'event/leaveEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/events/${eventId}/leave/`);
      return { eventId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to exit event');
    }
  }
);

export const updateEventStatus = createAsyncThunk(
  'event/updateEventStatus',
  async ({ eventId, status }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/events/${eventId}/status/`, { status });
      return { eventId, status, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event status');
    }
  }
);

const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  detailLoading: false,
  error: null,
  successMessage: null,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get the event list
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get event details
      .addCase(fetchEventDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchEventDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      
      // Create an event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);
        state.successMessage = 'Event created successfully';
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
        // Update event in the list
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        state.successMessage = 'Event updated successfully';
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Registration Event
      .addCase(joinEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentEvent && state.currentEvent.id === action.payload.eventId) {
          state.currentEvent.is_participant = true;
          state.currentEvent.current_participants += 1;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Exit event
      .addCase(leaveEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveEvent.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentEvent && state.currentEvent.id === action.payload.eventId) {
          state.currentEvent.is_participant = false;
          state.currentEvent.current_participants = Math.max(0, state.currentEvent.current_participants - 1);
        }
        state.successMessage = action.payload.message;
      })
      .addCase(leaveEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update event status
      .addCase(updateEventStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentEvent && state.currentEvent.id === action.payload.eventId) {
          state.currentEvent.status = action.payload.status;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer; 