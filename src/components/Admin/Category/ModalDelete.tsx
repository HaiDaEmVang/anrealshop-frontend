import React from 'react';
import {
    Button,
    Group,
    Modal,
    Stack,
    Text
} from '@mantine/core';
import { FiAlertCircle } from 'react-icons/fi';

interface Category {
    id: string;
    name: string;
    parentId: string | null;
    description: string;
    slug: string;
    active: boolean;
    order: number;
    level: number;
    color?: string;
    iconUrl?: string;
    imageUrl?: string;
    children?: Category[];
}

interface DeleteCategoryModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirmDelete: () => void;
    category: Category | null;
}

/**
 * Modal xác nhận xóa danh mục
 */
const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
    opened,
    onClose,
    onConfirmDelete,
    category
}) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Xác nhận xóa danh mục"
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Stack>
                <Group>
                    <FiAlertCircle size={24} className="text-red-500" />
                    <Text>Bạn có chắc chắn muốn xóa danh mục này?</Text>
                </Group>

                {category && category.children && category.children.length > 0 && (
                    <Text c="dimmed" size="sm">
                        Lưu ý: Danh mục này có {category.children.length} danh mục con.
                        Tất cả danh mục con sẽ bị xóa.
                    </Text>
                )}

                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button color="red" onClick={onConfirmDelete}>
                        Xác nhận xóa
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default DeleteCategoryModal;