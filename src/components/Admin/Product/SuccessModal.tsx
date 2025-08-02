import { Button, Modal, Stack, Text } from '@mantine/core';
import { FiCheckCircle } from 'react-icons/fi';

interface SuccessModalProps {
  opened: boolean;
  onClose: () => void;
  message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  opened,
  onClose,
  message = "Trạng thái sản phẩm đã được cập nhật thành công!"
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Thao tác thành công"
      centered
    >
      <Stack align="center">
        <FiCheckCircle size={48} color="green" />
        <Text>{message}</Text>
        <Button onClick={onClose} mt="md" fullWidth>
          Đóng
        </Button>
      </Stack>
    </Modal>
  );
};

export default SuccessModal;