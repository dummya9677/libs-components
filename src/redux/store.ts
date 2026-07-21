import {
  combineReducers,
  configureStore,
  isRejectedWithValue,
  type Middleware,
} from '@reduxjs/toolkit';
import { serverAPI } from '../services/apiService';
import authSlice from './slice/authSlice';
import notificationsUiSlice from './slice/notificationsUiSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  notificationsUi: notificationsUiSlice,
  [serverAPI.reducerPath]: serverAPI.reducer,
});

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getNestedString(
  root: unknown,
  path: readonly string[],
): string | undefined {
  let cur: unknown = root;
  for (const key of path) {
    if (!isRecord(cur)) return undefined;
    cur = cur[key];
  }
  return readString(cur);
}

type UnknownAction = { type: string; payload?: unknown; meta?: unknown };

function isAction(value: unknown): value is UnknownAction {
  return isRecord(value) && typeof value.type === 'string';
}

const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (!isAction(action)) return next(action);

  const metaRejected =
    isRecord(action.meta) && action.meta.rejectedWithValue === true;

  if (isRejectedWithValue(action) || metaRejected) {
    const payload = action.payload;
    const errorMsg =
      readString(isRecord(payload) ? payload.error : undefined) ??
      getNestedString(payload, ['error', 'data', 'message']) ??
      getNestedString(payload, ['data', 'message']) ??
      getNestedString(payload, ['data', 'responseMessage']) ??
      getNestedString(payload, ['data', 'statusText']) ??
      'An unexpected error occurred';

    console.error('API Error:', errorMsg);
  }

  return next(action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(serverAPI.middleware)
      .concat(rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
