import {
    Button,
    Center,
    Divider,
    FileInput,
    Group,
    Image,
    Modal,
    Paper,
    Select,
    Stack,
    Switch,
    Text,
    Textarea,
    TextInput
} from '@mantine/core';
import React, { useEffect, useMemo, useState } from 'react';
import { FiImage, FiUpload } from 'react-icons/fi';

interface Category {
    id: string;
    name: string;
    parentId: string | null;
    description: string;
    slug: string;
    active: boolean;
    order: number;
    level: number;
    imageUrl?: string;
    children?: Category[];
}

interface FlatCategory extends Omit<Category, 'children'> {}


interface CategoryModalProps {
    opened: boolean;
    onClose: () => void;
    onSave: () => void;
    currentCategory: Category | null;
    isEditing: boolean;
    handleCategoryChange: (field: keyof Category, value: any) => void;
    flatCategories: FlatCategory[];
    getDescendantIds: (categoryId: string) => string[];
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    opened,
    onClose,
    onSave,
    currentCategory,
    isEditing,
    handleCategoryChange,
    flatCategories,
    getDescendantIds
}) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const currentCategoryId = currentCategory?.id;
    const currentCategoryLevel = currentCategory?.level;

    useEffect(() => {
        if (opened && currentCategory) {
            setImagePreview(currentCategory.imageUrl || null);
            setUploadedFile(null);
        }
        if (!opened) {
            setImagePreview(null);
            setUploadedFile(null);
        }
    }, [opened, currentCategory]);

    const handleImageUpload = (file: File | null) => {
        setUploadedFile(file);

        if (!file) {
            setImagePreview(null);
            handleCategoryChange('imageUrl', null);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Kích thước file không được vượt quá 2MB");
            setUploadedFile(null);
            setImagePreview(currentCategory?.imageUrl || null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && e.target.result) {
                const result = e.target.result as string;
                setImagePreview(result);
                handleCategoryChange('imageUrl', result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = () => {
        setImagePreview(null);
        setUploadedFile(null);
        handleCategoryChange('imageUrl', null);
    };

    const disabledCategoryIdsForParentSelector = useMemo(() => {
        if (currentCategoryId && isEditing) {
            return new Set([currentCategoryId, ...getDescendantIds(currentCategoryId)]);
        }
        return new Set<string>();
    }, [currentCategoryId, isEditing, getDescendantIds]);

    const parentCategoryOptions = useMemo(() => {
        return flatCategories.map(cat => ({
            value: cat.id,
            label: '—'.repeat(cat.level) + ' ' + cat.name,
            disabled: disabledCategoryIdsForParentSelector.has(cat.id)
        }));
    }, [flatCategories, disabledCategoryIdsForParentSelector]);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            centered
            size="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Stack>
                <Divider label="Thông tin cơ bản" labelPosition="center" />

                <TextInput
                    label="Tên danh mục"
                    placeholder="Nhập tên danh mục"
                    required
                    value={currentCategory?.name || ''}
                    onChange={(e) => handleCategoryChange('name', e.target.value)}
                />

                <TextInput
                    label="Slug"
                    placeholder="slug-danh-muc"
                    description="Định danh duy nhất để tạo URL"
                    required
                    value={currentCategory?.slug || ''}
                    onChange={(e) => handleCategoryChange('slug', e.target.value.replace(/\s+/g, '-').toLowerCase())}
                />

                <Select
                    label="Danh mục cha"
                    placeholder="Chọn danh mục cha (nếu có)"
                    clearable
                    data={parentCategoryOptions}
                    value={currentCategory?.parentId || null}
                    onChange={(value) => {
                        const parentLevel = value ? (flatCategories.find(c => c.id === value)?.level ?? -1) : -1;
                        const newLevel = parentLevel + 1;
                        handleCategoryChange('parentId', value);
                        handleCategoryChange('level', newLevel);
                        
                        const siblings = value 
                            ? flatCategories.filter(c => c.parentId === value) 
                            : flatCategories.filter(c => c.parentId === null);
                        
                        if (!isEditing || (currentCategory && currentCategory.parentId !== value)) {
                           handleCategoryChange('order', siblings.length + 1);
                        }
                    }}
                    searchable
                />

                <Textarea
                    label="Mô tả"
                    placeholder="Nhập mô tả cho danh mục"
                    value={currentCategory?.description || ''}
                    onChange={(e) => handleCategoryChange('description', e.target.value)}
                    minRows={2}
                />

                <Divider label="Hình ảnh đại diện" labelPosition="center" mt="md" />

                <FileInput
                    label="Hình ảnh danh mục"
                    placeholder="Chọn hoặc kéo thả hình ảnh"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    leftSection={<FiUpload size={14} />}
                    description={`Ảnh đại diện cho danh mục${currentCategoryLevel === 0
                        ? ' (khuyến nghị 400x250px)'
                        : currentCategoryLevel === 1 ? ' (khuyến nghị 300x300px)'
                        : ' (khuyến nghị 200x200px)'
                        }`}
                    onChange={handleImageUpload}
                    value={uploadedFile}
                    clearable
                />

                {imagePreview ? (
                    <Paper withBorder p="xs">
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            height={150}
                            fit="contain"
                            fallbackSrc="https://placehold.co/300x150?text=Preview"
                        />
                        <Group justify="space-between" mt="xs">
                            <Text size="xs" c="dimmed">Xem trước hình ảnh</Text>
                            <Button
                                variant="subtle"
                                color="red"
                                size="xs"
                                onClick={handleDeleteImage}
                            >
                                Xóa hình
                            </Button>
                        </Group>
                    </Paper>
                ) : (
                    <Paper
                        withBorder
                        p="md"
                        style={{
                            height: 150,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f9fafb'
                        }}
                    >
                        <Center>
                            <Stack align="center" gap="xs">
                                <FiImage size={32} className="text-gray-400" />
                                <Text size="sm" c="dimmed" ta="center">
                                    Chưa có hình ảnh
                                </Text>
                            </Stack>
                        </Center>
                    </Paper>
                )}

                <Divider label="Cài đặt khác" labelPosition="center" mt="md" />

                <Switch
                    label="Hiển thị danh mục này"
                    description="Danh mục sẽ được hiển thị công khai"
                    checked={currentCategory?.active || false}
                    onChange={(e) => handleCategoryChange('active', e.currentTarget.checked)}
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={onClose}>Hủy</Button>
                    <Button
                        onClick={onSave}
                        disabled={!currentCategory?.name || !currentCategory?.slug}
                    >
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default CategoryModal;