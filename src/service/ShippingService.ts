import { API_ENDPOINTS } from "../constant";
import type { shipParams } from "../hooks/useShipping";
import type { MyShopShippingListResponse } from "../types/ShipmentType";
import { axiosInstance } from "./AxiosInstant";

const getMyShopShipping = async (params?: shipParams): Promise<MyShopShippingListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SHIPMENT.MYSHOP_LIST, { params });
    return response.data;
};


export const ShippingService = {
    getMyShopShipping,
};