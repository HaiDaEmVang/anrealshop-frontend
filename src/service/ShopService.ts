import { API_ENDPOINTS } from "../constant";
import { axiosInstance } from "./AxiosInstant";

const createShop = async (shopName: string) => {
    const response = await axiosInstance.post(
        `${API_ENDPOINTS.SHOPS.REGISTER}`, shopName
    )
    return response.data;
}

const ShopService = {
    createShop
};

export default ShopService;