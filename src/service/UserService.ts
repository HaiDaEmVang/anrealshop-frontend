import { API_ENDPOINTS } from "../constant";
import type { ChangePasswordDto, forgotPwRequest } from "../types/UserType";
import { axiosInstance, axiosNoWithCredInstance } from "./AxiosInstant";

const forgotPassword = async (forgotPassword: forgotPwRequest) => {
    const response = await axiosNoWithCredInstance.post(
        `${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
        forgotPassword
    )
    return response.data;
}

const changePassword = async (changePassword: ChangePasswordDto) => {
    const response = await axiosInstance.post(
        `${API_ENDPOINTS.USERS.CHANGE_PASSWORD}`,
        changePassword
    )
    return response.data;
}

const UserService = {
    forgotPassword,
    changePassword,
};
export default UserService;