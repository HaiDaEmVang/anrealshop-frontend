import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Image,
  Loader,
  NumberInput,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import React from 'react';
import { FiChevronLeft, FiClock, FiShoppingBag, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { CartDto } from '../../../types/CartType';
import type { CartShippingFee } from '../../../types/ShipmentType';
import { formatPrice } from '../../../untils/Untils';

interface ListProductProps {
  cartItems: CartDto[];
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onRemoveSelected: () => void;
  shippingFees: CartShippingFee[];
  loadingShopIds: string[]; 
}

const ListProduct: React.FC<ListProductProps> = ({
  cartItems,
  selectAll,
  onSelectAll,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
  onRemoveSelected,
  shippingFees,
  loadingShopIds = []
}) => {
  const totalItems = cartItems.reduce((acc, shop) => acc + shop.items.length, 0);
  const hasSelectedItems = cartItems.some(shop => shop.items.some(i => i.isSelected));
  const isEmpty = cartItems.length === 0;

  const getShippingInfo = (shopId: string) => {
    return shippingFees.find(fee => fee.shopId === shopId);
  };

  const handleChangeSelected = (itemId: string, checked: boolean) => {
    onSelectItem(itemId, checked);
  };

  if (isEmpty) {
    return (
      <Box className="text-center py-28">
        <FiShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
        <Title order={4} className="text-slate-800 mb-3">Giỏ hàng của bạn đang trống</Title>
        <Text color="dimmed" mb={4}>
          Bạn chưa thêm sản phẩm nào vào giỏ hàng.
        </Text>
        <Button
          component={Link}
          to="/"
          size="sm"
          className="bg-primary hover:bg-picton-blue-600"
          leftSection={<FiChevronLeft size={18} />}
        >
          Tiếp tục mua sắm
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Group justify="space-between" className="mb-3">
        <Group mih={30}>
          <Checkbox
            checked={selectAll}
            onChange={(event) => onSelectAll(event.currentTarget.checked)}
            label={`Chọn tất cả (${totalItems})`}
            size="sm"
          />
        </Group>
        {hasSelectedItems && (
          <Button
            variant="subtle"
            color="red"
            size="xs"
            onClick={onRemoveSelected}
            leftSection={<FiTrash2 size={14} />}
          >
            Xóa đã chọn
          </Button>
        )}
      </Group>

      <Divider className="mb-3" />

      {cartItems.map((shopGroup) => {
        const shippingInfo = getShippingInfo(shopGroup.shop.id);
        const isShopLoading = loadingShopIds.includes(shopGroup.shop.id);
        const showShippingInfo = shippingInfo && !isShopLoading;

        return (
          <Box key={shopGroup.shop.id} className="mb-6">
            <Link to={`/shops/${shopGroup.shop.id}`} >
              <Group className="mb-3 bg-gray-50 p-3 rounded" justify="space-between">
                <Group>
                  <Avatar
                    src={shopGroup.shop.avatarUrl}
                    size="sm"
                    radius="xl"
                  />
                  <Group gap={4} align="center">
                    <FiShoppingBag size={16} className="text-primary" />
                    <Text fw={600} size="sm">{shopGroup.shop.name}</Text>
                  </Group>
                </Group>

                {showShippingInfo && (
                  <Group gap={6} className="text-primary">
                    <FiClock size={14} />
                    <Text size="xs" fw={500}>Giao hàng dự kiến: {shippingInfo.leadTime}</Text>
                  </Group>
                )}

                {isShopLoading && (
                  <Loader color="blue" size={'xs'} />
                )}
              </Group>
            </Link>

            {shopGroup.items.map((item) => {
              const inStock = item.quantity !== undefined ? item.quantity : true;
              const maxQuantity = item.maxQuantity || 100;

              return (
                <Box key={item.id} className="mb-4">
                  <Group wrap="nowrap" align="flex-start">
                    <Box className="flex items-center h-full pt-2">
                      {inStock ? (
                        <Checkbox
                          checked={item.isSelected}
                          onChange={(event) => handleChangeSelected(item.id, event.currentTarget.checked)}
                        />
                      ) : (
                        <Tooltip label="Sản phẩm hết hàng">
                          <Box>
                            <Checkbox disabled />
                          </Box>
                        </Tooltip>
                      )}
                    </Box>

                    <Link to={`/products/${item.urlSlug || item.productId}`}>
                      <Box className="w-28 h-28 flex-shrink-0">
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.name || 'Product Image'}
                          radius="md"
                          className="w-full h-full object-cover border border-gray-200"
                        />
                      </Box>
                    </Link>

                    <Box style={{ flex: 1 }}>
                      <Group justify="space-between" align="flex-start">
                        <Box style={{ flex: 1 }}>
                          <Text component={Link} to={`/products/${item.productId}`} lineClamp={2} fw={500} className="text-slate-800 hover:text-primary h-11" >
                            {item.name || 'N/A'}
                          </Text>

                          {item.attributeString && (
                            <Text size="sm" c="dimmed" mt={4}>
                              {item.attributeString}
                            </Text>
                          )}

                          {!inStock && (
                            <Badge color="red" variant="light" size="sm" mt={4}>
                              Hết hàng
                            </Badge>
                          )}

                          <Box className="md:hidden mt-3">
                            <Text fw={600} className="text-primary">
                              {formatPrice(item.price)}
                            </Text>
                          </Box>
                        </Box>

                        <Box className="hidden md:block text-right min-w-[120px]">
                          <Text fw={600} className="text-primary">
                            {formatPrice(item.price)}
                          </Text>
                        </Box>
                      </Group>

                      <Group justify="space-between" className="mt-1 md:mt-2" align="flex-end">
                        <NumberInput
                          value={typeof item.quantity === 'number' && !Number.isNaN(item.quantity) ? item.quantity : 1}
                          onChange={(val) => {
                            if (typeof val === 'number' && !Number.isNaN(val)) {
                              onUpdateQuantity(item.id, val);
                            }
                          }}
                          min={1}
                          max={maxQuantity}
                          disabled={!inStock}
                          style={{ width: '120px' }}
                          size="sm"
                        />

                        <Group className="hidden md:flex">
                          <Button
                            variant="subtle"
                            color="red"
                            size="xs"
                            leftSection={<FiTrash2 size={14} />}
                            onClick={() => onRemoveItem(item.id)}
                          >
                            Xóa
                          </Button>
                        </Group>
                      </Group>
                    </Box>
                  </Group>
                  <Divider className="mt-4" />
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default ListProduct;