import { Modal, Text, Stack, Button, Group } from '@mantine/core';

interface BulkDeleteProductModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const BulkDeleteProductModal = ({ opened, onClose, onConfirm }: BulkDeleteProductModalProps) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Xóa sản phẩm hàng loạt"
      centered
    >
      <Stack>
        <Text size="sm" color="red">
          Bạn có chắc chắn muốn xóa các sản phẩm đã chọn? Hành động này không thể hoàn tác.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>Hủy</Button>
          <Button color="red" onClick={handleConfirm}>Xóa</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default BulkDeleteProductModal;