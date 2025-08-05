import { Anchor, Breadcrumbs as MantineBreadcrumbs, Text } from '@mantine/core';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatStringView } from '../../../untils/Untils';

interface BreadcrumbsProps {
  productName: string;
  categoryId?: string;
  categoryName?: string;
}

const Breadcrumbs = ({ productName, categoryId, categoryName }: BreadcrumbsProps) => {
  return (
    <MantineBreadcrumbs className="mb-4 " separator={<FiChevronRight size={14} />}>
      <Anchor component={Link} to="/" className="!text-gray-500 hover:!text-primary no-underline">
        Trang chủ
      </Anchor>
      <Anchor component={Link} to="/products" className="!text-gray-500 hover:!text-primary no-underline">
        Sản phẩm
      </Anchor>
      {categoryId && categoryName && (
        <Anchor component={Link} to={`/category/${categoryId}`} className="!text-gray-500 hover:!text-primary no-underline">
          {formatStringView(categoryName)}
        </Anchor>
      )}
    <Text className="!text-gray-900 ">{formatStringView(productName)}</Text>
    </MantineBreadcrumbs>
  );
};

export default Breadcrumbs;