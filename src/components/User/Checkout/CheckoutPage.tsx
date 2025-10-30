import {
  Container,
  Grid
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';

// Import Address component
import { paymentMethodsDataDefault } from '../../../data/CheckoutData';
import { useAppSelector } from '../../../hooks/useAppRedux';
import { CheckoutService, type ItemsCheckoutRequest } from '../../../service/CheckoutService';
import { ShipmentService } from '../../../service/ShipmentService';
import type { AddressDto } from '../../../types/AddressType';
import type { CheckoutRequestDto, CheckoutResponseDto, PaymentGatewayType } from '../../../types/CheckoutType';
import type { CartShippingFee, CheckoutInfoDto, CheckoutShippingFee } from '../../../types/ShipmentType';
import { getErrorMessage } from '../../../untils/ErrorUntils';
import showErrorNotification from '../../Toast/NotificationError';
<<<<<<< Updated upstream
=======
import { NotificationModal } from '../../common/NotificationModal';
import OverlayLoading from '../../common/OverlayLoading';
import PageNotFound from '../../common/PageNotFound';
>>>>>>> Stashed changes
import CheckoutBreadcrumbs from './CheckoutBreadcrumbs';
import CheckoutReview from './CheckoutReview';
import ListProduct from './ListProductForShop';
import PaymentMethod from './PaymentMethod';
import Address from './address/Address';
<<<<<<< Updated upstream
import { APP_ROUTES, LOCAL_STORAGE_KEYS } from '../../../constant';
=======
>>>>>>> Stashed changes


const CheckoutPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [itemCheckoutInfo, setItemCheckoutInfo] = useState<CheckoutInfoDto[]>([]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentGatewayType>('cash_on_delivery');
  const [selectedAddress, setSelectedAddress] = useState<AddressDto | null>(null);
  const [feeUpdated, setFeeUpdated] = useState<CartShippingFee[] | []>([]);
  const [feeLoading, setFeeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(true);
<<<<<<< Updated upstream
=======
  const [showAddressModal, setShowAddressModal] = useState(false);
>>>>>>> Stashed changes

  const idItems: ItemsCheckoutRequest = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDER_ITEM_IDS) || '{}');

  useEffect(() => {
<<<<<<< Updated upstream
    if (!idItems) {
      showErrorNotification("Lỗi thanh toán", "Không tìm thấy sản phẩm nào để thanh toán");
      return;
    }
    setItemLoading(true);
    CheckoutService.getCheckoutInfo(idItems)
    .then(data => {
      setItemCheckoutInfo(data);
    })
    .catch(error => showErrorNotification("Tải danh sách sản phẩm thất bại", getErrorMessage(error)))
    .finally(() => setItemLoading(false));
  }, [])

  const getAllIdItem = useCallback(() => {
    return itemCheckoutInfo.map(item => item.items.map(i => i.id)).flat();
  }, [itemCheckoutInfo])

  const refreshFee = useCallback(() => {
    if (!selectedAddress || !itemCheckoutInfo.length) return;
=======
    if (!idItems || Object.keys(idItems).length === 0) {
      showErrorNotification("Lỗi truy xuất", "Không tìm thấy đơn hàng nào để thanh toán");
    }
  }, []);

  useEffect(() => {
    if (user && (user.address === null || user.address === undefined)) {
      setItemLoading(false);
      setShowAddressModal(true);
    } else if (user && user.address) {
      setSelectedAddress(user?.address || null);
    }
  }, [user?.address]);

  useEffect(() => {
    if (!idItems || Object.keys(idItems).length === 0) {
      return;
    }
    if (!user || user.address === null || user.address === undefined) {
      return;
    }
    setItemLoading(true);
    CheckoutService.getCheckoutInfo(idItems)
      .then(data => {
        setItemCheckoutInfo(data);
      })
      .catch(error => showErrorNotification("Tải danh sách sản phẩm thất bại", getErrorMessage(error)))
      .finally(() => setItemLoading(false));
  }, [user]);

  const refreshFee = useCallback(() => {
    if (!selectedAddress || itemCheckoutInfo.length < 1) return;
>>>>>>> Stashed changes
    setFeeLoading(true);
    const checkoutShippingFee: CheckoutShippingFee = {
      userAddressId: selectedAddress.id,
      checkoutItems: Object.fromEntries(
        itemCheckoutInfo.flatMap(item => item.items.map(i => [i.id, i.quantity]))
      ),
    }
    ShipmentService.getFeeForCheckout(checkoutShippingFee)
      .then(data => {
        setFeeUpdated(data);
      })
      .catch(error => showErrorNotification("Tính phí vận chuyển thất bại", getErrorMessage(error)))
      .finally(() => setFeeLoading(false));
<<<<<<< Updated upstream
  }, [selectedAddress])
=======
  }, [selectedAddress, itemCheckoutInfo]);
>>>>>>> Stashed changes

  useEffect(() => {
    refreshFee();
  }, [selectedAddress]);
  
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      showErrorNotification("Lỗi đặt hàng", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    
    setLoading(true);
    const request: CheckoutRequestDto = {
      addressId: selectedAddress.id,
      paymentMethod: selectedPaymentMethod === 'cash_on_delivery' ? 'cash_on_delivery' : 'bank_transfer',
      paymentGateway: selectedPaymentMethod,
      items: itemCheckoutInfo.flatMap(item => item.items.map(i => ({
        productSkuId: i.productSkuId,
        quantity: i.quantity
      })))
    }

    console.log('Checkout request:', request);

    CheckoutService.createCheckout(request)
    .then((data: CheckoutResponseDto) => {
      localStorage.remove(LOCAL_STORAGE_KEYS.ORDER_ITEM_IDS);
      if (data.bankTransfer) {
        window.location.href = data.urlRedirect;
      }else {
        window.location.href = APP_ROUTES.PAYMENT_RESULT(data.orderId);
      }
      setLoading(false);
    })
    .catch(error => {
      setLoading(false);
      showErrorNotification("Lỗi đặt hàng", getErrorMessage(error));
    });
  };

<<<<<<< Updated upstream
=======
  const handleNavigateToAddress = () => {
    setShowAddressModal(false);
    navigate(APP_ROUTES.USER_ADDRESSES);
  };

  const handleCancelAddress = () => {
    setShowAddressModal(false);
    navigate(-1);
  };

  if (!idItems || Object.keys(idItems).length === 0) {
    return <PageNotFound
      title='Không tìm thấy đơn hàng để thanh toán'
      description='Bạn sẽ được chuyển hướng về trang chủ để thêm đơn hàng.'
      redirectLink={APP_ROUTES.HOME}
    />;
  }

  if (loading) {
    return <OverlayLoading visible message={`${loading ? 'Đang tạo đơn hàng' : undefined}...`} />;
  }
>>>>>>> Stashed changes

  return (
    <Container size="xl" className="py-6">
      <CheckoutBreadcrumbs />
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>

          <Address
            selectedAddress={selectedAddress }
            setSelectedAddress={setSelectedAddress}
          />

          <ListProduct 
            cartItems={itemCheckoutInfo} 
            feeUpdate={feeUpdated} 
            feeLoading={feeLoading}
            isLoading={itemLoading} 
          />

          
        <PaymentMethod
          paymentMethods={paymentMethodsDataDefault}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
        />


        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
        <div className="sticky top-4">
          <CheckoutReview
            itemCheckoutInfo={itemCheckoutInfo}
            feeUpdated={feeUpdated}
            feeLoading={feeLoading}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
            isLoading={itemLoading}
          />
        </div>
      </Grid.Col>
      </Grid>
    </Container>
  );
}

export default CheckoutPage;