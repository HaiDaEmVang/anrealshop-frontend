import { useState } from 'react';
import type {
  ShippingProduct,
  ShippingInformation,
  ShippingOrder,
  BatchShippingRequest,
  BatchShippingResponse
} from '../types/ShippingType';

interface UseShippingProps {
  onSuccess?: (data: ShippingOrder) => void;
  onError?: (error: string) => void;
}

export const useShipping = (props?: UseShippingProps) => {
  const { onSuccess, onError } = props || {};
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingOrder, setShippingOrder] = useState<ShippingOrder | null>(null);

  /**
   * Create a batch shipping order
   */
  const createBatchShipping = async (
    products: ShippingProduct[],
    shippingInfo: ShippingInformation
  ): Promise<BatchShippingResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock a successful response
      const order: ShippingOrder = {
        id: `SHIP-${Math.floor(Math.random() * 1000000)}`,
        products,
        shipping: shippingInfo,
        totalCost: products.reduce((sum, p) => sum + (p.price * p.quantity), 0) + (shippingInfo.method === 'nhanh' ? 30000 : shippingInfo.method === 'tietkiem' ? 15000 : 60000),
        subtotal: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        shippingCost: shippingInfo.method === 'nhanh' ? 30000 : shippingInfo.method === 'tietkiem' ? 15000 : 60000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setShippingOrder(order);

      if (onSuccess) {
        onSuccess(order);
      }

      setIsLoading(false);
      return {
        success: true,
        message: 'Đã tạo đơn giao hàng thành công',
        shippingOrder: order
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo đơn giao hàng';
      setError(errorMsg);

      if (onError) {
        onError(errorMsg);
      }

      setIsLoading(false);
      return {
        success: false,
        message: errorMsg,
        errors: [errorMsg]
      };
    }
  };

  /**
   * Get pending products for batch shipping
   */
  const getPendingShippingProducts = async (): Promise<ShippingProduct[]> => {
    setIsLoading(true);

    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock products data
      const products: ShippingProduct[] = [
        {
          id: '1',
          productId: 'SP001',
          orderId: 'ORD123456',
          image: 'https://placekitten.com/200/200',
          name: 'Áo thun nam dáng rộng cao cấp',
          variant: 'Màu đen, Size L',
          quantity: 2,
          price: 250000,
          customerName: 'Nguyễn Văn A',
          shippingUnit: 'Giao Hàng Nhanh',
          confirmationTime: '2023-08-15T09:30:00',
          status: 'CONFIRMED',
          shippingId: 'SPXVN123456',
          paymentMethod: 'CASH_ON_DELIVERY'
        },
        {
          id: '2',
          productId: 'SP002',
          orderId: 'ORD123457',
          image: 'https://placekitten.com/201/201',
          name: 'Quần jean nam dáng slim fit',
          variant: 'Xanh đậm, Size 32',
          quantity: 1,
          price: 450000,
          customerName: 'Trần Thị B',
          shippingUnit: 'J&T Express',
          confirmationTime: '2023-08-14T15:45:00',
          status: 'SHIPPING',
          shippingId: 'JT758493021',
          paymentMethod: 'BANK_TRANSFER'
        },
        {
          id: '3',
          productId: 'SP003',
          orderId: 'ORD123458',
          image: 'https://placekitten.com/202/202',
          name: 'Giày thể thao nữ',
          variant: 'Trắng, Size 38',
          quantity: 1,
          price: 850000,
          customerName: 'Lê Văn C',
          shippingUnit: 'Viettel Post',
          confirmationTime: '2023-08-13T11:20:00',
          status: 'DELIVERED',
          shippingId: 'VTP9385721',
          paymentMethod: 'E_WALLET'
        },
        {
          id: '4',
          productId: 'SP004',
          orderId: 'ORD123459',
          image: 'https://placekitten.com/203/203',
          name: 'Túi xách nữ thời trang',
          variant: 'Đen, Size M',
          quantity: 1,
          price: 1250000,
          customerName: 'Phạm Thị D',
          shippingUnit: 'Giao Hàng Tiết Kiệm',
          confirmationTime: '2023-08-15T14:15:00',
          status: 'PENDING',
          shippingId: 'GHTK8273641',
          paymentMethod: 'CREDIT_CARD'
        },
        {
          id: '5',
          productId: 'SP005',
          orderId: 'ORD123460',
          image: 'https://placekitten.com/204/204',
          name: 'Đồng hồ nam dây da',
          variant: 'Nâu, Size One Size',
          quantity: 1,
          price: 1750000,
          customerName: 'Hoàng Văn E',
          shippingUnit: 'BEST Express',
          confirmationTime: '2023-08-12T08:45:00',
          status: 'CONFIRMED',
          shippingId: 'BEST8374921',
          paymentMethod: 'BANK_TRANSFER'
        },
        {
          id: '6',
          productId: 'SP006',
          orderId: 'ORD123461',
          image: 'https://placekitten.com/205/205',
          name: 'Ví da nam cao cấp',
          variant: 'Đen, Size One Size',
          quantity: 1,
          price: 550000,
          customerName: 'Đỗ Thị F',
          shippingUnit: 'Ninja Van',
          confirmationTime: '2023-08-11T16:30:00',
          status: 'CANCELLED',
          shippingId: 'NJV7394825',
          paymentMethod: 'CASH_ON_DELIVERY',
          cancelReason: 'Khách hàng đổi ý'
        },
        {
          id: '7',
          productId: 'SP007',
          orderId: 'ORD123462',
          image: 'https://placekitten.com/206/206',
          name: 'Áo khoác nữ mùa đông',
          variant: 'Nâu, Size M',
          quantity: 1,
          price: 950000,
          customerName: 'Võ Văn G',
          shippingUnit: 'Giao Hàng Nhanh',
          confirmationTime: '2023-08-15T10:20:00',
          status: 'SHIPPING',
          shippingId: 'SPXVN987654',
          paymentMethod: 'E_WALLET'
        }
      ];

      setIsLoading(false);
      return products;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải sản phẩm';
      setError(errorMsg);
      setIsLoading(false);
      return [];
    }
  };

  return {
    isLoading,
    error,
    shippingOrder,
    createBatchShipping,
    getPendingShippingProducts,
  };
};