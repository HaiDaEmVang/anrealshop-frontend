import axios from 'axios';
import { API_ENDPOINTS, BASE_API_URL } from '../constant';
import type { LoginRequest, LoginResponse } from '../types/AuthType';
import type { ProfileRequest, RegisterRequest, UserDto } from '../types/UserType';
import { axiosInstance } from './AxiosInstant'; 

const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    loginRequest
  );
  return response.data;
};

const register = async (registerRequest: RegisterRequest): Promise<string> => {
  const response = await axiosInstance.post<string>(
    API_ENDPOINTS.AUTH.REGISTER,
    registerRequest
  );
  return response.data;
};

const refreshToken = async (): Promise<void> => {
  await axios.post(
    `${BASE_API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
    {},
    { withCredentials: true }
  );
};

const getProfile = async (): Promise<UserDto> => {
  const response = await axiosInstance.get<UserDto>(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

const updateProfile = async (profileData: ProfileRequest): Promise<UserDto> => {
  const response = await axiosInstance.put<UserDto>(
    API_ENDPOINTS.USERS.UPDATE_PROFILE,
    profileData
  );
  return response.data;
};

const createUser = async (registerRequest: RegisterRequest): Promise<string> => {
  const response = await axiosInstance.post<string>( 
    API_ENDPOINTS.AUTH.REGISTER, 
    registerRequest
  );
  return response.data;
};

const logout = async (): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
};

const authService = {
  login,
  refreshToken,
  getProfile,
  updateProfile,
  logout,
  createUser,
  register,
};

export default authService;