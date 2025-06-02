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

interface AttributeValue {
  id: string;
  value: string;
  displayOrder: number;
  metadata?: string;
  attributeKeyId: string;
}

interface AttributeKey {
  id: string;
  keyName: 'COLOR' | 'MATERIAL' | 'SIZE';
  displayName: string;
  allowCustomValues: boolean;
}

interface ProductSku {
  id: string;
  sku: string;
  price: number;
  quantity: number;
  attributes: AttributeValue[];
}

interface Shop {
  id: string;
  name: string;
  avatarUrl?: string;
  averageRating: number;
  responseTime?: string;
}

interface GroupedAttribute {
  key: AttributeKey;
  values: AttributeValue[];
}

interface InforProductProps {
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  averageRating: number;
  totalReviews: number;
  shop: Shop;
  groupedAttributes: GroupedAttribute[];
  selectedAttributes: Record<string, string>;
  selectedSku: ProductSku | null;
  onAttributeSelect: (keyId: string, value: string) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  // Thêm các props cho thông tin chi tiết sản phẩm
  brand?: string;
  origin?: string;
  model?: string;
  warranty?: string;
  weight?: number;
  dimensions?: string;
  material?: string;
}
const InforProduct = ({
  name,
  description,
  price,
  quantity,
  sold,
  averageRating,
  totalReviews,
  shop,
  groupedAttributes,
  selectedAttributes,
  selectedSku,
  onAttributeSelect,
  onAddToCart,
  onBuyNow,
  // Các props mới
  brand = "Chưa cập nhật",
  origin = "Chưa cập nhật",
  model = "Chưa cập nhật", 
  warranty = "12 tháng",
  weight,
  dimensions,
  material
}: InforProductProps) => {
  const [itemQuantity, setItemQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const currentPrice = selectedSku?.price || price || 0;
  const availableQuantity = selectedSku?.quantity || quantity;

  // Tính phí vận chuyển dựa vào weight (mô phỏng)
  const getShippingFee = () => {
    if (!weight) return "30.000₫ - 45.000₫";
    if (weight < 1) return "20.000₫ - 35.000₫";
    if (weight < 2) return "30.000₫ - 45.000₫";
    if (weight < 5) return "45.000₫ - 70.000₫";
    return "70.000₫ - 120.000₫";
  };

  // Ước tính thời gian giao hàng
  const getEstimatedDelivery = () => {
    return "Dự kiến giao hàng vào 10 - 15 Th06";
  };

  // Xử lý hiển thị mô tả ngắn hoặc đầy đủ
  const getShortDescription = () => {
    // Nếu description là HTML
    if (description?.includes('<')) {
      // Tạo một element tạm để trích xuất text
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = description;
      const textContent = tempDiv.textContent || tempDiv.innerText;
      
      if (textContent.length > 150) {
        return textContent.substring(0, 150) + '...';
      }
      return textContent;
    }
    
    // Nếu description là text thường
    if (description?.length > 150) {
      return description.substring(0, 150) + '...';
    }
    
    return description;
  };

  return (
    <div>
      <Group justify="space-between" className="mb-3">
        {quantity < 10 && (
          <Badge color="orange">Sắp hết hàng</Badge>
        )}
        <Group>
          <ActionIcon variant="subtle" color="gray" radius="xl">
            <FiShare2 size={20} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="pink" radius="xl">
            <FiHeart size={20} />
          </ActionIcon>
        </Group>
      </Group>

      <Title order={2} className="mb-3 text-slate-900">{name}</Title>

      <Group className="mb-4">
        <Rating value={averageRating} fractions={2} readOnly size="sm" />
        <Text size="sm" className="text-gray-500">{totalReviews} đánh giá</Text>
        <Text size="sm" className="text-gray-500">·</Text>
        <Text size="sm" className="text-gray-500">Đã bán: {sold}</Text>
      </Group>

      

      {/* Chi tiết sản phẩm - Thông tin quan trọng */}
      <Box className="mb-4 bg-gray-50 p-3 rounded">
        <Group className="mb-2">
          <FiInfo size={16} className="text-primary" />
          <Text fw={600} size="sm">Thông tin chính</Text>
        </Group>
        <SimpleGrid cols={{ base: 1, xs: 2 }} className="pl-6">
          {brand && (
            <Group gap="xs" className="flex-nowrap">
              <FiGlobe size={14} className="text-gray-500 flex-shrink-0" />
              <Text size="sm" span>Thương hiệu: <b>{brand}</b></Text>
            </Group>
          )}
          {origin && (
            <Group gap="xs" className="flex-nowrap">
              <FiMapPin size={14} className="text-gray-500 flex-shrink-0" />
              <Text size="sm" span>Xuất xứ: <b>{origin}</b></Text>
            </Group>
          )}
          {warranty && (
            <Group gap="xs" className="flex-nowrap">
              <FiShield size={14} className="text-gray-500 flex-shrink-0" />
              <Text size="sm" span>Bảo hành: <b>{warranty}</b></Text>
            </Group>
          )}
          {model && (
            <Group gap="xs" className="flex-nowrap">
              <FiInfo size={14} className="text-gray-500 flex-shrink-0" />
              <Text size="sm" span>Model: <b>{model}</b></Text>
            </Group>
          )}
        </SimpleGrid>
      </Box>

      <Group className="mb-4">
        <Text size="lg" fw={600} className="!text-red-600">
          {currentPrice.toLocaleString()}₫
        </Text>
        {selectedSku && selectedSku.price !== price && (
          <Text td="line-through" c="dimmed" size="lg">
            {price.toLocaleString()}₫
          </Text>
        )}
        {selectedSku && selectedSku.price !== price && (
          <Badge color="red">
            -{Math.round((1 - selectedSku.price / price) * 100)}%
          </Badge>
        )}
      </Group>

      <Divider className="mb-4" />

      

      {/* Thuộc tính sản phẩm - phần còn lại của component giữ nguyên */}
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
                  >
                    {attr.value}
                  </Button>
                ))}
              </Group>
            </div>
          ))}
        </Box>
      )}
      
      {/* Số lượng và nút mua hàng */}
      <Box className="mb-6">
        <Text fw={600} className="mb-3">Số lượng:</Text>
        <Group>
          <Group gap={0} className="!border !border-gray-300 !rounded">
            <ActionIcon size="sm"
              onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
              disabled={itemQuantity <= 1}
            >
              <FiMinus size={16} />
            </ActionIcon>
            <Box className="px-4 py-1 text-sm font-semibold">{itemQuantity}</Box>
            <ActionIcon size="sm"
              onClick={() => setItemQuantity(Math.min(availableQuantity, itemQuantity + 1))}
              disabled={itemQuantity >= availableQuantity}
            >
              <FiPlus size={16} />
            </ActionIcon>
          </Group>
          <Text size="sm">Còn lại: {availableQuantity} sản phẩm</Text>
        </Group>
      </Box>

      {/* Nút thêm vào giỏ hàng và mua ngay */}
      <Group className="mb-4">
        <Button 
          leftSection={<FiShoppingCart size={20} />}
          variant="outline" 
          color="blue"
          size="md"
          className="flex-1 border-primary text-primary"
          onClick={onAddToCart}
        >
          Thêm vào giỏ
        </Button>
        <Button 
          size="md"
          color="blue"
          className="flex-1 bg-primary hover:bg-primary-dark"
          onClick={onBuyNow}
        >
          Mua ngay
        </Button>
      </Group>

      <Divider className="mb-4" />

      {/* Thông tin về shop */}
      <Paper withBorder p="md" radius="md" className="mb-6">
        <Group>
          <Avatar src={shop?.avatarUrl} radius="xl" size="lg">
            {shop?.name?.substring(0, 2)?.toUpperCase()}
          </Avatar>
          <div>
            <Text fw={700}>{shop?.name}</Text>
            <Group gap="xs">
              <Badge color="blue" variant="light">Chính hãng</Badge>
              {shop?.responseTime && (
                <Badge color="green" variant="light">Phản hồi: {shop.responseTime}</Badge>
              )}
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
      <Box className="mb-4">
        <Accordion variant="separated">
          <Accordion.Item value="shipping">
            <Accordion.Control icon={<FiTruck className="text-primary" />}>
              <Text fw={500}>Thông tin vận chuyển</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td className="w-1/3">
                      <Group gap="xs" className="flex-nowrap">
                        <FiMapPin size={16} className="text-primary" />
                        <Text size="sm">Vận chuyển tới</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group justify="apart">
                        <Text size="sm">Hồ Chí Minh, Phường 4, Quận 3</Text>
                        <Button variant="subtle" size="xs">
                          Thay đổi
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Group gap="xs" className="flex-nowrap">
                        <FiDollarSign size={16} className="text-primary" />
                        <Text size="sm">Phí vận chuyển</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{getShippingFee()}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Group gap="xs" className="flex-nowrap">
                        <FiClock size={16} className="text-primary" />
                        <Text size="sm">Thời gian giao hàng</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{getEstimatedDelivery()}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Group gap="xs" className="flex-nowrap">
                        <FiCheckCircle size={16} className="text-green-500" />
                        <Text size="sm">Chính sách</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={8}>
                        <Badge variant="outline" color="green" size="sm">Đổi trả trong 7 ngày</Badge>
                        <Badge variant="outline" color="blue" size="sm">Hàng chính hãng</Badge>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>

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
                  {brand && (
                    <Table.Tr>
                      <Table.Td className="bg-gray-50 w-1/3 font-medium">Thương hiệu</Table.Td>
                      <Table.Td>{brand}</Table.Td>
                    </Table.Tr>
                  )}
                  {model && (
                    <Table.Tr>
                      <Table.Td className="bg-gray-50 font-medium">Model</Table.Td>
                      <Table.Td>{model}</Table.Td>
                    </Table.Tr>
                  )}
                  {origin && (
                    <Table.Tr>
                      <Table.Td className="bg-gray-50 font-medium">Xuất xứ</Table.Td>
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
                    </Table.Tr>
                  )}
                  {warranty && (
                    <Table.Tr>
                      <Table.Td className="bg-gray-50 font-medium">Bảo hành</Table.Td>
                      <Table.Td>{warranty}</Table.Td>
                    </Table.Tr>
                  )}
                  {/* Thêm các thuộc tính được chọn */}
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

      {/* Phần mô tả sản phẩm */}
      {description && (
        <Box className="mb-4">
          <Paper withBorder p="md" radius="md" className="bg-gray-50">
            <Group justify="apart" className="mb-2">
              <Group>
                <FiFileText size={16} className="text-primary" />
                <Text fw={600} size="sm">Mô tả sản phẩm</Text>
              </Group>
              {description.length > 150 && (
                <Button 
                  variant="subtle" 
                  size="xs"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                </Button>
              )}
            </Group>
            
            {showFullDescription || description.length <= 150 ? (
              <Box className="text-gray-700">
                {description.includes('<') ? (
                  <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                  </TypographyStylesProvider>
                ) : (
                  <Text>{description}</Text>
                )}
              </Box>
            ) : (
              <Box className="text-gray-700">
                <Text>{getShortDescription()}</Text>
                <Button 
                  variant="subtle" 
                  size="xs" 
                  onClick={() => setShowFullDescription(true)}
                  className="mt-2"
                >
                  Xem thêm
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      )}
    </div>
  );
};

export default InforProduct;