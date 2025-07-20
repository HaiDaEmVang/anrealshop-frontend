import { ActionIcon, Menu } from '@mantine/core';
import { FiEdit2, FiCopy, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { useProductDelete } from '../../../../../hooks/useProduct';

interface ProductActionMenuProps {
  productId: string;
  disabled?: boolean;
}


const ProductActionMenu = ({ productId, disabled = false }: ProductActionMenuProps) => {
  const { deleteProduct } = useProductDelete();

  const handleEdit = () => {
    // Logic to handle product edit
  };
  const handleDuplicate = () => {
    // Logic to handle product duplication
  };
  const handleDelete = () => {
    deleteProduct(productId)
      .then(() => {
        
      })
  };
  return (
    <Menu shadow="md" position="bottom-end" withArrow>
      <Menu.Target>
        <ActionIcon variant="subtle" disabled={disabled}>
          <FiMoreVertical size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item 
          leftSection={<FiEdit2 size={14} />}
          onClick={handleEdit}
        >
          Chỉnh sửa
        </Menu.Item>
        <Menu.Item 
          leftSection={<FiCopy size={14} />}
          onClick={handleDuplicate}
        >
          Nhân bản
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item 
          leftSection={<FiTrash2 size={14} />} 
          color="red"
          onClick={handleDelete}
        >
          Xóa
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProductActionMenu;