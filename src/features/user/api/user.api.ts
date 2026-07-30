import { baseApi } from "@/shared/services/base-api";
import type { User } from "../types/user.types";

interface UpdateProfileRequest {
  name?: string;
  settings?: Record<string, unknown>;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({ url: "/users/me", method: "PATCH", body }),
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation<User, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return { url: "/users/me/avatar", method: "POST", body: formData };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} = userApi;
