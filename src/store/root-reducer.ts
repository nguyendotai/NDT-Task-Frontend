import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "@/shared/services/base-api";

// Feature slices are added here as features are built (Redux Slice luôn nằm trong từng Feature).
export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});
