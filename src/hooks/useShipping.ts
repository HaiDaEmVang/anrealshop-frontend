import { useCallback, useEffect, useState } from 'react';
import type { PreparingShippingStatus } from '../components/Myshop/Order/Data';
import showErrorNotification from '../components/Toast/NotificationError';
import type { TypeMode } from '../constant';
import { ShippingService } from '../service/ShippingService';
import type { MyShopShippingListResponse, ShippingItems } from '../types/ShipmentType';
import { getErrorMessage } from '../untils/ErrorUntils';
import type { SearchType } from './useOrder';

export type shipParams = {
    page?: number;
    limit?: number;
    search?: string;
    searchType?: SearchType;
    preparingStatus?: PreparingShippingStatus;
    sortBy?: string | null;
}

interface UseOptions {
    mode?: TypeMode;
    autoFetch?: boolean;
    initialParams?: shipParams;
}

interface UseState {
    data: ShippingItems[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;
    isEmpty: boolean;
}

export const useShipping = (options: UseOptions = {}) => {
    const { autoFetch = false, initialParams, mode = 'myshop' } = options;

    const [state, setState] = useState<UseState>({
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        isLoading: false,
        error: null,
        isEmpty: true
    });

    const fetchData = useCallback(async (params?: shipParams) => {
        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null
        }));
        try {
            console.log('Fetching shipping data with params:', params);
            const response: MyShopShippingListResponse = await ShippingService.getMyShopShipping(params);
            const orderItems = Array.isArray(response.orderItemDtoSet) && response.orderItemDtoSet.length === 1 && response.orderItemDtoSet[0] === null ? [] : response.orderItemDtoSet;
            setState(prev => ({
                ...prev,
                data: orderItems || [],
                totalCount: response.totalCount || 0,
                totalPages: response.totalPages || 0,
                currentPage: (params?.page || 0) + 1,
                isLoading: false,
                error: null,
                isEmpty: !orderItems || orderItems.length === 0
            }));

            return response;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);

            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
                orders: [],
                totalCount: 0,
                totalPages: 0,
                isEmpty: true
            }));

            showErrorNotification('Lỗi tải đơn hàng', errorMessage);
            throw err;
        }
    }, []);



    // const rejectOrder = useCallback(async (orderItemId: string, reason: string) => {
    //     try {
    //         console.log('Rejecting order:', orderItemId, 'with reason:', reason);
    //         await OrderService.rejectOrder(orderItemId, reason);
    //         showSuccessNotification('Từ chối đơn hàng', 'Đơn hàng đã được từ chối thành công.');
    //         return true;
    //     } catch (err: any) {
    //         const errorMessage = getErrorMessage(err);
    //         showErrorNotification('Lỗi từ chối đơn hàng', errorMessage);
    //         return false;
    //     }
    // }, []);

    const refresh = useCallback(async (params?: shipParams) => {
        return fetchData(params || initialParams);
    }, [fetchData, initialParams]);

    const reset = useCallback(() => {
        setState({
            data: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            isLoading: false,
            error: null,
            isEmpty: true
        });
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchData(initialParams);
        }
    }, [autoFetch, fetchData, initialParams]);

    return {
        // State
        ...state,

        // Actions
        fetchShipping: fetchData,
        // rejectOrder,
        refresh,
        reset,

        // Computed values 
        hasOrders: state.data.length > 0,
        hasError: !!state.error,
        hasNextPage: state.currentPage < state.totalPages,
        hasPrevPage: state.currentPage > 1,
    };
};
