import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosRequest } from '@/utils';

export interface Notification {
  id: string;
  createdAt: string;
  message: string;
  isRead: boolean;
  event: string;
}

export interface shakisha {
  message: string;
  data: Notification[];
}

export interface NotificationState {
  data: shakisha | null;
  loading: boolean;
  message: string;
  error: string | null;
  success: boolean;
}

const initialState: NotificationState = {
  data: null,
  loading: false,
  message: '',
  error: '',
  success: false
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, thunkAPI) => {
    try {
      const response = await axiosRequest('GET', '/notifications', {}, true);
      return response.data as shakisha;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id: string, thunkAPI) => {
    try {
      const response = await axiosRequest(
        'PATCH',
        `/notifications/${id}`,
        {},
        true
      );
      return { id, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, thunkAPI) => {
    try {
      const response = await axiosRequest(
        'PATCH',
        '/notifications/markall',
        {},
        true
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      if (state.data) {
        state.data.data = [action.payload, ...state.data.data];
      } else {
        state.data = { message: '', data: [action.payload] };
      }
    },
    markAllAsRead: state => {
      if (state.data) {
        state.data.data.forEach(notification => {
          notification.isRead = true;
        });
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.message = action.payload.message;
        state.error = null;
        state.success = true;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
        state.success = false;
        state.data = null;
      })
      .addCase(markNotificationAsRead.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const notification = state.data?.data.find(
          notif => notif.id === action.payload.id
        );
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to mark notification as read';
        state.success = false;
      })
      .addCase(markAllNotificationsAsRead.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to mark notifications as read';
        state.success = false;
      });
  }
});

export const { addNotification, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
