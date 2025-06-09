import { Breadcrumbs as MantineBreadcrumbs, Anchor, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

interface BreadcrumbsProps {
  productName: string;
  categoryId?: string;
  categoryName?: string;
}

const Breadcrumbs = ({ productName, categoryId, categoryName }: BreadcrumbsProps) => {
  return (
    <MantineBreadcrumbs className="mb-6" separator={<FiChevronRight size={14} />}>
      <Anchor component={Link} to="/" className="text-gray-500 hover:text-primary no-underline">
        Trang chủ
      </Anchor>
      <Anchor component={Link} to="/products" className="text-gray-500 hover:text-primary no-underline">
        Sản phẩm
      </Anchor>
      {categoryId && categoryName && (
        <Anchor component={Link} to={`/category/${categoryId}`} className="text-gray-500 hover:text-primary no-underline">
          {categoryName}
        </Anchor>
      )}
      <Text className="text-gray-900">{productName}</Text>
    </MantineBreadcrumbs>
  );
};

export default Breadcrumbs;