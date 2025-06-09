import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Title,
  SimpleGrid,
  Card,
  Text,
  Image,
  Center,
  Group,
  Tooltip,
  Button
} from '@mantine/core';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { type Category } from './CategoryPage';

interface CategoryMainProps {
  category: Category | null;
}

const CategoryMain: React.FC<CategoryMainProps> = ({ category }) => {
  // State để kiểm soát việc hiển thị tất cả danh mục con
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  
  // Số lượng danh mục con hiển thị ban đầu
  const INITIAL_VISIBLE_COUNT = 12;
  
  // Lấy danh sách danh mục con để hiển thị
  const visibleSubCategories = category?.hasChildren 
    ? showAllSubCategories 
      ? category.subCategories 
      : category.subCategories.slice(0, INITIAL_VISIBLE_COUNT)
    : [];

  if (!category?.hasChildren) {
    return null;
  }

  return (
    <Box mb="xl" className='bg-white p-4 rounded-lg shadow-sm'>
      <Group justify="apart" mb="md">
        <Title order={4}>Khám phá theo danh mục</Title>
      </Group>
      
      <SimpleGrid cols={{ base: 3, sm: 4, md: 6 }} spacing="md">
        {visibleSubCategories.map(subcategory => (
          <Link
            key={subcategory.id}
            to={`/category/${subcategory.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <Card p="md" radius="md" className="transition-shadow h-full group">
              <Center mb="md">
                <Box 
                  className="overflow-hidden rounded-full"
                  style={{ width: 80, height: 80 }}
                >
                  <Image
                    src={subcategory.imageUrl || '/placeholder-category.png'}
                    height={80}
                    width={80}
                    fit="cover"
                    alt={subcategory.name}
                    className="transition-transform group-hover:scale-105"
                  />
                </Box>
              </Center>
              <Tooltip label={subcategory.name} disabled={subcategory.name.length < 20}>
                <Text 
                  fw={500} 
                  ta="center" 
                  className="truncate group-hover:text-primary"
                  title={subcategory.name}
                  size="sm"
                >
                  {subcategory.name}
                </Text>
              </Tooltip>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
      
      {/* Nút hiển thị thêm/ẩn bớt trên mobile */}
      {category.subCategories.length > INITIAL_VISIBLE_COUNT && (
        <Center mt="lg" className="sm:hidden">
          <Button
            variant="light"
            onClick={() => setShowAllSubCategories(!showAllSubCategories)}
            leftSection={showAllSubCategories ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            fullWidth
          >
            {showAllSubCategories ? 'Thu gọn' : `Xem tất cả ${category.subCategories.length} danh mục`}
          </Button>
        </Center>
      )}
    </Box>
  );
};

export default CategoryMain;