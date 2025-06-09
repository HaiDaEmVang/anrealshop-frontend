import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Paper, Title, Box, Text, Group, Collapse, UnstyledButton, Stack } from '@mantine/core';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { type Category } from './CategoryPage';

interface CategorySidebarProps {
  category: Category | null;
}

interface CategoryItemProps {
  name: string;
  slug: string;
  isActive: boolean;
  hasChildren: boolean;
  children?: React.ReactNode;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, slug, isActive, hasChildren, children }) => {
  const [opened, setOpened] = useState(isActive);

  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setOpened(!opened);
    }
  };

  return (
    <Box mb="xs">
      <UnstyledButton
        component={Link}
        to={`/category/${slug}`}
        className={`w-full text-left rounded hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100' : ''}`}
        onClick={hasChildren ? handleToggle : undefined}
      >
        <Group justify="apart" py="xs" px="sm">
          <Text 
            size="sm" 
            fw={isActive ? 600 : 400}
            className={`${isActive ? 'text-blue-600' : ''}`}
          >
            {name}
          </Text>
          {hasChildren && (
            opened ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />
          )}
        </Group>
      </UnstyledButton>
      
      {hasChildren && (
        <Collapse in={opened}>
          <Box pl="md">
            {children}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

const CategorySidebar: React.FC<CategorySidebarProps> = ({ category }) => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!category?.hasChildren) {
    return null;
  }

  // Giả lập cấu trúc cây danh mục (trong thực tế, dữ liệu này sẽ đến từ API)
  const mockNestedCategories = {
    'smartphones': {
      id: 'smartphones-brands',
      name: 'Thương hiệu',
      hasChildren: true,
      subCategories: [
        { id: 'iphone', name: 'iPhone', slug: 'iphone' },
        { id: 'samsung', name: 'Samsung', slug: 'samsung' },
        { id: 'xiaomi', name: 'Xiaomi', slug: 'xiaomi' }
      ]
    },
    'laptops': {
      id: 'laptop-brands',
      name: 'Thương hiệu',
      hasChildren: true,
      subCategories: [
        { id: 'macbook', name: 'MacBook', slug: 'macbook' },
        { id: 'dell', name: 'Dell', slug: 'dell' },
        { id: 'hp', name: 'HP', slug: 'hp' },
        { id: 'lenovo', name: 'Lenovo', slug: 'lenovo' }
      ]
    }
  };

  return (
    <Paper p="md"  className="sticky top-4">
      <Title order={5} mb="md">Danh mục sản phẩm</Title>
      
      <Stack gap="xs">
        
        
        {/* Hiển thị danh mục hiện tại */}
        <CategoryItem
          name={category.name}
          slug={category.slug}
          isActive={slug === category.slug}
          hasChildren={category.hasChildren}
        >
          {category.subCategories.map(subCategory => (
            <CategoryItem
              key={subCategory.id}
              name={subCategory.name}
              slug={subCategory.slug}
              isActive={slug === subCategory.slug}
              hasChildren={mockNestedCategories[subCategory.id as keyof typeof mockNestedCategories] !== undefined}

            >
              {/* Danh mục con cấp 2 (nếu có) */}
              {/* {mockNestedCategories[subCategory.id]?.subCategories.map(nestedCat => (
                <CategoryItem
                  key={nestedCat.id}
                  name={nestedCat.name}
                  slug={nestedCat.slug}
                  isActive={slug === nestedCat.slug}
                  hasChildren={false}
                />
              ))} */}
            </CategoryItem>
          ))}
        </CategoryItem>
        
        {/* Hiển thị các liên kết bổ sung */}
        <Box mt="md">
          <Title order={6} mb="xs">Sản phẩm nổi bật</Title>
          <Text 
            component={Link} 
            to="/new-arrivals" 
            size="sm" 
            className="block py-2 px-3 hover:bg-gray-100 rounded transition-colors no-underline text-gray-700"
          >
            Hàng mới về
          </Text>
          <Text 
            component={Link} 
            to="/best-sellers" 
            size="sm"
            className="block py-2 px-3 hover:bg-gray-100 rounded transition-colors no-underline text-gray-700"
          >
            Bán chạy nhất
          </Text>
          <Text 
            component={Link} 
            to="/promotions" 
            size="sm"
            className="block py-2 px-3 hover:bg-gray-100 rounded transition-colors no-underline text-gray-700"
          >
            Đang giảm giá
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
};

export default CategorySidebar;