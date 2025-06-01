import {
    Box,
    Button,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Text,
    Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FiLayers,
    FiList,
    FiPlus
} from 'react-icons/fi';
import showSuccessNotification from '../../../Toast/NotificationSuccess';
import CategoryTable from './CategoryTable';
import CategoryTree from './CategoryTree';
import DeleteCategoryModal from './ModalDelete';
import CategoryModal from './ModalEdit';


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

const MOCK_CATEGORIES: Category[] = [
    {
        id: '1',
        name: 'Thời trang',
        parentId: null,
        description: 'Sản phẩm thời trang các loại',
        slug: 'thoi-trang',
        active: true,
        order: 1,
        level: 0,
        children: [
            {
                id: '1-1',
                name: 'Thời trang nam',
                parentId: '1',
                description: 'Thời trang dành cho nam giới',
                slug: 'thoi-trang-nam',
                active: true,
                order: 1,
                level: 1,
                children: [
                    {
                        id: '1-1-1',
                        name: 'Áo sơ mi nam',
                        parentId: '1-1',
                        description: 'Áo sơ mi dành cho nam giới',
                        slug: 'ao-so-mi-nam',
                        active: true,
                        order: 1,
                        level: 2
                    },
                    {
                        id: '1-1-2',
                        name: 'Quần jean nam',
                        parentId: '1-1',
                        description: 'Quần jean dành cho nam giới',
                        slug: 'quan-jean-nam',
                        active: true,
                        order: 2,
                        level: 2
                    }
                ]
            },
            {
                id: '1-2',
                name: 'Thời trang nữ',
                parentId: '1',
                description: 'Thời trang dành cho nữ giới',
                slug: 'thoi-trang-nu',
                active: true,
                order: 2,
                level: 1,
                children: [
                    {
                        id: '1-2-1',
                        name: 'Váy đầm',
                        parentId: '1-2',
                        description: 'Váy đầm dành cho nữ giới',
                        slug: 'vay-dam',
                        active: true,
                        order: 1,
                        level: 2
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        name: 'Điện tử',
        parentId: null,
        description: 'Các sản phẩm điện tử',
        slug: 'dien-tu',
        active: true,
        order: 2,
        level: 0,
        children: [
            {
                id: '2-1',
                name: 'Điện thoại',
                parentId: '2',
                description: 'Điện thoại di động các loại',
                slug: 'dien-thoai',
                active: true,
                order: 1,
                level: 1
            },
            {
                id: '2-2',
                name: 'Máy tính',
                parentId: '2',
                description: 'Máy tính, laptop các loại',
                slug: 'may-tinh',
                active: true,
                order: 2,
                level: 1,
                children: [
                    {
                        id: '2-2-1',
                        name: 'Laptop',
                        parentId: '2-2',
                        description: 'Máy tính xách tay',
                        slug: 'laptop',
                        active: true,
                        order: 1,
                        level: 2
                    },
                    {
                        id: '2-2-2',
                        name: 'PC',
                        parentId: '2-2',
                        description: 'Máy tính để bàn',
                        slug: 'pc',
                        active: false,
                        order: 2,
                        level: 2
                    }
                ]
            }
        ]
    },
    {
        id: '3',
        name: 'Nhà cửa & Đời sống',
        parentId: null,
        description: 'Các sản phẩm dành cho nhà cửa và đời sống',
        slug: 'nha-cua-doi-song',
        active: true,
        order: 3,
        level: 0,
    }
];

const createSlug = (name: string): string => {
    if (!name) return '';
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const buildCategoryTree = (list: Category[], parentId: string | null = null): Category[] => {
    return list
        .filter(item => item.parentId === parentId)
        .map(item => ({
            ...item,
            children: buildCategoryTree(list, item.id)
        }))
        .sort((a, b) => a.order - b.order);
};

const flattenCategoryTree = (categoriesToFlatten: Category[], level = 0): Omit<Category, 'children'>[] => {
    let result: Omit<Category, 'children'>[] = [];
    for (const category of categoriesToFlatten.sort((a,b) => a.order - b.order)) {
        const { children, ...categoryWithoutChildren } = category;
        result.push({ ...categoryWithoutChildren, level });
        if (children && children.length > 0) {
            result = result.concat(flattenCategoryTree(children, level + 1));
        }
    }
    return result;
};


const CategoryManagement: React.FC = () => {
    const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [flatCategories, setFlatCategories] = useState<Omit<Category, 'children'>[]>([]);
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    useEffect(() => {
        setFlatCategories(flattenCategoryTree(categories));
    }, [categories]);

    const getDescendantIds = useCallback((categoryId: string): string[] => {
        const result: string[] = [];
        const allCategoriesFlat = flattenCategoryTree(categories);
        const findChildrenRecursive = (currentParentId: string) => {
            const children = allCategoriesFlat.filter(cat => cat.parentId === currentParentId);
            for (const child of children) {
                result.push(child.id);
                findChildrenRecursive(child.id);
            }
        };
        findChildrenRecursive(categoryId);
        return result;
    }, [categories]);

    const toggleExpand = useCallback((categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    }, []);

    const openAddSubcategoryModal = useCallback((parentCategory: Category) => {
        const childrenOfParent = categories.find(c => c.id === parentCategory.id)?.children || [];
        setCurrentCategory({
            id: '',
            name: '',
            parentId: parentCategory.id,
            description: '',
            slug: '',
            active: true,
            order: childrenOfParent.length + 1,
            level: parentCategory.level + 1,
            children: []
        });
        setIsEditing(false);
        openModal();
    }, [openModal, categories]);

    const openAddRootCategoryModal = useCallback(() => {
        const rootCategories = categories.filter(c => c.parentId === null);
        setCurrentCategory({
            id: '',
            name: '',
            parentId: null,
            description: '',
            slug: '',
            active: true,
            order: rootCategories.length + 1,
            level: 0,
            children: []
        });
        setIsEditing(false);
        openModal();
    }, [openModal, categories]);

    const openEditCategoryModal = useCallback((category: Category) => {
        setCurrentCategory({ ...category });
        setIsEditing(true);
        openModal();
    }, [openModal]);

    const openConfirmDeleteModal = useCallback((category: Category) => {
        setCurrentCategory(category);
        openDeleteModal();
    }, [openDeleteModal]);

    const handleCategoryChange = useCallback((field: keyof Category, value: any) => {
        setCurrentCategory(prevCategory => {
            if (!prevCategory) return null;
            const updatedCategory = { ...prevCategory, [field]: value };

            if (field === 'name' && !isEditing) {
                updatedCategory.slug = createSlug(value as string);
            }
            return updatedCategory;
        });
    }, [isEditing]);

    const saveCategory = useCallback(() => {
        if (!currentCategory) return;
        setLoading(true);

        const newCategoryData = {
            ...currentCategory,
            id: isEditing ? currentCategory.id : `new-${Date.now()}`,
            children: currentCategory.children || []
        };

        if (isEditing) {
            const updateCategoryInTree = (list: Category[]): Category[] => {
                return list.map(category => {
                    if (category.id === newCategoryData.id) {
                        return { ...newCategoryData, children: category.children };
                    }
                    if (category.children) {
                        return {
                            ...category,
                            children: updateCategoryInTree(category.children)
                        };
                    }
                    return category;
                }).sort((a,b) => a.order - b.order);
            };
            setCategories(prev => updateCategoryInTree(prev));
            showSuccessNotification({
                message: `Đã cập nhật danh mục ${newCategoryData.name}`,
            });
        } else {
            const categoryToAdd = { ...newCategoryData };
            if (newCategoryData.parentId === null) {
                setCategories(prev => [...prev, categoryToAdd].sort((a,b)=>a.order-b.order));
            } else {
                const addChildToCategory = (list: Category[]): Category[] => {
                    return list.map(category => {
                        if (category.id === newCategoryData.parentId) {
                            return {
                                ...category,
                                children: [...(category.children || []), categoryToAdd]
                                    .sort((a, b) => a.order - b.order)
                            };
                        }
                        if (category.children) {
                            return {
                                ...category,
                                children: addChildToCategory(category.children)
                            };
                        }
                        return category;
                    }).sort((a,b) => a.order - b.order);
                };
                setCategories(prev => addChildToCategory(prev));
                if (newCategoryData.parentId && !expandedCategories.includes(newCategoryData.parentId)) {
                    setExpandedCategories(prev => [...prev, newCategoryData.parentId!]);
                }
            }
            showSuccessNotification({
                message: `Đã thêm danh mục ${newCategoryData.name}`,
            });
        }
        setLoading(false);
        closeModal();
    }, [currentCategory, isEditing, closeModal, expandedCategories]);


    const deleteCategoryInTree = useCallback((list: Category[], idsToDelete: Set<string>): Category[] => {
        return list
            .filter(category => !idsToDelete.has(category.id))
            .map(category => {
                if (category.children) {
                    return {
                        ...category,
                        children: deleteCategoryInTree(category.children, idsToDelete)
                    };
                }
                return category;
            });
    }, []);

    const deleteCategory = useCallback(() => {
        if (!currentCategory) return;
        setLoading(true);
        const idsToDelete = new Set([currentCategory.id, ...getDescendantIds(currentCategory.id)]);
        setCategories(prev => deleteCategoryInTree(prev, idsToDelete));
        showSuccessNotification({
            message: `Đã xóa danh mục ${currentCategory.name} và các danh mục con`,
        });
        setLoading(false);
        closeDeleteModal();
    }, [currentCategory, getDescendantIds, closeDeleteModal, deleteCategoryInTree]);


    const reorderAndRenumberSiblings = (siblings: Category[], categoryId: string, direction: 'up' | 'down'): Category[] => {
        const index = siblings.findIndex(cat => cat.id === categoryId);
        if (index === -1) return siblings;
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === siblings.length - 1)) {
            return siblings;
        }
        const newSiblings = [...siblings];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newSiblings[index], newSiblings[swapIndex]] = [newSiblings[swapIndex], newSiblings[index]];
        return newSiblings.map((cat, idx) => ({ ...cat, order: idx + 1 }));
    };
    
    const moveCategoryRecursive = useCallback((list: Category[], categoryId: string, direction: 'up' | 'down', parentIdToFind: string | null): { updatedList: Category[], foundAndMoved: boolean } => {
        let foundAndMovedOverall = false;
    
        if (parentIdToFind === null) { // Operating on root items
            const itemParentId = list.find(c => c.id === categoryId)?.parentId;
            if (itemParentId === null) { // Item is a root item
                const updatedRootList = reorderAndRenumberSiblings(list.filter(c => c.parentId === null), categoryId, direction);
                const nonRootItems = list.filter(c => c.parentId !== null); 
                const updatedRootMap = new Map(updatedRootList.map(item => [item.id, item]));
                const newCategoriesList = list.map(item => {
                    if (item.parentId === null) {
                        return updatedRootMap.get(item.id) || item; // Get updated item or original if somehow not in map
                    }
                    return item; // Return non-root items as is
                });

                return { updatedList: newCategoriesList, foundAndMoved: true };
            }
        }
    
        const processedList = list.map(cat => {
            if (foundAndMovedOverall) return cat; 
    
            if (cat.id === parentIdToFind) { // Found the parent of the item to move (for non-root items)
                if (cat.children && cat.children.find(child => child.id === categoryId)) {
                    const updatedChildren = reorderAndRenumberSiblings(cat.children, categoryId, direction);
                    foundAndMovedOverall = true;
                    return { ...cat, children: updatedChildren };
                }
            }
            if (cat.children && !foundAndMovedOverall) {
                const result = moveCategoryRecursive(cat.children, categoryId, direction, parentIdToFind);
                if (result.foundAndMoved) {
                    foundAndMovedOverall = true;
                    return { ...cat, children: result.updatedList };
                }
            }
            return cat;
        });
        return { updatedList: processedList, foundAndMoved: foundAndMovedOverall };
    }, []);


    const moveCategory = useCallback((categoryId: string, direction: 'up' | 'down') => {
        setLoading(true);
        const categoryToMove = flatCategories.find(cat => cat.id === categoryId);
        if (!categoryToMove) {
            setLoading(false);
            return;
        }
    
        setCategories(prevCategories => {
            const result = moveCategoryRecursive(prevCategories, categoryId, direction, categoryToMove.parentId);
            if (result.foundAndMoved) {
                showSuccessNotification({ message: `Đã thay đổi vị trí danh mục` });
                return result.updatedList;
            }
            return prevCategories; // Should not happen if categoryToMove was found
        });
        setLoading(false);
    }, [flatCategories, moveCategoryRecursive]);


    const handleToggleCategoryActive = useCallback((categoryId: string, currentActiveState: boolean) => {
        const categoryName = flatCategories.find(c => c.id === categoryId)?.name || 'danh mục';

        const updateCategoryActiveStateInTree = (list: Category[]): Category[] => {
            return list.map(cat => {
                if (cat.id === categoryId) {
                    return { ...cat, active: !currentActiveState };
                }
                if (cat.children) {
                    return {
                        ...cat,
                        children: updateCategoryActiveStateInTree(cat.children)
                    };
                }
                return cat;
            });
        };

        setCategories(prevCategories => updateCategoryActiveStateInTree(prevCategories));
        showSuccessNotification({
            message: `Đã ${!currentActiveState ? 'hiện' : 'ẩn'} ${categoryName}`,
        });
    }, [flatCategories]);


    return (
        <Box>
            <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
            <Paper p="md" radius="md" withBorder mb="md">
                <Group justify="space-between" mb="md">
                    <Title order={3} size="h4">Quản lý danh mục</Title>
                    <Button
                        leftSection={<FiPlus size={16} />}
                        onClick={openAddRootCategoryModal}>
                        Thêm danh mục gốc
                    </Button>
                </Group>
                <Text size="sm" c="dimmed" mb="lg">
                    Quản lý danh mục sản phẩm nhiều cấp. Bạn có thể thêm, sửa, xóa và sắp xếp danh mục.
                </Text>
                <Box mb="md">
                    <Box className="categories-display">
                        {categories.length > 0 ? (
                            <>
                                {viewMode === 'tree' ? (
                                    <CategoryTree
                                        categories={categories.filter(c => c.parentId === null)}
                                        expandedCategories={expandedCategories}
                                        toggleExpand={toggleExpand}
                                        moveCategory={moveCategory}
                                        openAddSubcategoryModal={openAddSubcategoryModal}
                                        openEditCategoryModal={openEditCategoryModal}
                                        openConfirmDeleteModal={openConfirmDeleteModal}
                                        handleToggleCategoryActive={handleToggleCategoryActive}
                                    />
                                ) : (
                                    <CategoryTable
                                        flatCategories={flatCategories}
                                        openAddSubcategoryModal={openAddSubcategoryModal}
                                        openEditCategoryModal={openEditCategoryModal}
                                        openConfirmDeleteModal={openConfirmDeleteModal}
                                        handleToggleCategoryActive={handleToggleCategoryActive}
                                        allCategories={categories}
                                    />
                                )}
                            </>
                        ) : (
                            <Paper p="xl" radius="md" withBorder>
                                <Stack align="center" gap="md">
                                    <FiLayers size={48} className="text-gray-300" />
                                    <Text fw={500}>Chưa có danh mục nào</Text>
                                    <Text size="sm" c="dimmed" ta="center">
                                        Bạn chưa tạo danh mục nào. Hãy thêm danh mục gốc để bắt đầu.
                                    </Text>
                                    <Button
                                        leftSection={<FiPlus size={16} />}
                                        onClick={openAddRootCategoryModal}>
                                        Thêm danh mục gốc
                                    </Button>
                                </Stack>
                            </Paper>
                        )}
                    </Box>
                </Box>
                {flatCategories.length > 0 && (
                    <Group justify="space-between">
                        <Text size="sm">{flatCategories.length} danh mục</Text>
                        <Group>
                            <Button
                                variant={viewMode === 'tree' ? 'light' : 'subtle'}
                                leftSection={<FiLayers size={16} />}
                                onClick={() => setViewMode('tree')}
                            >
                                Cấu trúc cây
                            </Button>
                            <Button
                                variant={viewMode === 'table' ? 'light' : 'subtle'}
                                leftSection={<FiList size={16} />}
                                onClick={() => setViewMode('table')}
                            >
                                Dạng bảng
                            </Button>
                        </Group>
                    </Group>
                )}
            </Paper>
            <CategoryModal
                opened={modalOpened}
                onClose={closeModal}
                onSave={saveCategory}
                currentCategory={currentCategory}
                isEditing={isEditing}
                handleCategoryChange={handleCategoryChange}
                flatCategories={flatCategories}
                getDescendantIds={getDescendantIds}
            />
            <DeleteCategoryModal
                opened={deleteModalOpened}
                onClose={closeDeleteModal}
                onConfirmDelete={deleteCategory}
                category={currentCategory}
            />
        </Box>
    );
};

export default CategoryManagement;