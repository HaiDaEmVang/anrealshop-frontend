import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { FiBox, FiCheck, FiHeart, FiShare2, FiShoppingBag, FiTruck } from 'react-icons/fi';

interface ProductReviewProps {
  form: any;
  media: Array<{
    file?: File;
    url: string;
    id?: string;
    type: 'image' | 'video';
  }>;
  onBack: () => void;
  onSubmit: () => void;
  isPreview?: boolean; // Added to indicate if this is a live preview
}

const Review = ({ form, media, onBack, onSubmit, isPreview = false }: ProductReviewProps) => {
  const theme = useMantineTheme();
  const [variant, setVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Set first variant as default and first image as default
  useEffect(() => {
    if (form?.values?.variants && form.values.variants.length > 0) {
      setVariant(form.values.variants[0]);
    }
    if (media && media.length > 0) {
      setSelectedImage(media[0].url);
    }
  }, [form?.values?.variants, media]);

  // Find unique attribute names from variants
  const getAttributeNames = () => {
    if (!form?.values?.variants || form.values.variants.length === 0) return [];
    const firstVariant = form.values.variants[0];
    return Object.keys(firstVariant.attributes || {});
  };

  // Find unique attribute values for a given attribute name
  const getAttributeValues = (attrName: string) => {
    if (!form?.values?.variants) return [];

    const values = new Set<string>();
    form.values.variants.forEach((v: any) => {
      if (v.attributes && v.attributes[attrName]) {
        values.add(v.attributes[attrName]);
      }
    });
    return Array.from(values);
  };

  // Handle attribute selection to change variant
  const handleAttributeSelect = (attrName: string, value: string) => {
    if (!variant) return;

    // Find a variant that matches current selections but with the new attribute value
    const newAttributes = {
      ...variant.attributes,
      [attrName]: value
    };

    const newVariant = form.values.variants.find((v: any) => {
      // Check if this variant matches all the selected attributes
      for (const [key, val] of Object.entries(newAttributes)) {
        if (!v.attributes[key] || v.attributes[key] !== val) {
          return false;
        }
      }
      return true;
    });

    if (newVariant) {
      setVariant(newVariant);
    }
  };

  // Format price to display with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!variant) return null;
    if (!variant.comparePrice || variant.comparePrice <= variant.price) return null;

    const discount = ((variant.comparePrice - variant.price) / variant.comparePrice) * 100;
    return Math.round(discount);
  };

  if (!form || !form.values) {
    return (
      <Paper p="lg" shadow="sm" withBorder>
        <Text>Không có dữ liệu sản phẩm để xem trước</Text>
      </Paper>
    );
  }

  const discount = calculateDiscount();

  return (
    <Box>
      
      <ScrollArea h="calc(100vh - 120px)" offsetScrollbars>
        <div className="px-4 py-6">
          {/* Product header - Category path */}
          <div className="mb-6">
            <Text size="sm" c="dimmed">Trang chủ / {form.values.category || 'Danh mục sản phẩm'}</Text>
          </div>
          
          <Grid gutter="xl">
            {/* Product Images */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding={0} radius="md" withBorder>
                {/* Main Image */}
                {selectedImage ? (
                  <div className="bg-gray-50 p-4 flex justify-center items-center" style={{ height: '400px' }}>
                    <Image
                      src={selectedImage}
                      height={350}
                      fit="contain"
                      alt={form.values.name}
                      className="rounded"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 flex justify-center items-center text-gray-400" style={{ height: '400px' }}>
                    <Text>Chưa có hình ảnh</Text>
                  </div>
                )}

                {/* Image Thumbnails */}
                {media && media.length > 0 && (
                  <div className="p-4 bg-white border-t">
                    <Carousel
                      slideSize="20%"
                      slideGap="sm"
                      align="start"
                      slidesToScroll={5}
                      withControls={media.length > 5}
                      controlsOffset="xs"
                      styles={{
                        control: {
                          backgroundColor: theme.white,
                          border: `1px solid ${theme.colors.gray[3]}`,
                          boxShadow: theme.shadows.sm
                        }
                      }}
                    >
                      {media.map((item, index) => (
                        <Carousel.Slide key={index}>
                          <Image
                            src={item.url}
                            height={60}
                            width={60}
                            fit="cover"
                            style={{
                              border: selectedImage === item.url 
                                ? `2px solid ${theme.colors.blue[6]}` 
                                : `1px solid ${theme.colors.gray[3]}`,
                              borderRadius: theme.radius.sm,
                              cursor: 'pointer'
                            }}
                            onClick={() => setSelectedImage(item.url)}
                            alt={`Hình ảnh sản phẩm ${index + 1}`}
                          />
                        </Carousel.Slide>
                      ))}
                    </Carousel>
                  </div>
                )}
              </Card>
            </Grid.Col>

            {/* Product Details */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <div>
                  <Title order={1} 
                    size="h2" 
                    className="mb-2 text-gray-800" 
                    style={{ lineHeight: 1.2 }}
                  >
                    {form.values.name || 'Tên sản phẩm'}
                  </Title>

                  {/* Tags */}
                  {form.values.tags && form.values.tags.length > 0 && (
                    <Group mt="xs" gap="xs">
                      {form.values.tags.map((tag: string) => (
                        <Badge key={tag} variant="light" color="blue" radius="sm">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </div>

                {/* Price section with styled background */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <Group>
                    <Text size="xl" fw={700} className="text-red-600" style={{ fontSize: '1.75rem' }}>
                      {variant ? formatPrice(variant.price) : formatPrice(form.values.price)}
                    </Text>

                    {(variant?.comparePrice > variant?.price || form.values.comparePrice > form.values.price) && (
                      <>
                        <Text size="md" td="line-through" c="dimmed">
                          {variant ? formatPrice(variant.comparePrice) : formatPrice(form.values.comparePrice)}
                        </Text>

                        {discount && (
                          <Badge color="red" size="lg" radius="sm" variant="filled">-{discount}%</Badge>
                        )}
                      </>
                    )}
                  </Group>
                </div>

                {/* Short Description */}
                {form.values.shortDescription && (
                  <div>
                    <Text size="sm" c="dimmed" fw={500} mb={5}>Mô tả ngắn</Text>
                    <Text className="text-gray-700">{form.values.shortDescription}</Text>
                  </div>
                )}

                {/* Product Variants */}
                {form.values.variants && form.values.variants.length > 0 && getAttributeNames().length > 0 && (
                  <div className="border-t border-b py-4">
                    <Stack gap="md">
                      {getAttributeNames().map((attrName: string) => (
                        <div key={attrName}>
                          <Text fw={500} mb="xs" size="sm">{attrName}</Text>
                          <Group gap="xs">
                            {getAttributeValues(attrName).map((value: string) => (
                              <Button
                                key={value}
                                variant={
                                  variant && variant.attributes && variant.attributes[attrName] === value
                                    ? 'filled'
                                    : 'outline'
                                }
                                color={
                                  variant && variant.attributes && variant.attributes[attrName] === value
                                    ? 'blue'
                                    : 'gray'
                                }
                                onClick={() => handleAttributeSelect(attrName, value)}
                                size="sm"
                                radius="sm"
                              >
                                {value}
                              </Button>
                            ))}
                          </Group>
                        </div>
                      ))}
                    </Stack>
                  </div>
                )}

                {/* Product Meta Info */}
                <Stack gap="md">
                  {/* Stock */}
                  <Group>
                    <FiBox size={18} className="text-blue-500" />
                    <Text>
                      {variant
                        ? `Còn hàng: ${variant.stock} sản phẩm`
                        : `Còn hàng: ${form.values.quantity || 0} sản phẩm`}
                    </Text>
                  </Group>

                  {/* Shipping */}
                  {form.values.weight > 0 && (
                    <Group>
                      <FiTruck size={18} className="text-blue-500" />
                      <Text>
                        Vận chuyển: {form.values.weight}g
                        {form.values.length && form.values.width && form.values.height &&
                          ` - ${form.values.length}×${form.values.width}×${form.values.height} cm`}
                      </Text>
                    </Group>
                  )}

                  {/* SKU */}
                  <Group>
                    <Text size="sm" c="dimmed" fw={500}>
                      SKU: {variant ? variant.sku : form.values.sku || 'N/A'}
                    </Text>
                  </Group>
                </Stack>

                {/* Action Buttons */}
                <Group gap="md" mt="md">
                  <Button
                    leftSection={<FiShoppingBag size={16} />}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    radius="md"
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    leftSection={<FiHeart size={16} />}
                    variant="outline"
                    size="lg"
                    radius="md"
                  >
                    Yêu thích
                  </Button>
                  <ActionIcon 
                    size="lg" 
                    variant="light"
                    color="gray"
                  >
                    <FiShare2 size={18} />
                  </ActionIcon>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>

          {/* Product Description Tabs */}
          <Tabs defaultValue="description" mt={40} radius="md">
            <Tabs.List>
              <Tabs.Tab value="description" fw={500}>Mô tả sản phẩm</Tabs.Tab>
              <Tabs.Tab value="specifications" fw={500}>Thông số kỹ thuật</Tabs.Tab>
              <Tabs.Tab value="shipping" fw={500}>Vận chuyển</Tabs.Tab>
            </Tabs.List>

            <Paper p="lg" mt="xs" radius="md" className="bg-white" withBorder>
              <Tabs.Panel value="description" pt="md">
                {form.values.description ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: form.values.description }}
                  />
                ) : (
                  <Text c="dimmed" fs="italic">Chưa có mô tả chi tiết cho sản phẩm này</Text>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="specifications" pt="md">
                <Stack gap="xs">
                  <Group justify="apart" className="py-2">
                    <Text fw={500}>Thương hiệu</Text>
                    <Text>Anreal Shop</Text>
                  </Group>
                  <Divider />

                  <Group justify="apart" className="py-2">
                    <Text fw={500}>Xuất xứ</Text>
                    <Text>Việt Nam</Text>
                  </Group>
                  <Divider />

                  {form.values.weight > 0 && (
                    <>
                      <Group justify="apart" className="py-2">
                        <Text fw={500}>Cân nặng</Text>
                        <Text>{form.values.weight} gram</Text>
                      </Group>
                      <Divider />
                    </>
                  )}

                  {form.values.length > 0 && form.values.width > 0 && form.values.height > 0 && (
                    <>
                      <Group justify="apart" className="py-2">
                        <Text fw={500}>Kích thước</Text>
                        <Text>{form.values.length} × {form.values.width} × {form.values.height} cm</Text>
                      </Group>
                      <Divider />
                    </>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="shipping" pt="md">
                <Stack gap="lg">
                  <Group className="bg-gray-50 p-4 rounded">
                    <FiTruck size={24} className="text-blue-500" />
                    <div>
                      <Text fw={500}>Giao hàng tiêu chuẩn</Text>
                      <Text size="sm" c="dimmed">Nhận hàng trong 3-5 ngày làm việc</Text>
                    </div>
                  </Group>

                  <Group className="bg-gray-50 p-4 rounded">
                    <FiCheck size={24} className="text-green-500" />
                    <div>
                      <Text fw={500}>Đổi trả dễ dàng</Text>
                      <Text size="sm" c="dimmed">Đổi trả miễn phí trong vòng 7 ngày kể từ khi nhận hàng</Text>
                    </div>
                  </Group>
                </Stack>
              </Tabs.Panel>
            </Paper>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Action Buttons at bottom (only show when not in modal/preview) */}
      {!isPreview && (
        <Group justify="right" className="sticky bottom-0 bg-white p-4 border-t">
          <Button variant="default" onClick={onBack}>
            Quay lại chỉnh sửa
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={onSubmit}>
            Đăng sản phẩm
          </Button>
        </Group>
      )}
    </Box>
  );
};

export default Review;