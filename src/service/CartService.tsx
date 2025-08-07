import { API_ENDPOINTS } from "../constant";
import type { CartItemDto } from "../types/CartType";
import { axiosInstance } from "./AxiosInstant";


const getCart = async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
    return response.data;
}

const addItemToCart = async (cartItemDto: CartItemDto) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD_ITEM, cartItemDto);
    return response.data;
};

const removeItemFromCart = async (cartItemId: string) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE_ITEM(cartItemId));
    return response.data;
};

const clearCart = async (ids: string[]) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE_ITEMS, { data: { ids } });
    return response.data;
};

export const CartService = {
    getCart,
    addItemToCart,
    removeItemFromCart,
    clearCart
};