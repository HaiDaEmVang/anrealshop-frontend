import { API_ENDPOINTS } from "../constant";
import type { UseOrderParams } from "../hooks/useOrder";
import type { MyShopOrderListResponse, OrderRejectRequest, OrderStatusDto } from "../types/OrderType";
import { axiosInstance } from "./AxiosInstant";

const getOrderMetaData = async (): Promise<OrderStatusDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MYSHOP_META_DATA);
    return response.data;
};

const getMyShopOrders = async (params?: UseOrderParams): Promise<MyShopOrderListResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.MYSHOP_ORDERS, { params });
    return response.data;
};

// const getOrderDetail = async (orderId: string): Promise<OrderDetailDto> => {
//     const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS.DETAILS}/${orderId}`);
//     return response.data;
// };


const approveOrder = async (shopOrderId: string): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ORDERS.MYSHOP_APPROVAL(shopOrderId));
};

const rejectOrder = async (orderItemId: string, reason: string): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ORDERS.MYSHOP_REJECT(orderItemId), reason);
};

const rejectOrders = async (orderRejectRequest: OrderRejectRequest): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ORDERS.MYSHOP_REJECTS, orderRejectRequest);
};



export const OrderService = {
    getOrderMetaData,
    getMyShopOrders,
    // getOrderDetail,
    approveOrder,
    rejectOrder,
    rejectOrders
};