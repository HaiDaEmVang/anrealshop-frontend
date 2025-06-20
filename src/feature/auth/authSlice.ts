// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { LoginRequest, LoginResponse } from '../../types/AuthType';
import authService from '../../service/AuthService';
import type { ProfileRequest, RegisterRequest, UserDto } from '../../types/UserType';
import type { ErrorResponseDto } from '../../types/CommonType';
import type { StringDecoder } from 'node:string_decoder';

interface AuthError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: ErrorResponseDto['details'];
  traceId?: string;
}

interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: AuthError | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginRequest, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await authService.login(loginData);
      return response;
    } catch (error: any) {
      const authError: AuthError = {
        message: error.message || 'Đăng nhập thất bại.',
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        traceId: error.traceId,
      };
      return rejectWithValue(authError);
    }
  }
);


export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user: UserDto = await authService.getProfile();
      return user;
    } catch (error: any) {
      const authError: AuthError = {
        message: error.message || 'Không thể xác thực người dùng.',
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        traceId: error.traceId,
      };
      return rejectWithValue(authError);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData: ProfileRequest, { rejectWithValue }) => {
    try {
      const updatedUser: UserDto = await authService.updateProfile(profileData);
      return updatedUser;
    } catch (error: any) {
      const authError: AuthError = {
        message: error.message || 'Cập nhật thông tin thất bại.',
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        traceId: error.traceId,
      };
      return rejectWithValue(authError);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error: any) {
      const authError: AuthError = {
        message: error.message || 'Đăng xuất thất bại.',
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        traceId: error.traceId,
      };
      return rejectWithValue(authError);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response: string = await authService.register(registerData);
      return response;
    } catch (error: any) {
      const authError: AuthError = {
        message: error.message || 'Đăng ký thất bại.',
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        traceId: error.traceId,
      };
      return rejectWithValue(authError);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = (action.payload as AuthError) || { message: 'Đăng nhập thất bại không xác định.' };
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserDto>) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.error = (action.payload as AuthError) || { message: 'Không thể xác thực người dùng.' };
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserDto>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as AuthError) || { message: 'Cập nhật thông tin thất bại.' };
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as AuthError) || { message: 'Đăng xuất thất bại.' };
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as AuthError) || { message: 'Đăng ký thất bại.' };
      });
  },
});

export default authSlice.reducer;