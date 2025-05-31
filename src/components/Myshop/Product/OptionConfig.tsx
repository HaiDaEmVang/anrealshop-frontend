import {
  Menu,
  Button,
  Group,
  ActionIcon,
  Tooltip,
  Modal,
  Text,
  Stack,
} from '@mantine/core';
import {
  FiSettings,
  FiTool,
  FiPlus,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiCopy,
  FiTag,
  FiGrid,
  FiList,
  FiLayers,
} from 'react-icons/fi';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

interface OptionConfigProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const OptionConfig = ({ viewMode, onViewModeChange }: OptionConfigProps) => {
  const [importModalOpened, { open: openImportModal, close: closeImportModal }] = useDisclosure(false);
  const [bulkDeleteModalOpened, { open: openBulkDeleteModal, close: closeBulkDeleteModal }] = useDisclosure(false);

  return (
    <div className="mb-4">
      <Group justify="space-between">
        <Group>
          {/* Cài đặt sản phẩm */}
          <Menu shadow="md" width={220} position="bottom-start">
            <Menu.Target>
              <Button
                leftSection={<FiSettings size={16} />}
                variant="light"
                color="gray"
              >
                Cài đặt sản phẩm
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Tùy chỉnh hiển thị</Menu.Label>
              <Menu.Item leftSection={<FiGrid size={14} />}>
                Hiển thị thuộc tính
              </Menu.Item>
              <Menu.Item leftSection={<FiTag size={14} />}>
                Quản lý thẻ
              </Menu.Item>
              <Menu.Divider />

              <Menu.Label>Phân loại</Menu.Label>
              <Menu.Item leftSection={<FiLayers size={14} />}>
                Quản lý danh mục
              </Menu.Item>
              <Menu.Item leftSection={<FiList size={14} />}>
                Trường tùy chỉnh
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Công cụ xử lý hàng loạt */}
          <Menu shadow="md" width={220} position="bottom-start">
            <Menu.Target>
              <Button
                leftSection={<FiTool size={16} />}
                variant="light"
                color="gray"
              >
                Công cụ xử lý hàng loạt
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<FiUpload size={14} />}
                onClick={openImportModal}
              >
                Nhập từ Excel/CSV
              </Menu.Item>
              <Menu.Item leftSection={<FiDownload size={14} />}>
                Xuất ra Excel
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<FiCopy size={14} />}
                color="blue"
              >
                Nhân bản sản phẩm
              </Menu.Item>
              <Menu.Item
                leftSection={<FiTrash2 size={14} />}
                color="red"
                onClick={openBulkDeleteModal}
              >
                Xóa hàng loạt
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Link to="/myshop/product/create">
            <Button
              leftSection={<FiPlus size={16} />}
              variant="filled"
              className="bg-primary hover:bg-primary/90"
              component="span" // Giữ button style, tránh render thành thẻ a
            >
              Thêm mới sản phẩm
            </Button>
          </Link>
        </Group>

        <Group gap="xs">
          <Tooltip label="Chế độ lưới" withArrow position="bottom">
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              className={
                viewMode === 'grid'
                  ? "!bg-blue-50 !text-primary !border-blue-200 hover:bg-blue-100"
                  : "text-gray-600 hover:bg-gray-100"
              }
              onClick={() => onViewModeChange('grid')}
            >
              <FiGrid size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Chế độ danh sách" withArrow position="bottom">
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              className={
                viewMode === 'list'
                  ? "!bg-blue-50 !text-primary !border-blue-200 hover:bg-blue-100"
                  : "text-gray-600 hover:bg-gray-100"
              }
              onClick={() => onViewModeChange('list')}
            >
              <FiList size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Import Modal */}
      <Modal
        opened={importModalOpened}
        onClose={closeImportModal}
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
            <Button variant="light" onClick={closeImportModal}>Hủy</Button>
            <Button className="bg-primary">Tải lên và nhập</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal
        opened={bulkDeleteModalOpened}
        onClose={closeBulkDeleteModal}
        title="Xóa sản phẩm hàng loạt"
        centered
      >
        <Stack>
          <Text size="sm" color="red">
            Bạn có chắc chắn muốn xóa các sản phẩm đã chọn? Hành động này không thể hoàn tác.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeBulkDeleteModal}>Hủy</Button>
            <Button color="red">Xóa</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default OptionConfig;