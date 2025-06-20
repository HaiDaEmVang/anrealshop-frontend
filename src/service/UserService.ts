import { API_ENDPOINTS } from "../constant";
import type { ResetPwRequest } from "../types/UserType";
import { axiosNoWithCredInstance } from "./AxiosInstant";

const changePassword = async (resetPwRequest: ResetPwRequest) => {
    const response = await axiosNoWithCredInstance.post(
        `${API_ENDPOINTS.USERS.RESET_PASSWORD}`,
        resetPwRequest
    )
    return response.data;
}

const UserService = {
    changePassword
};
export default UserService;