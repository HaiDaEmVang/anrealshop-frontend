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
  Checkbox
} from '@mantine/core';
import { FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Interface cho sản phẩm trong giỏ hàng
export interface CartItem {
  id: string;
  productId: string;
  skuId: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  thumbnailUrl: string;
  attributes: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  inStock: boolean;
  maxQuantity: number;
}

interface ListProductProps {
  cartItems: CartItem[];
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
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <Box>
      {/* Header của giỏ hàng */}
      <Group justify="space-between" className="mb-3">
        <Group>
          <Checkbox
            checked={selectAll}
            onChange={(event) => onSelectAll(event.currentTarget.checked)}
            label={`Chọn tất cả (${cartItems.filter(item => item.inStock).length})`}
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
      
      {/* Danh sách sản phẩm */}
      {cartItems.map((item) => (
        <Box key={item.id} className="mb-4">
          <Group wrap="nowrap" align="flex-start">
            {/* Checkbox chọn sản phẩm */}
            <Box className="flex items-center h-full pt-2">
              {item.inStock ? (
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
            
            {/* Ảnh sản phẩm */}
            <Box component={Link} to={`/products/${item.productId}`} className="w-28 h-28 flex-shrink-0">
              <Image
                src={item.thumbnailUrl}
                alt={item.name}
                radius="md"
                className="w-full h-full object-cover border border-gray-200"
              />
            </Box>
            
            {/* Thông tin sản phẩm */}
            <Box style={{ flex: 1 }}>
              <Group justify="space-between" align="flex-start">
                <Box style={{ flex: 1 }}>
                  {/* Tên sản phẩm */}
                  <Text component={Link} to={`/products/${item.productId}`} lineClamp={2} fw={500} className="text-slate-800 hover:text-primary">
                    {item.name}
                  </Text>
                  
                  {/* Thuộc tính sản phẩm */}
                  <Text size="xs" color="dimmed" mt={4}>
                    {item.attributes.color && item.attributes.size 
                      ? `${item.attributes.color}, ${item.attributes.size}`
                      : item.attributes.color || item.attributes.size || ''}
                  </Text>
                  
                  {/* Trạng thái hàng */}
                  {!item.inStock && (
                    <Badge color="red" variant="light" size="sm" mt={4}>
                      Hết hàng
                    </Badge>
                  )}

                  {/* Giá sản phẩm (chỉ hiển thị ở màn hình nhỏ) */}
                  <Box className="md:hidden mt-3">
                    <Group gap={8}>
                      <Text fw={600} className="text-primary">
                        {item.price.toLocaleString()}₫
                      </Text>
                      
                      {item.price !== item.originalPrice && (
                        <Text size="sm" td="line-through" color="dimmed">
                          {item.originalPrice.toLocaleString()}₫
                        </Text>
                      )}
                    </Group>
                  </Box>
                  
                </Box>
                
                {/* Giá và số lượng (hiển thị ở màn hình lớn) */}
                <Box className="hidden md:block text-right min-w-[120px]">
                  <Group gap={8} justify="flex-end">
                    <Text fw={600} className="text-primary">
                      {item.price.toLocaleString()}₫
                    </Text>
                    
                    {item.price !== item.originalPrice && (
                      <Text size="sm" td="line-through" color="dimmed">
                        {item.originalPrice.toLocaleString()}₫
                      </Text>
                    )}
                  </Group>
                </Box>
              </Group>
              
              {/* Điều khiển số lượng và các nút */}
              <Group justify="space-between" className="mt-3 md:mt-6" align="flex-end">
                {/* Số lượng */}
                <NumberInput
                  value={item.quantity}
                  onChange={(val) => onUpdateQuantity(item.id, val as number)}
                  min={1}
                  max={item.maxQuantity}
                  disabled={!item.inStock}
                  style={{ width: '120px' }}
                  size="sm"
                />

                {/* Nút Xóa (chỉ hiển thị ở màn hình lớn) */}
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
      ))}
    </Box>
  );
};

export default ListProduct;