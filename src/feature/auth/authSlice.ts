import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { UserDto, ProfileRequest } from '../../types/UserType';
import authService from '../../service/AuthService';
import type { LoginRequest } from '../../types/AuthType';

interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
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
            const response = await authService.login(loginData);
            return response.user;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Đăng nhập thất bại.');
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.getProfile();
            return user;
        } catch (error: any) {
            return rejectWithValue('Không thể xác thực người dùng.');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (profileData: ProfileRequest, { rejectWithValue }) => {
        try {
            const updatedUser = await authService.updateProfile(profileData);
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue('Cập nhật thông tin thất bại.');
        }
    }
);

export const logoutUser = createAsyncThunk(
    '/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            return true;
        } catch (error: any) {
            return rejectWithValue('Đăng xuất thất bại.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserDto>) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload as string;
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserDto>) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserDto>) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.status = 'idle';
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});


export default authSlice.reducer;