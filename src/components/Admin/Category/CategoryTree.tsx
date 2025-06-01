import React from 'react';
import {
    ActionIcon,
    Badge,
    Box,
    Group,
    Menu,
    Text,
    Tooltip
} from '@mantine/core';
import {
    FiArrowDown,
    FiArrowUp,
    FiChevronDown,
    FiChevronRight,
    FiEdit2,
    FiEye,
    FiLayers,
    FiMoreVertical,
    FiPlus,
    FiTrash2
} from 'react-icons/fi';

interface Category {
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
    children?: Category[];
}

interface CategoryTreeProps {
    categories: Category[];
    expandedCategories: string[];
    toggleExpand: (categoryId: string) => void;
    moveCategory: (categoryId: string, direction: 'up' | 'down') => void;
    openAddSubcategoryModal: (category: Category) => void;
    openEditCategoryModal: (category: Category) => void;
    openConfirmDeleteModal: (category: Category) => void;
    handleToggleCategoryActive: (categoryId: string, currentActiveState: boolean) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
    categories,
    expandedCategories,
    toggleExpand,
    moveCategory,
    openAddSubcategoryModal,
    openEditCategoryModal,
    openConfirmDeleteModal,
    handleToggleCategoryActive
}) => {
    const renderCategoryTreeRecursive = (categoryList: Category[], currentLevel: number = 0): React.ReactNode[] => {
        const sortedCategoryList = [...categoryList].sort((a, b) => a.order - b.order);

        return sortedCategoryList.map((category, index) => (
            <Box
                key={category.id}
                className="category-item"
                style={{
                    marginLeft: `${currentLevel * 20}px`,
                    marginBottom: '8px',
                    marginTop: currentLevel === 0 && index > 0 ? '16px' : '0px',
                }}
            >
                <Box
                    className={`rounded-md border ${category.active ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}
                >
                    <Group
                        justify="space-between"
                        p="sm"
                        align="center"
                        className={`rounded-md ${!category.active && 'opacity-70'}`}
                    >
                        <Group>
                            {category.children && category.children.length > 0 ? (
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    onClick={() => toggleExpand(category.id)}
                                >
                                    {expandedCategories.includes(category.id) ? (
                                        <FiChevronDown />
                                    ) : (
                                        <FiChevronRight />
                                    )}
                                </ActionIcon>
                            ) : (
                                <ActionIcon size="sm" variant="subtle" color="gray" disabled>
                                    <FiLayers size={14} />
                                </ActionIcon>
                            )}

                            <Group gap="sm" align="center">
                                {category.imageUrl && (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }}
                                    />
                                )}
                                <Text fw={500}>{category.name}</Text>
                                <Tooltip label={category.active ? "Đang hiện" : "Đang ẩn"}>
                                    <ActionIcon
                                        size="xs"
                                        variant="transparent"
                                        color={category.active ? "blue" : "gray"}
                                        onClick={() => handleToggleCategoryActive(category.id, category.active)}
                                    >
                                        <FiEye size={14} style={{ opacity: category.active ? 1 : 0.5 }} />
                                    </ActionIcon>
                                </Tooltip>

                                {!category.active && (
                                    <Badge size="xs" color="gray">Ẩn</Badge>
                                )}
                                <Text c="dimmed" size="xs">
                                    <Text span c="dimmed" size="xs" className="hidden sm:inline">
                                        ({category.slug}) -
                                    </Text>
                                    {category.children && category.children.length > 0 ?
                                        `${category.children.length} danh mục con` :
                                        'Không có danh mục con'}
                                </Text>
                            </Group>
                        </Group>

                        <Group gap="xs">
                            <Tooltip label="Di chuyển lên">
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    onClick={() => moveCategory(category.id, 'up')}
                                    disabled={index === 0}
                                >
                                    <FiArrowUp size={14} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label="Di chuyển xuống">
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    onClick={() => moveCategory(category.id, 'down')}
                                    disabled={index === sortedCategoryList.length - 1}
                                >
                                    <FiArrowDown size={14} />
                                </ActionIcon>
                            </Tooltip>

                            <Menu position="bottom-end" withArrow withinPortal>
                                <Menu.Target>
                                    <ActionIcon variant="subtle">
                                        <FiMoreVertical size={14} />
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item leftSection={<FiPlus size={14} />} onClick={() => openAddSubcategoryModal(category)}>
                                        Thêm danh mục con
                                    </Menu.Item>
                                    <Menu.Item leftSection={<FiEdit2 size={14} />} onClick={() => openEditCategoryModal(category)}>
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
                                        onClick={() => openConfirmDeleteModal(category)}
                                    >
                                        Xóa danh mục
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>
                </Box>

                {category.children &&
                    expandedCategories.includes(category.id) &&
                    category.children.length > 0 && (
                        <Box mt="xs">
                            {renderCategoryTreeRecursive(category.children, currentLevel + 1)}
                        </Box>
                    )}
            </Box>
        ));
    };

    return <>{renderCategoryTreeRecursive(categories, 0)}</>;
};

export default CategoryTree;