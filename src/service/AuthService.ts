import axios from 'axios';
import { API_ENDPOINTS, BASE_API_URL } from '../constant';
import type { LoginRequest, LoginResponse } from '../types/AuthType';
import type { ProfileRequest, UserDto } from '../types/UserType';
import { axiosInstance } from './AxiosInstant';



const login = async (loginRequest: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('BASE_API_URL:', BASE_API_URL);
    const response = await axios.post<LoginResponse>(
        `${BASE_API_URL}${API_ENDPOINTS.AUTH.LOGIN}`, 
        loginRequest);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Email hoặc mật khẩu không chính xác');
    }
    throw new Error('Đã có lỗi xảy ra. Vui lòng thử lại.');
  }
};

const refreshToken = async (): Promise<void> => {
  try {
    await axios.post(
      `${BASE_API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
      {},
      {withCredentials: true,}
    );
  } catch (error) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
};

const getProfile = async (): Promise<UserDto> => {
  const response = await axiosInstance.get<UserDto>(`${API_ENDPOINTS.AUTH.ME}`);
  return response.data;
};

const updateProfile = async (profileData: ProfileRequest): Promise<UserDto> => {
  const response = await axiosInstance.put<UserDto>(
    `${API_ENDPOINTS.USERS.UPDATE_PROFILE}`,
    profileData
  );
  return response.data;
};


const logout = async () => {
  return await axios.post(`${API_ENDPOINTS.AUTH.LOGOUT}`);
};

const authService = {
  login,
  refreshToken,
  getProfile,
  updateProfile,
  logout,
};

export default authService;