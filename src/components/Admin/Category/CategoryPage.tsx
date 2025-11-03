import { Button, Divider, Group, Paper, SegmentedControl, Stack, Title, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState, useRef } from 'react';
import { FiGitBranch, FiList, FiPlus } from 'react-icons/fi';
import { useCategory } from '../../../hooks/useCategory';
import type { AdminCategoryDto, CategoryRequestDto } from '../../../types/CategoryType';
import { CategoryTable } from './CategoryTable';
import { CategoryTree } from './CategoryTree';
import ModalConfirmStatus from './ModalConfirmStatus';
import ModalDelete from './ModalDelete';
import CategoryModal from './ModalEdit';

type ViewMode = 'tree' | 'table';

export const CategoryPage = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('tree');
    const [opened, { open, close }] = useDisclosure(false);
    const [editingCategory, setEditingCategory] = useState<AdminCategoryDto | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [disabledCurrentPage, setDisabledCurrentPage] = useState(1);

    const [toggleModalOpened, { open: openToggleModal, close: closeToggleModal }] = useDisclosure(false);
    const [categoryToToggle, setCategoryToToggle] = useState<AdminCategoryDto | null>(null);
    const [includeChildren, setIncludeChildren] = useState(false);

    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [categoryToDelete, setCategoryToDelete] = useState<AdminCategoryDto | null>(null);

    const slugUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        categories,
        disabledCategories,
        isSubmitting,
        addCategory,
        updateCategory,
        toggleCategoryStatus,
        deleteCategory,
    } = useCategory({ autoFetch: true });

    const form = useForm<CategoryRequestDto>({
        initialValues: {
            name: '',
            slug: '',
            parentId: null,
            description: '',
            level: 0,
            visible: true,
        },
        validate: {
            name: (value) => (!value ? 'Tên danh mục là bắt buộc' : null),
            slug: (value) => (!value ? 'Slug là bắt buộc' : null),
        },
    });

    const parentOptions = categories
        .filter(cat => !editingCategory || cat.id !== editingCategory.id)
        .map(cat => ({
            value: cat.id,
            label: cat.name,
            disabled: editingCategory ? cat.level >= 2 : false,
        }));

    const handleOpenModal = (category?: AdminCategoryDto, isAdd?: boolean) => {
        if (category) {
            if (isAdd) {
                setEditingCategory(null);
                form.setValues({
                    name: '',
                    slug: '',
                    parentId: category.id,
                    description: '',
                    level: category.level + 1,
                    visible: true,
                });
            } else {
                setEditingCategory(category);
                form.setValues({
                    name: category.name,
                    slug: category.slug,
                    parentId: category.parentId || null,
                    description: category.description || '',
                    level: category.level,
                    visible: category.visible,
                });
            }
        } else {
            setEditingCategory(null);
            form.reset();
        }
        open();
    };

    const handleCloseModal = () => {
        close();
        setEditingCategory(null);
        form.reset();
    };

    const handleSubmit = async (values: CategoryRequestDto) => {
        if (editingCategory) {
            const result = await updateCategory(editingCategory.id, values);
            if (result) {
                handleCloseModal();
            }
        } else {
            const result = await addCategory(values);
            if (result) {
                handleCloseModal();
            }
        }
    };

    const handleDelete = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId) || disabledCategories.find(c => c.id === categoryId);
        if (!category) return;

        setCategoryToDelete(category);
        openDeleteModal();
    };

    const handleConfirmDelete = async (includeChildren: boolean) => {
        if (!categoryToDelete) return;

        const success = await deleteCategory(categoryToDelete.id, includeChildren);
        if (success) {
            closeDeleteModal();
            setCategoryToDelete(null);
        }
    };

    const handleToggleStatus = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId) || disabledCategories.find(c => c.id === categoryId);
        if (!category) return;

        const hasChildren = [...categories, ...disabledCategories].some(c => c.parentId === categoryId);

        if (hasChildren) {
            setCategoryToToggle(category);
            setIncludeChildren(false);
            openToggleModal();
        } else {
            toggleCategoryStatus(categoryId, false);
        }
    };

    const handleConfirmToggle = async () => {
        if (!categoryToToggle) return;

        await toggleCategoryStatus(categoryToToggle.id, includeChildren);
        closeToggleModal();
        setCategoryToToggle(null);
        setIncludeChildren(false);
    };


    useEffect(() => {
        setCurrentPage(1);
        setDisabledCurrentPage(1);
    }, [viewMode]);

    useEffect(() => {
        if (slugUpdateTimeoutRef.current) {
            clearTimeout(slugUpdateTimeoutRef.current);
        }

        if (form.values.name) {
            slugUpdateTimeoutRef.current = setTimeout(() => {
                const newSlug = form.values.name.toLowerCase().replace(/\s+/g, '-');
                form.setFieldValue('slug', newSlug);
            }, 1000);
        }
        return () => {
            if (slugUpdateTimeoutRef.current) {
                clearTimeout(slugUpdateTimeoutRef.current);
            }
        };
    }, [form.values.name]);

    return (
        <div >
            <Stack gap="lg">
                <Group justify="space-between" align="center">
                    <Title order={4}>Quản lý danh mục</Title>
                    <Group>
                        <SegmentedControl
                            size='xs'
                            value={viewMode}
                            onChange={(value) => setViewMode(value as ViewMode)}
                            data={[
                                {
                                    label: (
                                        <Tooltip label="Cây danh mục">
                                            <FiGitBranch size={18} />
                                        </Tooltip>
                                    ),
                                    value: 'tree'
                                },
                                {
                                    label: (
                                        <Tooltip label="Bảng">
                                            <FiList size={18} />
                                        </Tooltip>
                                    ),
                                    value: 'table'
                                },
                            ]}
                        />
                        <Button size='xs' leftSection={<FiPlus size={16} />} onClick={() => handleOpenModal()}>
                            Thêm danh mục
                        </Button>
                    </Group>
                </Group>

                <div className="relative">

                    {viewMode === 'tree' ? (
                        <CategoryTree
                            categories={categories}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    ) : (
                        <CategoryTable
                            categories={categories}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    )}
                </div>

                {disabledCategories.length > 0 && (
                    <>
                        <Divider my="md" />

                        <Paper shadow="none" >
                            <Stack gap="md">
                                <Group justify="space-between" align="center">
                                    <Title order={5}>Danh mục bị ẩn ({disabledCategories.length})</Title>
                                </Group>

                                <div className="relative">

                                    {viewMode === 'tree' ? (
                                        <CategoryTree
                                            categories={disabledCategories}
                                            onEdit={handleOpenModal}
                                            onDelete={handleDelete}
                                            onToggleStatus={handleToggleStatus}
                                        />
                                    ) : (
                                        <CategoryTable
                                            categories={disabledCategories}
                                            currentPage={disabledCurrentPage}
                                            itemsPerPage={itemsPerPage}
                                            onPageChange={setDisabledCurrentPage}
                                            onEdit={handleOpenModal}
                                            onDelete={handleDelete}
                                            onToggleStatus={handleToggleStatus}
                                        />
                                    )}
                                </div>
                            </Stack>
                        </Paper>
                    </>
                )}
            </Stack>

            <CategoryModal
                opened={opened}
                onClose={handleCloseModal}
                form={form}
                onSubmit={handleSubmit}
                isEditing={!!editingCategory}
                isSubmitting={isSubmitting}
                parentOptions={parentOptions}
            />

            <ModalConfirmStatus
                opened={toggleModalOpened}
                onClose={closeToggleModal}
                category={categoryToToggle}
                includeChildren={includeChildren}
                onIncludeChildrenChange={setIncludeChildren}
                onConfirm={handleConfirmToggle}
                isSubmitting={isSubmitting}
            />

            <ModalDelete
                opened={deleteModalOpened}
                onClose={closeDeleteModal}
                category={categoryToDelete}
                onConfirmDelete={handleConfirmDelete}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default CategoryPage;
