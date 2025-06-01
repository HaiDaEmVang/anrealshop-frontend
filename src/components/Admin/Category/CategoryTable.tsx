import React from 'react';
import {
    ActionIcon,
    Badge,
    Group,
    Menu,
    Table,
    Text,
    Tooltip,
    Image as MantineImage
} from '@mantine/core';
import {
    FiEdit2,
    FiEye,
    FiMoreVertical,
    FiPlus,
    FiTrash2,
    FiImage
} from 'react-icons/fi';

interface BaseCategory {
    id: string;
    name: string;
    parentId: string | null;
    description: string;
    slug: string;
    active: boolean;
    order: number;
    level: number;
    iconUrl?: string;
    imageUrl?: string;
}
interface CategoryWithChildren extends BaseCategory {
    children?: CategoryWithChildren[];
}

interface FlatCategoryForTable extends BaseCategory {}


interface CategoryTableProps {
    flatCategories: FlatCategoryForTable[];
    allCategories: CategoryWithChildren[]; // Full tree for AddSubCategoryModal context
    openAddSubcategoryModal: (category: CategoryWithChildren) => void;
    openEditCategoryModal: (category: CategoryWithChildren) => void;
    openConfirmDeleteModal: (category: CategoryWithChildren) => void;
    handleToggleCategoryActive: (categoryId: string, currentActiveState: boolean) => void;
}

const findCategoryInTree = (id: string, categories: CategoryWithChildren[]): CategoryWithChildren | null => {
    for (const category of categories) {
        if (category.id === id) return category;
        if (category.children) {
            const found = findCategoryInTree(id, category.children);
            if (found) return found;
        }
    }
    return null;
};


const CategoryTable: React.FC<CategoryTableProps> = ({
    flatCategories,
    allCategories,
    openAddSubcategoryModal,
    openEditCategoryModal,
    openConfirmDeleteModal,
    handleToggleCategoryActive
}) => {
    
    const getDirectChildrenCount = (parentId: string, allFlatCategories: FlatCategoryForTable[]): number => {
        return allFlatCategories.filter(cat => cat.parentId === parentId).length;
    };

    const handleOpenModal = (
        modalOpener: (category: CategoryWithChildren) => void, 
        categoryId: string
    ) => {
        const categoryFromTree = findCategoryInTree(categoryId, allCategories);
        if (categoryFromTree) {
            modalOpener(categoryFromTree);
        }
    };
    
    return (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th style={{ width: '80px', textAlign: 'center' }}>Hình ảnh</Table.Th>
                    <Table.Th>Tên danh mục</Table.Th>
                    <Table.Th>Slug</Table.Th>
                    <Table.Th>Cấp độ</Table.Th>
                    <Table.Th>Trạng thái</Table.Th>
                    <Table.Th style={{ width: '120px', textAlign: 'center' }}>Hành động</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {flatCategories.map((category) => {
                    const directChildrenCount = getDirectChildrenCount(category.id, flatCategories);
                    return (
                        <Table.Tr key={category.id}>
                            <Table.Td style={{ textAlign: 'center' }}>
                                {category.imageUrl ? (
                                    <MantineImage
                                        src={category.imageUrl}
                                        alt={category.name}
                                        width={40}
                                        height={40}
                                        fit="cover"
                                        radius="sm"
                                        style={{ margin: '0 auto' }}
                                    />
                                ) : (
                                    <div style={{ 
                                        width: 40, 
                                        height: 40, 
                                        backgroundColor: '#f0f0f0', 
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto'
                                    }}>
                                        <FiImage size={20} color="#aaa" />
                                    </div>
                                )}
                            </Table.Td>
                            <Table.Td>
                                <Text>
                                    {'—'.repeat(category.level)} {category.name}
                                </Text>
                                {category.description && (
                                    <Text size="xs" c="dimmed" lineClamp={1}>
                                        {category.description}
                                    </Text>
                                )}
                            </Table.Td>
                            <Table.Td>{category.slug}</Table.Td>
                            <Table.Td>
                                {category.level === 0 ? 'Danh mục gốc' : `Cấp ${category.level + 1}`}
                                {directChildrenCount > 0 && (
                                    <Text size="xs" c="dimmed">
                                        {directChildrenCount} danh mục con trực tiếp
                                    </Text>
                                )}
                            </Table.Td>
                            <Table.Td>
                                <Group gap="xs">
                                    <Badge
                                        color={category.active ? 'green' : 'gray'}
                                        variant="light"
                                    >
                                        {category.active ? 'Hiện' : 'Ẩn'}
                                    </Badge>
                                    <Tooltip label={category.active ? "Ẩn danh mục này" : "Hiện danh mục này"}>
                                        <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color={category.active ? "blue" : "gray"}
                                            onClick={() => handleToggleCategoryActive(category.id, category.active)}
                                        >
                                            <FiEye size={14} style={{ opacity: category.active ? 1 : 0.5 }} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Group justify="center" gap="xs">
                                    <Tooltip label="Chỉnh sửa">
                                        <ActionIcon 
                                            size="sm" 
                                            variant="subtle"
                                            onClick={() => handleOpenModal(openEditCategoryModal, category.id)}
                                        >
                                            <FiEdit2 size={14} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Menu position="bottom-end" withArrow withinPortal>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="subtle">
                                                <FiMoreVertical size={14} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item 
                                                leftSection={<FiPlus size={14} />} 
                                                onClick={() => handleOpenModal(openAddSubcategoryModal, category.id)}
                                            >
                                                Thêm danh mục con
                                            </Menu.Item>
                                            <Menu.Item 
                                                leftSection={<FiEdit2 size={14} />} 
                                                onClick={() => handleOpenModal(openEditCategoryModal, category.id)}
                                            >
                                                Chỉnh sửa
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<FiEye size={14} />}
                                                onClick={() => handleToggleCategoryActive(category.id, category.active)}
                                            >
                                                {category.active ? 'Ẩn danh mục' : 'Hiện danh mục'}
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item
                                                leftSection={<FiTrash2 size={14} />}
                                                color="red"
                                                onClick={() => handleOpenModal(openConfirmDeleteModal, category.id)}
                                            >
                                                Xóa danh mục
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    )
                })}
            </Table.Tbody>
        </Table>
    );
};

export default CategoryTable;