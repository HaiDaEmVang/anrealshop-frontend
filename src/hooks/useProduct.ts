import { useState, useCallback, useEffect } from 'react';
import ProductsService from '../service/ProductsService';
import type {
    MyShopProductDto,
    MyShopProductListResponse,
    ProductCreateRequest,
    ProductStatus,
    ProductStatusDto,
} from '../types/ProductType';
import showErrorNotification from '../components/Toast/NotificationError';
import showSuccessNotification from '../components/Toast/NotificationSuccess';
import { productStatusDefaultData } from '../data/ProductData';

interface UseProductOptions {
    autoFetch?: boolean;
    initialParams?: {
        page?: number;
        limit?: number;
        status?: ProductStatus;
        search?: string;
        categoryId?: string;
        sortBy?: string;
    };
}

interface UseProductState {
    products: MyShopProductDto[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;
    isEmpty: boolean;
}

export const useProduct = (options: UseProductOptions = {}) => {
    const { autoFetch = false, initialParams } = options;

    const [state, setState] = useState<UseProductState>({
        products: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        isLoading: false,
        error: null,
        isEmpty: true
    });

    const [statusMetadata, setStatusMetadata] = useState<ProductStatusDto[]>(productStatusDefaultData);

    // Fetch products with error handling
    const fetchProducts = useCallback(async (params?: {
        page?: number;
        limit?: number;
        status?: ProductStatus;
        search?: string;
        categoryId?: string;
        sortBy?: string;
    }) => {
        console.log('Fetching products with params:', {
            page: params?.page || 0,
            limit: params?.limit || 12,
            status: params?.status || undefined,
            search: params?.search || undefined,
            categoryId: params?.categoryId || undefined,
            sortBy: params?.sortBy || undefined
        });
        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null
        }));

        try {
            const response: MyShopProductListResponse = await ProductsService.getMyShopProducts(params);

            setState(prev => ({
                ...prev,
                products: response.products || [],
                totalCount: response.totalCount || 0,
                totalPages: response.totalPages || 0,
                currentPage: (params?.page || 0) + 1,
                isLoading: false,
                error: null,
                isEmpty: !response.products || response.products.length === 0
            }));

            return response;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);

            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
                products: [],
                totalCount: 0,
                totalPages: 0,
                isEmpty: true
            }));

            showErrorNotification('Lỗi tải sản phẩm', errorMessage);
            throw err;
        }
    }, []);




    // Update product visibility with error handling
    const updateVisibility = useCallback(async (id: string, visible: boolean) => {
        try {
            await ProductsService.updateVisibility(id, visible);
            const statusText = visible ? 'hiển thị' : 'ẩn';
            showSuccessNotification('Thành công', `Sản phẩm đã được ${statusText}.`);

            setState(prev => ({
                ...prev,
                products: prev.products.map(p =>
                    p.id === id ? { ...p, visible } : p
                )
            }));

            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi cập nhật sản phẩm', errorMessage);
            throw err;
        }
    }, []);

    const updateVisibilityMultible = useCallback(async (ids: string[], visible: boolean) => {
        try {
            await ProductsService.updateProductsVisibility(ids, visible);
            const statusText = visible ? 'hiển thị' : 'ẩn';
            showSuccessNotification('Thành công', `Sản phẩm đã được ${statusText}.`);

            for (const id of ids) {
                setState(prev => ({
                    ...prev,
                    products: prev.products.map(p =>
                        p.id === id ? { ...p, visible } : p
                    )
                }));
            }

            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi cập nhật sản phẩm', errorMessage);
            throw err;
        }
    }, []);


    // Refresh current data
    const refresh = useCallback(async (params?: {
        page?: number;
        limit?: number;
        status?: ProductStatus;
        search?: string;
        categoryId?: string;
        sortBy?: string;
    }) => {
        return fetchProducts(params || initialParams);
    }, [fetchProducts, initialParams]);

    // Reset state
    const reset = useCallback(() => {
        setState({
            products: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            isLoading: false,
            error: null,
            isEmpty: true
        });
    }, []);

    const fetchStatusMetadata = useCallback(async () => {
        console.log('Fetching product status metadata');
        try {
            const metadata = await ProductsService.getProductStatusMetadata();
            setStatusMetadata(metadata);
            return metadata;
        } catch (err: any) {
            setStatusMetadata(productStatusDefaultData);
            return productStatusDefaultData;
        }
    }, []);

    // Auto fetch on mount if enabled
    useEffect(() => {
        if (autoFetch) {
            fetchProducts(initialParams);
        }
    }, [autoFetch, fetchProducts, initialParams]);

    return {
        // State
        ...state,
        statusMetadata,

        // Actions
        fetchProducts,
        fetchStatusMetadata,
        updateVisibility,
        updateVisibilityMultible,
        refresh,
        reset,

        // Computed values
        hasProducts: state.products.length > 0,
        hasError: !!state.error,
        hasNextPage: state.currentPage < state.totalPages,
        hasPrevPage: state.currentPage > 1,
    };
};

export const useProductDelete = () => {
    const [isLoading, setIsLoading] = useState(false);
    const deleteProduct = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            await ProductsService.deleteProduct(id);
            showSuccessNotification('Thành công', 'Sản phẩm đã được xóa thành công.');

            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi xóa sản phẩm', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);
    const deleteProducts = useCallback(async (ids: string[]) => {
        try {
            setIsLoading(true);
            await ProductsService.deleteProducts(ids);
            showSuccessNotification('Thành công', 'Sản phẩm đã được xóa thành công.');
            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi xóa sản phẩm', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);
    return {
        deleteProduct,
        deleteProducts,
        isLoading
    };
}

// Utility function to extract error messages from backend
const getErrorMessage = (error: any): string => {
    // Sử dụng message từ backend response trước
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    // Fallback cho các lỗi network hoặc không có response
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.';
    }

    // Fallback cuối cùng
    return error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
};

// Hook for product operations (update)
export const useProductOperations = () => {
    const [isLoading, setIsLoading] = useState(false);


    const updateProduct = useCallback(async (id: string, data: ProductCreateRequest) => {
        setIsLoading(true);
        try {
            const result = await ProductsService.update(id, data);
            showSuccessNotification('Thành công', 'Sản phẩm đã được cập nhật thành công.');
            return result;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi cập nhật sản phẩm', errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        updateProduct
    };
};