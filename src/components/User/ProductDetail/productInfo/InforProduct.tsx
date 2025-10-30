import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Rating,
  SimpleGrid,
  Text,
  Title
} from '@mantine/core';
import {
  FiHeart,
  FiPackage,
  FiRefreshCw,
  FiShare2,
  FiShield,
  FiTruck
} from 'react-icons/fi';
import type { ProductAttribute } from '../../../../types/AttributeType';
import type { MyShopProductSkuDto, ProductDetailDto } from '../../../../types/ProductType';
import { formatStringView } from '../../../../untils/Untils';
import { AttributeInfor } from './AttributeInfor';
import ProductActions from './ProductActions';
import ProductDescription from './ProductDescription';
import ProductPriceAndAttributes from './ProductPriceAndAttributes';
import ProductShippingInfo from './ProductShippingInfo';
import { ShopInfo } from './ShopInfo';
<<<<<<< Updated upstream
import { useState } from 'react';
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> Stashed changes



interface InforProductProps {
  product: ProductDetailDto;
  selectedAttributes: Record<string, string>;
  selectedSku: MyShopProductSkuDto | null;
  onAttributeSelect: (keyId: string, value: string) => void;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
  groupedAttributes: ProductAttribute[];
}

const InforProduct = ({
  product,
  selectedAttributes,
  selectedSku,
  onAttributeSelect,
  onAddToCart,
  onBuyNow,
  groupedAttributes,
}: InforProductProps) => {
  const availableQuantity = selectedSku?.quantity || product.quantity;
<<<<<<< Updated upstream
=======
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleAddToCart = (quantity: number) => {
    if (!isAuthenticated) {
      showErrorNotification("Thông báo", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    if (!selectedSku || Object.keys(selectedAttributes).length !== selectedSku.attributeForSku?.length) {
      showErrorNotification("Thông báo", "Vui lòng chọn đầy đủ thuộc tính sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }
    if (quantity < 1 || quantity > selectedSku.quantity) {
      showErrorNotification("Thông báo", "Số lượng không hợp lệ hoặc vượt quá số lượng có sẵn.");
      return;
    }

    const cartItemDto: CartAddItemDto = {
      productSkuId: selectedSku.id,
      quantity: quantity,
    }

    CartService.addItemToCart(cartItemDto)
      .then((data) => {
        showSuccessNotification("Thông báo", "Sản phẩm đã được thêm vào giỏ hàng thành công.");
        if (data.isNew)
          dispatch(addToCart());
      })
      .catch((error) => {
        showErrorNotification("Lỗi", getErrorMessage(error));
      });
  }


  const handleBuyNow = (quantity: number) => {
    if (!isAuthenticated) {
      showErrorNotification("Thông báo", "Vui lòng đăng nhập để mua sản phẩm.");
      return;
    }
    if (!selectedSku || Object.keys(selectedAttributes).length !== selectedSku.attributeForSku?.length) {
      showErrorNotification("Thông báo", "Vui lòng chọn đầy đủ thuộc tính sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }
    if (quantity < 1 || quantity > selectedSku.quantity) {
      showErrorNotification("Thông báo", "Số lượng không hợp lệ hoặc vượt quá số lượng có sẵn.");
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDER_ITEM_IDS, JSON.stringify({ [selectedSku.id]: quantity }));

    navigate(APP_ROUTES.CHECKOUT);
  }

>>>>>>> Stashed changes

  return (
    <div>
      <Group justify="space-between" align="flex-start" wrap='nowrap' className="mb-4">
        <Title order={2} className="mb-3 text-slate-900">{formatStringView(product.name)}</Title>

        <Group justify="space-between" wrap="nowrap">
          {product.quantity < 10 && (
            <Badge color="orange">Sắp hết hàng</Badge>
          )}
          <Group justify="space-between" wrap="nowrap">
            <ActionIcon variant="subtle" color="gray" radius="xl">
              <FiShare2 size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="pink" radius="xl">
              <FiHeart size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </Group>

      <Group className="mb-4">
        {product.totalReviews && product.totalReviews > 0 && (
          <Rating value={product.averageRating} fractions={2} readOnly size="sm" />
        )}
        <Text size="sm" className="text-gray-500">
          {product.totalReviews === 0 ? 'Chưa có' : product.totalReviews} đánh giá
        </Text>
        <Text size="sm" className="text-gray-500">·</Text>
        <Text size="sm" className="text-gray-500">Đã bán: {product.sold}</Text>
        <Text size="sm" className="text-gray-500">·</Text>
        <Text size="sm" className="text-gray-500">Còn lại: {availableQuantity}</Text>
      </Group>

      {/* Chi tiết sản phẩm - Thông tin quan trọng */}
      {/* <Box className="mb-4 bg-gray-50 p-3 rounded">
        <Group className="mb-2">
          <FiInfo size={16} className="text-primary" />
          <Text fw={600} size="sm">Thông tin chính</Text>
        </Group>
        <SimpleGrid cols={{ base: 1, xs: 2 }} className="pl-6">
          {origin && (
            <Group gap="xs" className="flex-nowrap">
              <FiMapPin size={14} className="text-gray-500 flex-shrink-0" />
              <Text size="sm" span>Xuất xứ: <b>{origin}</b></Text>
            </Group>
          )}
          {material && (
            <Group gap="xs" className="flex-nowrap">
              <FiInfo size={14} className="text-gray-500 flex-shrink-0" />
              <Text size="sm" span>Chất liệu: <b>{material}</b></Text>
            </Group>
          )}
        </SimpleGrid>
      </Box> */}

      <ProductPriceAndAttributes price={product.price} selectedSku={selectedSku} />

      <Divider className="mb-4" />

      {groupedAttributes.length > 0 && (
        <Box className="mb-6">
          {groupedAttributes.map((group, idx) => (
            <div key={idx} className="mb-2">
              <Text fw={500} className="mb-2 ">{group.attributeKeyDisplay}:</Text>
              <Group>
                {Array.from(group.values).map((attr, valIdx) => (
                  <Button
                    key={valIdx}
                    variant={selectedAttributes[group.attributeKeyName] === attr ? 'filled' : 'outline'}
                    size="xs"
                    onClick={() => onAttributeSelect(group.attributeKeyName, attr)}
                    className={selectedAttributes[group.attributeKeyName] === attr ? '!bg-primary' : '!border-gray-300'}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {attr}
                  </Button>
                ))}
              </Group>
            </div>
          ))}
        </Box>
      )}

      <ProductActions
        availableQuantity={availableQuantity}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
      />

      <Divider className="mb-4" />

      {/* Thông tin về shop */}
      <ShopInfo
        id={product.baseShopDto?.id || ''}
        url={product.baseShopDto?.avatarUrl || ''}
        name={product.baseShopDto?.name || 'Shop không rõ'}
      />

      {/* Cam kết */}
      <SimpleGrid cols={{ base: 2, md: 4 }} className="mb-6">
        <Paper withBorder p="md" radius="md" className="!flex !items-center !flex-nowrap">
          <FiTruck size={20} className="text-primary mr-3" />
          <Text size="sm">Giao hàng nhanh</Text>
        </Paper>
        <Paper withBorder p="md" radius="md" className="!flex !items-center !flex-nowrap">
          <FiShield size={20} className="text-primary mr-3" />
          <Text size="sm">Bảo hành chính hãng</Text>
        </Paper>
        <Paper withBorder p="md" radius="md" className="!flex !items-center !flex-nowrap">
          <FiPackage size={20} className="text-primary mr-3" />
          <Text size="sm">Đổi trả trong 7 ngày</Text>
        </Paper>
        <Paper withBorder p="md" radius="md" className="!flex !items-center !flex-nowrap">
          <FiRefreshCw size={20} className="text-primary mr-3" />
          <Text size="sm">Hoàn tiền 100%</Text>
        </Paper>
      </SimpleGrid>

      <ProductShippingInfo weight={product.weight || 0} />

      <AttributeInfor
        attributes={product.attributes || []}
        selectedAttributes={selectedAttributes}
        groupedAttributes={groupedAttributes}
      />

      <ProductDescription
        description={product.description || ''}
        sortDescription={product.sortDescription || ''}
      />
    </div>
  );
};

export default InforProduct;