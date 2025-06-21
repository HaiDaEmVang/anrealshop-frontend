import { API_ENDPOINTS } from "../constant";
import type { forgotPwRequest } from "../types/UserType";
import { axiosNoWithCredInstance } from "./AxiosInstant";

const forgotPassword = async (forgotPassword: forgotPwRequest) => {
    const response = await axiosNoWithCredInstance.post(
        `${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
        forgotPassword
    )
    return response.data;
}

const UserService = {
    forgotPassword
};
export default UserService;