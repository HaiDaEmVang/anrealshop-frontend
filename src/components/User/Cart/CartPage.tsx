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
<<<<<<< Updated upstream
import { removeFromCart, updateCartCount } from '../../../store/authSlice';
import { useAppDispatch } from '../../../hooks/useAppRedux';
=======
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../constant';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppRedux';
>>>>>>> Stashed changes
import { CartService } from '../../../service/CartService';
import { ShipmentService } from '../../../service/ShipmentService';
import { removeFromCart, updateCartCount } from '../../../store/authSlice';
import type { CartDto } from '../../../types/CartType';
import type { CartShippingFee } from '../../../types/ShipmentType';
import { getErrorMessage } from '../../../untils/ErrorUntils';
import { ContentEmpty } from '../../common/ContentEmpty';
import { NotificationModal } from '../../common/NotificationModal';
import showErrorNotification from '../../Toast/NotificationError';
import showSuccessNotification from '../../Toast/NotificationSuccess';
import CartBreadcrumbs from './Breadcrumbs';
import ListProduct from './ListProduct';
import ListProductSkeleton, { SummerSkeleton } from './Skeleton';
import Summer from './Summer';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectAll, setSelectAll] = useState(false);

  const [shippingFees, setShippingFees] = useState<CartShippingFee[]>([]);
  const [loadingShopIds, setLoadingShopIds] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const getAllItemIds = useCallback(() => {
    if (cartItems.length === 0) return [];
    return cartItems.flatMap(shop => shop.items.map(item => item.id));
  }, [cartItems]);

  const getAllSelectedItemIds = useCallback(() => {
    if (cartItems.length === 0) return [];
    return cartItems.flatMap(shop => shop.items.filter(i => i.isSelected).map(i => i.id));
  }, [cartItems]);

  const getAllItemsIdsForShop = useCallback((itemId: string) => {
    const shop = cartItems.find(shop => shop.items.some(item => item.id === itemId));
    return shop ? { shopId: shop.shop.id, itemIds: shop.items.filter(i => i.isSelected).map(i => i.id) } : { shopId: '', itemIds: [] };
  }, [cartItems]);

  useEffect(() => {
    setLoading(true);
    CartService.getCart()
      .then((data: CartDto[]) => {
        if (!Array.isArray(data)) return;
        const normalized: CartDto[] = data.map((shop: CartDto) => ({
          ...shop,
          items: shop.items.map((item) => ({
            ...item,
            isSelected: typeof item.isSelected === 'boolean'
              ? item.isSelected
              : (item as any).selected === true
          }))
        }));
        setCartItems(normalized);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        showErrorNotification('Lấy giỏ hàng thất bại', getErrorMessage(error));
      });
  }, []);

  const fetchFee = useCallback((ids: string[]) => {
    if (ids.length === 0) {
      return;
    }
    ShipmentService.getFeeForCart(ids)
      .then(data => {
        setShippingFees(pre => {
          const dataCs = new Set(data.map(item => item.shopId));
          const filteredPre = pre.filter(item => !dataCs.has(item.shopId));
          return [...filteredPre, ...data];
        });
        setLoadingShopIds([]);
      })
      .catch(error => {
        setLoadingShopIds([]);
        showErrorNotification('Lấy phí vận chuyển thất bại', getErrorMessage(error));
      });
  }, [])


  useEffect(() => {
    const allItemIds = getAllItemIds();
    const selected = getAllSelectedItemIds();
    setSelectAll(allItemIds.length > 0 && selected.length === allItemIds.length);
  }, [cartItems, getAllItemIds, getAllSelectedItemIds]);

  useEffect(() => {
    if (loading) return;
<<<<<<< Updated upstream
=======
    if (user?.address === null || user?.address === undefined) return;
>>>>>>> Stashed changes
    const initiallySelected = getAllSelectedItemIds();
    if (initiallySelected.length === 0) return;
    const shopIds = cartItems.filter(s => s.items.some(i => i.isSelected)).map(s => s.shop.id);
    setLoadingShopIds(shopIds);
    fetchFee(initiallySelected);
<<<<<<< Updated upstream
  }, [loading, cartItems, getAllSelectedItemIds, fetchFee]);
=======
  }, [loading, cartItems, getAllSelectedItemIds, fetchFee, user?.address]);

  useEffect(() => {
    if (user && (user.address === null || user.address === undefined)) {
      setShowAddressModal(true);
    }
  }, [user?.address]);
>>>>>>> Stashed changes

  const handleSelectAll = (checked: boolean) => {
    const allIds = getAllItemIds();
    setSelectAll(checked);
    if (allIds.length === 0) return;
    CartService.updateSelectedItems(allIds, checked)
      .then(() => {
        setCartItems(prev => prev.map(shop => ({
          ...shop,
          items: shop.items.map(item => ({ ...item, isSelected: checked }))
        })));
        if (checked) {
          setLoadingShopIds(cartItems.map(shop => shop.shop.id));
          fetchFee(allIds);
        } else {
          setLoadingShopIds([]);
          setShippingFees([]);
        }
      })
      .catch(error => {
        showErrorNotification('Cập nhật chọn tất cả thất bại', getErrorMessage(error));
      });
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    CartService.updateSelectedItems([itemId], checked)
      .then(() => {
        setCartItems(prev => prev.map(shop => ({
          ...shop,
          items: shop.items.map(item => item.id === itemId ? { ...item, isSelected: checked } : item)
        })));
        const { shopId, itemIds } = getAllItemsIdsForShop(itemId);
        if (checked) {
          const idsToFetch = [...itemIds, itemId];
          setLoadingShopIds(prev => prev.includes(shopId) ? prev : [...prev, shopId]);
          fetchFee(idsToFetch);
        } else {
            if (itemIds.filter(id => id !== itemId).length === 0) {
              setShippingFees(prev => prev.filter(f => f.shopId !== shopId));
            } else {
              const remainingIds = itemIds.filter(id => id !== itemId);
              setLoadingShopIds(prev => prev.includes(shopId) ? prev : [...prev, shopId]);
              fetchFee(remainingIds);
            }
        }
      })
      .catch(error => {
        showErrorNotification('Cập nhật chọn sản phẩm thất bại', getErrorMessage(error));
      });
  };

  const handleResetCartItems = useCallback((ids: string[]) => {
    setCartItems(prevCartItems =>
      prevCartItems.map(shopGroup => ({
        ...shopGroup,
        items: shopGroup.items.filter(item => !ids.includes(item.id))
      })).filter(shopGroup => shopGroup.items.length > 0)
    );
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
    CartService.removeItemFromCart(itemId)
      .then(() => {
        handleResetCartItems([itemId]);
        dispatch(removeFromCart());
        showSuccessNotification('Xóa sản phẩm thành công', 'Sản phẩm đã được xóa khỏi giỏ hàng');
      })
      .catch(error => {
        showErrorNotification('Xóa sản phẩm thất bại', getErrorMessage(error));
      });
  };

  const handleRemoveSelected = () => {
    const selectedIds = getAllSelectedItemIds();
    if (selectedIds.length === 0) {
      showErrorNotification('Không có sản phẩm nào được chọn', 'Vui lòng chọn ít nhất một sản phẩm để xóa');
      return;
    }
    const currentCountItem = getAllItemIds().length;
    CartService.clearCart(selectedIds)
      .then((data) => {
        handleResetCartItems(selectedIds);
        dispatch(updateCartCount(currentCountItem - data.countDelete))
        showSuccessNotification('Xóa sản phẩm thành công', `${selectedIds.length} sản phẩm đã được xóa khỏi giỏ hàng`);
      })
      .catch(error => {
        showErrorNotification('Xóa sản phẩm thất bại', getErrorMessage(error));
      });
  };


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
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
                onSelectItem={handleSelectItem}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onRemoveSelected={handleRemoveSelected}
                shippingFees={shippingFees}
                loadingShopIds={loadingShopIds}
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
                cartItems={cartItems}
                shippingFees={shippingFees}
                freeShippingThreshold={500000}
                loadingShop={loadingShopIds.length > 0}
              />
            )}

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