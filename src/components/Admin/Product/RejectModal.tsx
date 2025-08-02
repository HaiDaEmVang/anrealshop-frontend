import { Button, Group, Modal, Stack, Text, Textarea } from '@mantine/core';
import { FiX } from 'react-icons/fi';

interface RejectModalProps {
  opened: boolean;
  onClose: () => void;
  onReject: () => void;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  opened,
  onClose,
  onReject,
  rejectionReason,
  onReasonChange
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Từ chối sản phẩm"
      centered
    >
      <Stack>
        <Text size="sm">Vui lòng cung cấp lý do từ chối sản phẩm:</Text>

        <Textarea
          placeholder="Nhập lý do từ chối..."
          minRows={4}
          value={rejectionReason}
          onChange={(e) => onReasonChange(e.currentTarget.value)}
          required
        />

        <Group justify="space-between" mt="md">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            color="red"
            leftSection={<FiX size={16} />}
            onClick={onReject}
            disabled={!rejectionReason.trim()}
          >
            Từ chối sản phẩm
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default RejectModal;