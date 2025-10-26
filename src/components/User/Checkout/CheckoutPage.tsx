import {
  Container,
  Grid
} from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { APP_ROUTES, LOCAL_STORAGE_KEYS } from '../../../constant';
import { paymentMethodsDataDefault } from '../../../data/CheckoutData';
import { useAppSelector } from '../../../hooks/useAppRedux';
import { CheckoutService, type ItemsCheckoutRequest } from '../../../service/CheckoutService';
import { ShipmentService } from '../../../service/ShipmentService';
import type { AddressDto } from '../../../types/AddressType';
import type { CheckoutRequestDto, CheckoutResponseDto, PaymentGatewayType } from '../../../types/CheckoutType';
import type { CartShippingFee, CheckoutInfoDto } from '../../../types/ShipmentType';
import { getErrorMessage } from '../../../untils/ErrorUntils';
import showErrorNotification from '../../Toast/NotificationError';
import PageNotFound from '../../common/PageNotFound';
import CheckoutBreadcrumbs from './CheckoutBreadcrumbs';
import CheckoutReview from './CheckoutReview';
import ListProduct from './ListProductForShop';
import PaymentMethod from './PaymentMethod';
import Address from './address/Address';
import OverlayLoading from '../../common/OverlayLoading';


const CheckoutPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [itemCheckoutInfo, setItemCheckoutInfo] = useState<CheckoutInfoDto[]>([]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentGatewayType>('cash_on_delivery');
  const [selectedAddress, setSelectedAddress] = useState<AddressDto | null>(user?.address === undefined ? null : user?.address);
  const [feeUpdated, setFeeUpdated] = useState<CartShippingFee[] | []>([]);
  const [feeLoading, setFeeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(true);

  const idItems: ItemsCheckoutRequest = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ORDER_ITEM_IDS) || '{}');

  useEffect(() => {
    if (!idItems || Object.keys(idItems).length === 0) {
      showErrorNotification("Lỗi truy xuất", "Không tìm thấy đơn hàng nào để thanh toán");
    }
  }, []);

  useEffect(() => {
    if (user?.address) {
      setSelectedAddress(user.address);
    }
  }, [user?.address]);

  useEffect(() => {
    if (!idItems || Object.keys(idItems).length === 0) {
      return;
    }
    setItemLoading(true);
    CheckoutService.getCheckoutInfo(idItems)
      .then(data => {
        console.log('Fetched checkout info:', data);
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
    setFeeLoading(true);
    ShipmentService.getFeeForCart(getAllIdItem())
      .then(data => {
        setFeeUpdated(data);
      })
      .catch(error => showErrorNotification("Tính phí vận chuyển thất bại", getErrorMessage(error)))
      .finally(() => setFeeLoading(false));
  }, [selectedAddress])

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

    CheckoutService.createCheckout(request)
      .then((data: CheckoutResponseDto) => {
        if (data.bankTransfer) {
          window.location.href = data.urlRedirect;
        } else {
          window.location.href = APP_ROUTES.PAYMENT_RESULT(data.orderId);
        }
      })
      .catch(error => {
        showErrorNotification("Lỗi đặt hàng", getErrorMessage(error));
      })
      .finally(() => setLoading(false));
  };

  if (!idItems || Object.keys(idItems).length === 0) {
    return <PageNotFound
      title='Không tìm thấy đơn hàng để thanh toán'
      description='Bạn sẽ được chuyển hướng về trang chủ để thêm đơn hàng.'
      redirectLink={APP_ROUTES.HOME}
    />;
  }

  if (itemLoading) {
    return <OverlayLoading visible/>;
  }

  return (
    <Container size="xl" className="py-6">
      <CheckoutBreadcrumbs />
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>

          <Address
            selectedAddress={selectedAddress}
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