import {
  Box,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Text,
} from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { FiTruck } from 'react-icons/fi';
import { CartService } from '../../../service/CartService';
import type { CartDto } from '../../../types/CartType';
import { getErrorMessage } from '../../../untils/ErrorUntils';
import showErrorNotification from '../../Toast/NotificationError';
import showSuccessNotification from '../../Toast/NotificationSuccess';
import CartBreadcrumbs from './Breadcrumbs';
import ListProduct from './ListProduct';
import Summer from './Summer';
import ListProductSkeleton, { SummerSkeleton } from './Skeleton';
import { useAppDispatch } from '../../../hooks/useAppRedux';
import { removeFromCart, updateCartCount } from '../../../feature/auth/authSlice';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const useDispatch = useAppDispatch();

  const getAllItemIds = useCallback(() => {
    return cartItems.flatMap(shop => shop.items.map(item => item.id));
  }, [cartItems]);

  useEffect(() => {
    setLoading(true);
    CartService.getCart()
      .then(data => {
        setCartItems(data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        showErrorNotification('Lấy giỏ hàng thất bại', getErrorMessage(error));
      });
  }, []);

  useEffect(() => {
    const allItemIds = getAllItemIds();
    setSelectAll(allItemIds.length > 0 && selectedItems.length === allItemIds.length);
  }, [selectedItems, cartItems, getAllItemIds]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(getAllItemIds());
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleResetCartItems = useCallback((ids: string[]) => {
    setCartItems(prevCartItems =>
      prevCartItems.map(shopGroup => ({
        ...shopGroup,
        items: shopGroup.items.filter(item => !ids.includes(item.id))
      })).filter(shopGroup => shopGroup.items.length > 0)
    );
    setSelectedItems(prev => prev.filter(id => !ids.includes(id)));
  }, []);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    CartService.updateQuantity(itemId, newQuantity)
      .then(() => {
        setCartItems(prevCartItems =>
          prevCartItems.map(shopGroup => ({
            ...shopGroup,
            items: shopGroup.items.map(item =>
              item.id === itemId
                ? { ...item, quantity: newQuantity }
                : item
            )
          }))
        );
      })
      .catch(error => {
        showErrorNotification('Cập nhật số lượng thất bại', getErrorMessage(error));
      });
  };


  const handleRemoveItem = (itemId: string) => {
    console.log(`Removing item ${itemId} from cart`);
    CartService.removeItemFromCart(itemId)
      .then(() => {
        handleResetCartItems([itemId]);
        useDispatch(removeFromCart());
        showSuccessNotification('Xóa sản phẩm thành công', 'Sản phẩm đã được xóa khỏi giỏ hàng');
      })
      .catch(error => {
        showErrorNotification('Xóa sản phẩm thất bại', getErrorMessage(error));
      });
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      showErrorNotification('Không có sản phẩm nào được chọn', 'Vui lòng chọn ít nhất một sản phẩm để xóa');
      return;
    }

    const currentCountItem = getAllItemIds().length;
    CartService.clearCart(selectedItems)
      .then((data) => {
        handleResetCartItems(selectedItems);
        useDispatch(updateCartCount(currentCountItem - data.countDelete))
        showSuccessNotification('Xóa sản phẩm thành công', `${selectedItems.length} sản phẩm đã được xóa khỏi giỏ hàng`);
      })
      .catch(error => {
        showErrorNotification('Xóa sản phẩm thất bại', getErrorMessage(error));
      });
  };

  const findSelectedItems = () => {
    const items = [];
    for (const shop of cartItems) {
      for (const item of shop.items) {
        if (selectedItems.includes(item.id)) {
          items.push(item);
        }
      }
    }
    return items;
  };

  const selectedItemsData = findSelectedItems();

  const subtotal = selectedItemsData.reduce((total, item) => total + (item.price * item.quantity), 0);

  const discount = 0;
  const shippingCost = subtotal > 0 ? 30000 : 0;
  const freeShippingThreshold = 500000;
  const freeShippingAmount = Math.max(0, freeShippingThreshold - subtotal);
  const total = subtotal + shippingCost;

  const hasSelectedItems = selectedItems.length > 0;

  return (
    <Container size="xl" className="py-6">
      <CartBreadcrumbs />

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper radius="md" shadow="sm" p="md" className="bg-white">
            {loading ? (
              <ListProductSkeleton />
            ) : (
              <ListProduct
                cartItems={cartItems}
                selectedItems={selectedItems}
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
                onSelectItem={handleSelectItem}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onRemoveSelected={handleRemoveSelected}
              />
            )}
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box className="sticky top-4">
            {loading ? (
              <SummerSkeleton />
            ) : (
              <Summer
                selectedItemsCount={selectedItems.length}
                subtotal={subtotal}
                discount={discount}
                shippingCost={shippingCost}
                total={total}
                hasSelectedItems={hasSelectedItems}
                freeShippingThreshold={freeShippingThreshold}
                freeShippingAmount={freeShippingAmount}
              />
            ) }

            {!loading && cartItems.length > 0 && (
              <Paper radius="md" shadow="sm" p="md" className="bg-white">
                <Box className="space-y-4">
                  <Group gap="xs">
                    <FiTruck className="text-gray-500" size={18} />
                    <Text size="sm">Miễn phí vận chuyển cho đơn hàng từ 500.000₫</Text>
                  </Group>
                  <Divider />
                  <Text size="xs" color="dimmed">
                    Lưu ý: Đơn hàng của bạn có thể được giao thành nhiều đợt tùy thuộc vào kho hàng và địa điểm giao hàng.
                  </Text>
                </Box>
              </Paper>
            )}
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CartPage;