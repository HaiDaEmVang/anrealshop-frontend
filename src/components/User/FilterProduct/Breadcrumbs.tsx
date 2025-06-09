import { Anchor, Breadcrumbs as MantineBreadcrumbs, Text } from '@mantine/core';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Breadcrumbs = () => {
  
  return (
    <MantineBreadcrumbs mb="lg" separator={<FiChevronRight size={14} />} >
      <Anchor component={Link} to="/" className="!flex !items-center !text-md">
        <FiHome size={14} className="mr-1" />
        Trang chủ
      </Anchor>
      <Text size='md'>Tìm kiếm sản phẩm</Text>
    </MantineBreadcrumbs>
  );
};

export default Breadcrumbs;