import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../types/auth.types";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isBootstrapped: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isBootstrapped: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isBootstrapped = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
    },
    setBootstrapped: (state) => {
      state.isBootstrapped = true;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setUser,
  clearCredentials,
  setBootstrapped,
} = authSlice.actions;
export const authReducer = authSlice.reducer;

interface RootStateSlice {
  auth: AuthState;
}

export const selectCurrentUser = (state: RootStateSlice) => state.auth.user;
export const selectAccessToken = (state: RootStateSlice) => state.auth.accessToken;
export const selectIsBootstrapped = (state: RootStateSlice) => state.auth.isBootstrapped;
