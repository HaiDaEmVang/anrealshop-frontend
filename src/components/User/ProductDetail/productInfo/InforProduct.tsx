import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Rating,
  SimpleGrid,
  Table,
  Text,
  Title,
  TypographyStylesProvider
} from '@mantine/core';
import { useState } from 'react';
import { FaShopify } from 'react-icons/fa';
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiGlobe,
  FiHeart,
  FiInfo,
  FiMapPin,
  FiMinus,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiShare2,
  FiShield,
  FiShoppingCart,
  FiTruck
} from 'react-icons/fi';
import type { MyShopProductSkuDto, ProductDetailDto } from '../../../../types/ProductType';
import { formatPrice, formatStringView } from '../../../../untils/Untils';
import ProductPriceAndAttributes from './ProductPriceAndAttributes';
import ProductActions from './ProductActions';
import ProductShippingInfo from './ProductShippingInfo';
import ProductDescription from './ProductDescription';

interface AttributeGroup {
  key: {
    id: string;
    displayName: string;
  };
  values: {
    value: string;
    imageUrl: string | null;
  }[];
}

interface InforProductProps {
  product: ProductDetailDto;
  selectedAttributes: Record<string, string>;
  selectedSku: MyShopProductSkuDto | null;
  onAttributeSelect: (keyId: string, value: string) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  groupedAttributes: AttributeGroup[];
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
  const [itemQuantity, setItemQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const currentPrice = selectedSku?.price || product.price || 0;
  const availableQuantity = selectedSku?.quantity || product.quantity;

  // Extract attributes for display
  const getAttributeByKey = (key: string) => {
    if (!product.attributes) return null;
    const attribute = product.attributes.find(attr => attr.attributeKeyName === key);
    return attribute ? attribute.values[0] : null;
  };

  // Get common product attributes
  const brand = getAttributeByKey('BRAND') || null;
  const origin = getAttributeByKey('ORIGIN') || null;
  const warranty = getAttributeByKey('WARRANTY') || null;
  const material = getAttributeByKey('MATERIAL') || null;
  const model = getAttributeByKey('MODEL') || null;
  const weight = product.weight ? `${product.weight / 1000}` : null;
  const dimensions = product.height && product.width && product.length 
    ? `${product.length}cm x ${product.width}cm x ${product.height}cm` 
    : null;

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
      <Box className="mb-4 bg-gray-50 p-3 rounded">
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
      </Box>

      <ProductPriceAndAttributes price={product.price} selectedSku={selectedSku} />

      <Divider className="mb-4" />

      {groupedAttributes.length > 0 && (
        <Box className="mb-6">
          {groupedAttributes.map((group, idx) => (
            <div key={idx} className="mb-2">
              <Text fw={500} className="mb-2 ">{group.key.displayName}:</Text>
              <Group>
                {group.values.map((attr, valIdx) => (
                  <Button
                    key={valIdx}
                    variant={selectedAttributes[group.key.id] === attr.value ? 'filled' : 'outline'}
                    size="xs"
                    onClick={() => onAttributeSelect(group.key.id, attr.value)}
                    className={selectedAttributes[group.key.id] === attr.value ? 'bg-primary' : 'border-gray-300'}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      paddingLeft: attr.imageUrl ? '40px' : undefined
                    }}
                  >
                    {attr.imageUrl && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-8 bg-cover bg-center border-r"
                        style={{ backgroundImage: `url(${attr.imageUrl})` }}
                      />
                    )}
                    {attr.value}
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
      <Paper withBorder p="md" radius="md" className="mb-6">
        <Group>
          <Avatar src={product.baseShopDto?.avatarUrl} radius="xl" size="lg">
            {product.baseShopDto?.name?.substring(0, 2)?.toUpperCase()}
          </Avatar>
          <div>
            <Text fw={700}>{product.baseShopDto?.name}</Text>
            <Group gap="xs">
              <Badge color="blue" variant="light">Chính hãng</Badge>
              <Badge color="green" variant="light">Phản hồi: N/A</Badge>
            </Group>
          </div>
          <Group className="ml-auto" gap="xs">
            <Button variant="outline" color="blue" size="sm">
              <FaShopify size={16} className="mr-2" /> Xem shop
            </Button>
            <Button variant="outline" color="blue" size="sm">
              Chat
            </Button>
          </Group>
        </Group>
      </Paper>

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

      {/* Thông tin vận chuyển */}
      <ProductShippingInfo weight={product.weight || 0} />

      {/* Thông tin kỹ thuật chi tiết */}
      <Box className="mb-6">
        <Accordion variant="separated">
          <Accordion.Item value="specs">
            <Accordion.Control icon={<FiInfo className="text-primary" />}>
              <Text fw={500}>Thông số kỹ thuật</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Table>
                <Table.Tbody>
                  {origin && (
                    <Table.Tr>
                      <Table.Td className="bg-gray-50 w-1/3 font-medium">Xuất xứ</Table.Td>
                      <Table.Td>{origin}</Table.Td>
                    </Table.Tr>
                  )}
                  {material && (
                    <Table.Tr>
                      <Table.Td className="bg-gray-50 font-medium">Vật liệu</Table.Td>
                      <Table.Td>{material}</Table.Td>
                    </Table.Tr>
                  )}
                  {dimensions && (
                    <Table.Tr>
                      <Table.Td className="bg-gray-50 font-medium">Kích thước</Table.Td>
                      <Table.Td>{dimensions}</Table.Td>
                    </Table.Tr>
                  )}
                  {weight && (
                    <Table.Tr>
                      <Table.Td className="bg-gray-50 font-medium">Cân nặng</Table.Td>
                      <Table.Td>{weight} kg</Table.Td>
                    </Table.Tr >
                  )}

                  {Object.keys(selectedAttributes).length > 0 && (
                    <>
                      {groupedAttributes.map(group => (
                        selectedAttributes[group.key.id] && (
                          <Table.Tr key={`selected-${group.key.id}`}>
                            <Table.Td className="bg-gray-50 font-medium">{group.key.displayName}</Table.Td>
                            <Table.Td>{selectedAttributes[group.key.id]}</Table.Td>
                          </Table.Tr>
                        )
                      ))}
                    </>
                  )}
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>

      <ProductDescription 
        description={product.description || ''} 
        sortDescription={product.sortDescription || ''} 
      />
    </div>
  );
};

export default InforProduct;