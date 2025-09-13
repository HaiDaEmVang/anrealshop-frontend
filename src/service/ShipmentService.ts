import { API_ENDPOINTS } from "../constant";
import type { CartShippingFee, CreateShipmentRequest } from "../types/ShipmentType";
import { axiosInstance } from "./AxiosInstant";

const getFeeForCart = async (cartItemIds: string[]): Promise<CartShippingFee[]> => {
  const response = await axiosInstance.post(API_ENDPOINTS.SHIPMENT.GET_SHIPPING_FEE_FORCART, cartItemIds);
  return response.data;
};


const createShipment = async (createShipmentRequest: CreateShipmentRequest): Promise<void> => {
  await axiosInstance.put(API_ENDPOINTS.SHIPMENT.CREATE_SHIPMENTS, createShipmentRequest);
}

export const ShipmentService = {
    getFeeForCart,
    createShipment
};