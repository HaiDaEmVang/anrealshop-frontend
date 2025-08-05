import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Skeleton,
  Text,
  Title
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

// Các component con
import { useGetProduct } from '../../../hooks/useProduct';
import type { MyShopProductSkuDto, ProductDetailDto } from '../../../types/ProductType';
import Breadcrumbs from './Breadcrumbs';
import ImageProduct from './ImageProduct';
import InforProduct from './productInfo/InforProduct';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedSku, setSelectedSku] = useState<MyShopProductSkuDto | null>(null);

  const { isLoading, getProductById } = useGetProduct();

  const groupedAttributes = useMemo(() => {
    if (!product?.productSkus?.length) return [];

    const attributeMap = new Map();
    
    product.productSkus.forEach(sku => {
      if (!sku.attributeForSku) return;
      
      sku.attributeForSku.forEach(attr => {
        if (!attributeMap.has(attr.attributeKeyName)) {
          attributeMap.set(attr.attributeKeyName, {
            id: attr.attributeKeyName,
            displayName: attr.attributeKeyDisplay,
            values: new Set<string>(),
          });
        }
        
        attributeMap.get(attr.attributeKeyName).values.add(attr.values);
      });
    });
    
    console.log("Grouped Attributes:", Array.from(attributeMap.values()));

    return Array.from(attributeMap.values()).map(group => ({
      key: {
        id: group.id,
        displayName: group.displayName,
      },
      values: Array.from(group.values).map(value => ({
        value,
        imageUrl: null // We don't have image URLs for attribute values
      }))
    }));
  }, [product]);

  // Handle attribute selection
  const handleAttributeSelect = (attributeId: string, value: string) => {
    console.log("Selected Attribute:", attributeId, value);
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeId]: value
    };
    setSelectedAttributes(newSelectedAttributes);
    
    // Find matching SKU
    if (product?.productSkus) {
      const matchingSku = product.productSkus.find(sku => {
        if (!sku.attributeForSku) return false;
        return sku.attributeForSku.every(attr => {
          const attrKey = attr.attributeKeyName;
          return !newSelectedAttributes[attrKey] || newSelectedAttributes[attrKey] === attr.values;
        });
      });
      
      console.log("Selected SKU:", matchingSku);
      setSelectedSku(matchingSku || null);
    }
  };

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log("Adding to cart:", { product, selectedSku, selectedAttributes });
  }

  const handleBuyNow = () => {
    // Implement buy now functionality
    console.log("Buying now:", { product, selectedSku, selectedAttributes });
  }

  useEffect(() => {
    if (slug) {
      getProductById(slug)
        .then(productData => {
          setProduct(productData);
          
          // Initialize with first SKU attributes if available
          if (productData.productSkus?.length && productData.productSkus[0].attributeForSku) {
            const initialAttributes: Record<string, string> = {};
            productData.productSkus[0].attributeForSku.forEach(attr => {
              initialAttributes[attr.attributeKeyName] = attr.values;
            });
            setSelectedAttributes(initialAttributes);
            setSelectedSku(productData.productSkus[0]);
          }
        })
    }
  }, [slug, getProductById]);

  // Loading skeleton
  if (isLoading) {
    return (
      <Container size="xl" className="py-8">
        <Skeleton height={30} width="60%" className="mb-8" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Skeleton height={400} className="mb-4" />
            <Group>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} height={80} width={80} />
              ))}
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Skeleton height={50} className="mb-4" />
            <Skeleton height={30} width="40%" className="mb-3" />
            <Skeleton height={40} width="30%" className="mb-4" />
            <Skeleton height={100} className="mb-4" />
            <Skeleton height={120} className="mb-4" />
            <Group>
              <Skeleton height={50} width="48%" />
              <Skeleton height={50} width="48%" />
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container size="xl" className="py-8">
        <Paper withBorder p="xl" className="text-center">
          <FiAlertTriangle size={48} className="text-yellow-500 mb-4 mx-auto" />
          <Title order={3} className="mb-2">Sản phẩm không tồn tại</Title>
          <Text className="mb-4">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</Text>
          <Button
            component={Link}
            to="/products"
            variant="filled"
            color="blue"
            className="bg-primary hover:bg-primary-dark"
          >
            Quay lại danh sách sản phẩm
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-4">
      {/* Sử dụng component Breadcrumbs */}
      <Breadcrumbs
        productName={product.name}
        categoryId={product.categoryId}
        categoryName={product.categoryPath?.split(" > ").pop() || "Danh mục"}
      />
      <Grid gutter="md">
        {/* Phần ảnh sản phẩm - sử dụng component ImageProduct */}
        <Grid.Col span={{ base: 12, md: 4.6 }} className=''>
          <Paper radius="md" className="!mb-8 bg-white shadow-sm sticky top-4">
            <div className="p-4">
              <ImageProduct
                media={product.medias ? product.medias : []}
                thumbnailUrl={product.thumbnailUrl}
                productName={product.name}
              />
            </div>
          </Paper>
        </Grid.Col>

        {/* Thông tin sản phẩm - sử dụng component InforProduct */}
        <Grid.Col span={{ base: 12, md: 7.4 }}>
          <Paper radius="md" className="!mb-8 !bg-white !shadow-sm">
            <div className="p-4">
              <InforProduct
                product={product}
                selectedAttributes={selectedAttributes}
                selectedSku={selectedSku}
                onAttributeSelect={handleAttributeSelect}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                groupedAttributes={groupedAttributes}
              />
            </div>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;