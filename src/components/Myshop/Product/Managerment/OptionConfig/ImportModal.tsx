import { Modal, Text, Stack, Button, Group } from '@mantine/core';
import { FiDownload, FiUpload } from 'react-icons/fi';

interface ImportModalProps {
  opened: boolean;
  onClose: () => void;
}

const ImportModal = ({ opened, onClose }: ImportModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Nhập sản phẩm từ Excel/CSV"
      centered
      size="lg"
    >
      <Stack>
        <Text size="sm">Tải lên file Excel hoặc CSV chứa thông tin sản phẩm của bạn.</Text>
        <Button
          variant="outline"
          leftSection={<FiDownload size={14} />}
          className="mr-auto"
        >
          Tải mẫu Excel
        </Button>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <FiUpload size={30} className="mx-auto mb-2 text-gray-400" />
          <div className="text-sm text-gray-500 mb-2">
            Kéo và thả file vào đây hoặc
          </div>
          <Button size="sm" className="bg-primary">Chọn file</Button>
        </div>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>Hủy</Button>
          <Button className="bg-primary">Tải lên và nhập</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ImportModal;