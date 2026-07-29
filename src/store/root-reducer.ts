import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "@/shared/services/base-api";
import { authReducer } from "@/features/auth/store/auth.slice";

// Feature slices are added here as features are built (Redux Slice luôn nằm trong từng Feature).
export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
});
