import React from 'react';
import { 
  Box, 
  Group, 
  Text, 
  Image, 
  NumberInput, 
  Button, 
  Divider, 
  Badge, 
  Tooltip, 
  Checkbox,
  Avatar,
  Title
} from '@mantine/core';
import { FiTrash2, FiShoppingBag, FiChevronLeft, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../untils/Untils';
import type { CartDto } from '../../../types/CartType';


interface ListProductProps {
  cartItems: CartDto[];
  selectedItems: string[];
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onRemoveSelected: () => void;
}

const ListProduct: React.FC<ListProductProps> = ({
  cartItems,
  selectedItems,
  selectAll,
  onSelectAll,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
  onRemoveSelected
}) => {
  const totalItems = cartItems.reduce((acc, shop) => acc + shop.items.length, 0);
  const hasSelectedItems = selectedItems.length > 0;
  const isEmpty = cartItems.length === 0;

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
        <Group>
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
      
      {cartItems.map((shopGroup) => (
        <Box key={shopGroup.shop.id} component={Link} to={`/shops/${shopGroup.shop.id}`} className="mb-6">
          <Group className="mb-3 bg-gray-50 p-3 rounded">
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

          {shopGroup.items.map((item) => {
            const inStock = item.quantity !== undefined ? item.quantity : true;
            const maxQuantity = item.maxQuantity || 100;
            
            return (
              <Box key={item.id} className="mb-4">
                <Group wrap="nowrap" align="flex-start">
                  <Box className="flex items-center h-full pt-2">
                    {inStock ? (
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={(event) => onSelectItem(item.id, event.currentTarget.checked)}
                      />
                    ) : (
                      <Tooltip label="Sản phẩm hết hàng">
                        <Box>
                          <Checkbox disabled />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>

                  <Box component={Link} to={`/products/${item.urlSlug || item.productId}`} className="w-28 h-28 flex-shrink-0">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.name || 'Product Image'}
                      radius="md"
                      className="w-full h-full object-cover border border-gray-200"
                    />
                  </Box>
                  
                  <Box style={{ flex: 1 }}>
                    <Group justify="space-between" align="flex-start">
                      <Box style={{ flex: 1 }}>
                        <Text component={Link} to={`/products/${item.productId}`} lineClamp={2} fw={500} className="text-slate-800 hover:text-primary h-11" >
                          {item.name || 'N/A'}
                        </Text>
                        
                        {item.attributeString && (
                          <Text size="sm" color="dimmed" mt={4}>
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
                        value={item.quantity}
                        onChange={(val) => onUpdateQuantity(item.id, val as number)}
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
      ))}
    </Box>
  );
};

export default ListProduct;