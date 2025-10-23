import { API_ENDPOINTS } from '../constant';
import type { LoginRequest, LoginResponse } from '../types/AuthType';
import type { RegisterRequest, UserDto } from '../types/UserType';
import { axiosNoAuthInstance } from './AxiosInstant';

const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosNoAuthInstance.post<LoginResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    loginRequest
  );
  return response.data;
};

const register = async (registerRequest: RegisterRequest): Promise<string> => {
  const response = await axiosNoAuthInstance.post<string>(
    API_ENDPOINTS.USERS.REGISTER,
    registerRequest
  );
  return response.data;
};

const refreshToken = async (): Promise<void> => {
  const response = await axiosNoAuthInstance.post(API_ENDPOINTS.AUTH.REFRESH);
  return response.data;
};

const getProfile = async (): Promise<UserDto> => {
  const response = await axiosNoAuthInstance.get<UserDto>(API_ENDPOINTS.USERS.ME);
  return response.data;
};

// const updateProfile = async (profileData: ProfileRequest): Promise<UserDto> => {
//   const response = await axiosInstance.put<UserDto>(
//     API_ENDPOINTS.USERS.UPDATE_PROFILE,
//     profileData
//   );
//   return response.data;
// };


const logout = async (): Promise<void> => {
  const response = await axiosNoAuthInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data;
};



const authService = {
  login,
  refreshToken,
  getProfile,
  // updateProfile,
  logout,
  register,
};

export default authService;