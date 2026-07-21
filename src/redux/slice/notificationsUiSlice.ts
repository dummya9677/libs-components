import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type NotificationsUiState = {
  readIds: string[];
  dismissedIds: string[];
};

const initialState: NotificationsUiState = {
  readIds: [],
  dismissedIds: [],
};

const notificationsUiSlice = createSlice({
  name: 'notificationsUi',
  initialState,
  reducers: {
    markNotificationRead: (state, action: PayloadAction<string>) => {
      if (!state.readIds.includes(action.payload)) {
        state.readIds.push(action.payload);
      }
    },
    markAllNotificationsRead: (state, action: PayloadAction<string[]>) => {
      state.readIds = [...new Set([...state.readIds, ...action.payload])];
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      if (!state.dismissedIds.includes(action.payload)) {
        state.dismissedIds.push(action.payload);
      }
    },
    resetNotificationsUi: () => initialState,
  },
});

export const {
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
  resetNotificationsUi,
} = notificationsUiSlice.actions;

export const selectDismissedNotificationIds = (state: RootState) =>
  state.notificationsUi.dismissedIds;

export const selectReadNotificationIds = (state: RootState) =>
  state.notificationsUi.readIds;

export default notificationsUiSlice.reducer;
