import {
    ActionIcon,
    Button,
    Group,
    Paper,
    Stack,
    TextInput,
    Title
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiEdit3, FiPlus } from 'react-icons/fi';
import RichTextEditor from '../../../RichText/RichTextEditor';
import HierarchicalCategoryModal from './ModalAddCategory';

interface CategoryItem {
    value: string;
    label: string;
    parent?: string;
}
interface BasicInforProps {
  form: UseFormReturnType<{
    name: string;
    category: string;
    categoryPath: string[];
    tags: string[];
    sku: string;
    price: number;
    comparePrice: number;
    costPrice: number;
    stock: number;
    weight: number;
    shortDescription: string;
    isActive: boolean;
    isFeatured: boolean;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    description: string;
  }>;
  categories: CategoryItem[];
  tagsData: { value: string; label: string }[];
}



const BasicInfor = ({ form, categories }: BasicInforProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [categoryModalOpened, setCategoryModalOpened] = useState(false);
    const [categoryDisplay, setCategoryDisplay] = useState('');

    const toggleSection = () => {
        setCollapsed(prev => !prev);
    };

    const handleCategorySelect = (selectedPath: string[]) => {
        if (selectedPath && selectedPath.length > 0) {
            // Store the full path
            form.setFieldValue('categoryPath', selectedPath);

            // Set the last category as the selected one
            form.setFieldValue('category', selectedPath[selectedPath.length - 1]);

            // For display purposes, fetch category names
            const categoryNames = selectedPath.map(id => {
                const category = categories.find(cat => cat.value === id);
                return category ? category.label : id;
            });

            setCategoryDisplay(categoryNames.join(' > '));
        }
    };

    return (
        <Paper shadow="xs" p="md" mb="md" className="bg-white">
            <Group justify="space-between" mb={collapsed ? 0 : "md"}>
                <Title order={5}>Thông tin cơ bản</Title>
                <ActionIcon variant="subtle" onClick={toggleSection}>
                    {collapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
                </ActionIcon>
            </Group>

            {!collapsed && (
                <Stack>
                    <TextInput
                        label="Tên sản phẩm"
                        placeholder="Nhập tên sản phẩm"
                        required
                        value={form.values.name}
                        onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                        error={form.errors.name}
                    />

                    {/* Replace Select with custom category selector */}
                    <div>
                        <Group mb={5}>
                            <label className="text-sm font-medium">Danh mục <span className="text-red-500">*</span></label>
                            <Button
                                variant="subtle"
                                size="xs"
                                leftSection={<FiPlus size={14} />}
                                onClick={() => setCategoryModalOpened(true)}
                            >
                                Thêm danh mục
                            </Button>
                        </Group>

                        {form.values.category ? (
                            <div className="flex items-center gap-2 border p-2 rounded">
                                <div className="text-sm flex-grow">
                                    {categoryDisplay || form.values.category}
                                </div>
                                <Button
                                    variant="subtle"
                                    size="xs"
                                    leftSection={<FiEdit3 size={14} />}
                                    onClick={() => setCategoryModalOpened(true)}
                                >
                                    Thay đổi
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="default"
                                fullWidth
                                leftSection={<FiPlus size={16} />}
                                onClick={() => setCategoryModalOpened(true)}
                            >
                                Chọn danh mục sản phẩm
                            </Button>
                        )}

                        {form.errors.category && (
                            <div className="text-xs text-red-500 mt-1">
                                {form.errors.category}
                            </div>
                        )}
                    </div>

                    <HierarchicalCategoryModal
                        opened={categoryModalOpened}
                        onClose={() => setCategoryModalOpened(false)}
                        onSelect={handleCategorySelect}
                        initialSelected={form.values.categoryPath || []}
                    />

                    {/* Add RichTextEditor here */}
                    <RichTextEditor
                        label="Mô tả sản phẩm"
                        value={form.values.description || ''}
                        onChange={(value) => form.setFieldValue('description', value)}
                        error={form.errors.description ? "Nội dung trống" : undefined}
                        description="Mô tả chi tiết về sản phẩm, tính năng và lợi ích khi sử dụng"
                        minHeight={250}
                    />

                </Stack>
            )}
        </Paper>
    );
};

export default BasicInfor;