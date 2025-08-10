import { API_ENDPOINTS } from "../constant";
import type { CartShippingFee } from "../types/ShipmentType";
import { axiosInstance } from "./AxiosInstant";

const getFeeForCart = async (cartItemIds: string[]): Promise<CartShippingFee[]> => {
  const response = await axiosInstance.post(API_ENDPOINTS.SHIPMENT.GET_SHIPPING_FEE_FORCART, cartItemIds);
  return response.data;
};

export const ShipmentService = {
    getFeeForCart,
};