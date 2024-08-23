import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./index";

export interface Notification {
  id: number;
  usuario_id: number;
  mensaje: string;
  leido: boolean;
  fecha_creacion: string;
}

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        return rejectWithValue("Failed to fetch notifications");
      }
      const data = await response.json();
      return data.notifications;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async ({ id, token }: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return rejectWithValue("Failed to mark notification as read");
      }
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

interface NotificationState {
  notifications: Notification[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  status: "idle",
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const existingNotification = state.notifications.find(
          (notification) => notification.id === id
        );
        if (existingNotification) {
          existingNotification.leido = true;
        }
      });
  },
});

export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;

export default notificationSlice.reducer;
