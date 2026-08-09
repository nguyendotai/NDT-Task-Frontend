import { baseApi } from "@/shared/services/base-api";
import type { AuthUser } from "../types/auth.types";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  id: string;
  email: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginSuccessResponse {
  accessToken: string;
  user: AuthUser;
}

interface RequiresTwoFactorResponse {
  requiresTwoFactor: true;
  tempToken: string;
}

export type LoginResponse = LoginSuccessResponse | RequiresTwoFactorResponse;

interface GoogleLoginRequest {
  idToken: string;
}

interface VerifyTwoFactorLoginRequest {
  tempToken: string;
  code: string;
}

interface SetupTwoFactorResponse {
  secret: string;
  qrCodeDataUrl: string;
}

interface TwoFactorCodeRequest {
  code: string;
}

interface RefreshResponse {
  accessToken: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
      query: (body) => ({ url: "/auth/google", method: "POST", body }),
    }),
    refresh: builder.mutation<RefreshResponse, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
    }),
    logout: builder.mutation<Record<string, never>, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    changePassword: builder.mutation<Record<string, never>, ChangePasswordRequest>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
    verifyTwoFactorLogin: builder.mutation<LoginSuccessResponse, VerifyTwoFactorLoginRequest>({
      query: (body) => ({ url: "/auth/2fa/verify-login", method: "POST", body }),
    }),
    setupTwoFactor: builder.mutation<SetupTwoFactorResponse, void>({
      query: () => ({ url: "/auth/2fa/setup", method: "POST" }),
    }),
    enableTwoFactor: builder.mutation<Record<string, never>, TwoFactorCodeRequest>({
      query: (body) => ({ url: "/auth/2fa/enable", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    disableTwoFactor: builder.mutation<Record<string, never>, TwoFactorCodeRequest>({
      query: (body) => ({ url: "/auth/2fa/disable", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<Record<string, never>, ResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    getMe: builder.query<AuthUser, void>({
      query: () => "/users/me",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useVerifyTwoFactorLoginMutation,
  useSetupTwoFactorMutation,
  useEnableTwoFactorMutation,
  useDisableTwoFactorMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyGetMeQuery,
} = authApi;
