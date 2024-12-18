/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_URL } from '../constant/backend-domain';
import { IUser, UserRole } from '../types/user.type';
import { CustomError } from '../utils/errorHelpers';
import { EnumType } from '../types/enumData.type';

interface loginResponse {
  token: string;
  userId: string;
  message: string;
  enumData?: Record<string, Record<string, string>>;
  listPermission?: string[];
  adminRole: UserRole;
}
interface signupResponse {
  userId: string;
  message: string;
}
interface signUpRequestResponse {
  userId: string;
  message: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Authentication'],
  keepUnusedDataFor: 10,
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/auth`,
    prepareHeaders(headers) {
      const adminToken = localStorage.getItem('adminToken');
      const token = localStorage.getItem('token');
      if (adminToken) {
        headers.set('authorization', `Bearer ${adminToken}`);
        headers.set('adminRole', 'admin');
      }
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        headers.set('userRole', 'user');
      }
      return headers;
    }
  }),
  endpoints: (build) => ({
    //1
    login: build.mutation<loginResponse, { email: string; password: string }>({
      query(body) {
        try {
          return {
            url: 'login',
            method: 'POST',
            body
          };
        } catch (error: any) {
          throw new CustomError((error as CustomError).message);
        }
      },

      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //2
    logout: build.mutation<loginResponse, void>({
      query(body) {
        try {
          return {
            url: 'logout',
            method: 'POST',
            body
          };
        } catch (error: any) {
          throw new CustomError((error as CustomError).message);
        }
      },

      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //3
    adminLogout: build.mutation<loginResponse, void>({
      query(body) {
        try {
          return {
            url: 'admin/logout',
            method: 'POST',
            body
          };
        } catch (error: any) {
          throw new CustomError((error as CustomError).message);
        }
      },
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //4
    updateLastLogin: build.mutation<loginResponse, { userId: string; lastLogin: Date }>({
      query(body) {
        try {
          return {
            url: `last-login/${body.userId}`,
            method: 'PATCH',
            body: {
              lastLogin: body.lastLogin
            }
          };
        } catch (error: any) {
          throw new CustomError((error as CustomError).message);
        }
      },
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //5
    adminLogin: build.mutation<loginResponse, any>({
      query(body) {
        try {
          return {
            url: 'admin-login',
            method: 'POST',
            body
          };
        } catch (error: any) {
          throw new CustomError((error as CustomError).message);
        }
      },
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //6
    adminSignUpRequest: build.mutation<signUpRequestResponse, { email: string; name: string; phone: string }>({
      query(body) {
        try {
          return {
            url: 'admin/signup-request',
            method: 'POST',
            body
          };
        } catch (error: any) {
          throw new CustomError((error as CustomError).message);
        }
      },

      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //7
    signup: build.mutation<signupResponse, Omit<IUser, '_id'>>({
      query(body) {
        return {
          url: `signup`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: (result, error, data) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //8
    resetPassword: build.mutation<{ message: string; user: { _id: string; email: string } }, { email: string }>({
      query(data) {
        return {
          url: `reset`,
          method: 'POST',
          body: {
            email: data.email
          }
        };
      },
      invalidatesTags: (result, error, data) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //9
    generateNewPassword: build.mutation<any, { password: string; userId: string | null; passwordToken: string | null }>(
      {
        query(data) {
          return {
            url: `new-password`,
            method: 'POST',
            body: data
          };
        },
        invalidatesTags: (result, error, data) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
      }
    ),
    //10
    googleLogin: build.mutation<loginResponse, { token: string }>({
      query(body) {
        return {
          url: 'google-login',
          method: 'POST',
          body
        };
      },
      invalidatesTags: (_, error) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //11
    githubLogin: build.mutation<loginResponse, { code: string }>({
      query(body) {
        return {
          url: 'github-login',
          method: 'POST',
          body
        };
      }
    }),
    //12
    facebookLogin: build.mutation<loginResponse, { token: string }>({
      query(body) {
        return {
          url: 'facebook-login',
          method: 'POST',
          body
        };
      },
      invalidatesTags: (_, error) => (error ? [] : [{ type: 'Authentication', id: 'LIST' }])
    }),
    //13
    // ChangePassword: build.mutation<
    //   ChangePasswordResponse,
    //   { userId: string; oldPassword: string; newPassword: string }
    // >({
    //   query: ({ userId, oldPassword, newPassword }) => ({
    //     url: `/change-password`,
    //     method: 'POST',
    //     body: { userId, oldPassword, newPassword }
    //   }),
    //   invalidatesTags: (_, __, { userId }) => [
    //     { type: 'Authentication', id: 'LIST' },
    //     { type: 'Authentication', id: userId }
    //   ]
    // })
    ChangePassword: build.mutation<
      ChangePasswordResponse,
      { userId: string; oldPassword: string; newPassword: string }
    >({
      
      query: ({ userId, oldPassword, newPassword }) => ({
        url: `/change-password`, // Ensure this matches your backend route
        method: 'PUT', // Use 'PUT' if updating resources for consistency
        body: { userId, oldPassword, newPassword },
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: 'Authentication', id: 'LIST' }, // Adjust as needed
        { type: 'Authentication', id: userId },
      ],
    })
  })
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useAdminLogoutMutation,
  useUpdateLastLoginMutation,

  useAdminLoginMutation,
  useAdminSignUpRequestMutation,
  useSignupMutation,
  useResetPasswordMutation,
  useGenerateNewPasswordMutation,
  
  useGoogleLoginMutation,
  useGithubLoginMutation,
  useFacebookLoginMutation,
  useChangePasswordMutation
} = authApi;
