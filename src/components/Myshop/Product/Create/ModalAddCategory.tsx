import {
    Modal,
    Button,
    Group,
    Text,
    Stack,
    ScrollArea,
    Box,
    Badge,
    ActionIcon,
    Input,
    Divider
} from '@mantine/core';
import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiArrowRight, FiChevronRight, FiX, FiHome, FiPlus } from 'react-icons/fi';

interface Category {
    id: string;
    name: string;
    parentId?: string;
    level: number;
    children?: Category[];
}

interface FlatCategory {
    id: string;
    name: string;
    parentId?: string;
    level: number;
}

interface HierarchicalCategoryModalProps {
    opened: boolean;
    onClose: () => void;
    onSelect: (selectedPath: string[]) => void;
    initialSelected?: string[];
}

// Sample category data - replace with your actual data
const sampleCategories: FlatCategory[] = [
    // Level 1
    { id: 'men', name: 'Thời trang nam', level: 1 },
    { id: 'women', name: 'Thời trang nữ', level: 1 },
    { id: 'kids', name: 'Trẻ em', level: 1 },

    // Level 2 - Men
    { id: 'men-pants', name: 'Quần nam', parentId: 'men', level: 2 },
    { id: 'men-shirts', name: 'Áo nam', parentId: 'men', level: 2 },
    { id: 'men-shoes', name: 'Giày nam', parentId: 'men', level: 2 },

    // Level 2 - Women
    { id: 'women-pants', name: 'Quần nữ', parentId: 'women', level: 2 },
    { id: 'women-shirts', name: 'Áo nữ', parentId: 'women', level: 2 },
    { id: 'women-shoes', name: 'Giày nữ', parentId: 'women', level: 2 },

    // Level 3 - Men's pants
    { id: 'men-shorts', name: 'Quần đùi', parentId: 'men-pants', level: 3 },
    { id: 'men-jeans', name: 'Quần jeans', parentId: 'men-pants', level: 3 },
    { id: 'men-khakis', name: 'Quần kaki', parentId: 'men-pants', level: 3 },

    // Level 3 - Men's shirts
    { id: 'men-tshirts', name: 'Áo thun', parentId: 'men-shirts', level: 3 },
    { id: 'men-polos', name: 'Áo polo', parentId: 'men-shirts', level: 3 },

    // Level 3 - Women's pants
    { id: 'women-shorts', name: 'Quần đùi', parentId: 'women-pants', level: 3 },
    { id: 'women-jeans', name: 'Quần jeans', parentId: 'women-pants', level: 3 },
    { id: 'women-khakis', name: 'Quần kaki', parentId: 'women-pants', level: 3 },

    // Sub-level for men shorts (example of a deeper hierarchy)
    { id: 'men-shorts-wide', name: 'Quần đùi ống rộng', parentId: 'men-shorts', level: 3 },
    { id: 'men-shorts-slim', name: 'Quần đùi ống hẹp', parentId: 'men-shorts', level: 3 },
];

const buildHierarchy = (flatCategories: FlatCategory[]): Category[] => {
    const map: Record<string, Category> = {};
    const roots: Category[] = [];

    // First pass: create all category objects
    flatCategories.forEach(cat => {
        map[cat.id] = {
            id: cat.id,
            name: cat.name,
            parentId: cat.parentId,
            level: cat.level,
            children: []
        };
    });

    // Second pass: build the hierarchy
    flatCategories.forEach(cat => {
        if (cat.parentId && map[cat.parentId]) {
            map[cat.parentId].children = map[cat.parentId].children || [];
            map[cat.parentId].children!.push(map[cat.id]);
        } else {
            roots.push(map[cat.id]);
        }
    });

    return roots;
};

const HierarchicalCategoryModal = ({
    opened,
    onClose,
    onSelect,
    initialSelected = []
}: HierarchicalCategoryModalProps) => {
    const [selectedCategories, setSelectedCategories] = useState<{ id: string, name: string }[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number>(1);
    const [parentPath, setParentPath] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Build hierarchical structure
    const hierarchicalCategories = useMemo(() => buildHierarchy(sampleCategories), []);

    // Filter categories for current view based on selected parent and level
    const currentCategories = useMemo(() => {
        let result: Category[] = [];

        if (parentPath.length === 0) {
            // Show root categories
            result = hierarchicalCategories;
        } else {
            // Navigate to the selected category
            let currentNode: Category[] = hierarchicalCategories;
            for (const categoryId of parentPath) {
                const found = currentNode.find(cat => cat.id === categoryId);
                if (found && found.children) {
                    currentNode = found.children;
                } else {
                    break;
                }
            }
            result = currentNode;
        }

        // Apply search filter if needed
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return result.filter(cat => cat.name.toLowerCase().includes(query));
        }

        return result;
    }, [hierarchicalCategories, parentPath, searchQuery]);

    // Initialize from props if available
    useEffect(() => {
        if (initialSelected && initialSelected.length > 0) {
            const selected: { id: string, name: string }[] = [];

            // Find the complete path based on initialSelected IDs
            let currentCategories = hierarchicalCategories;
            for (const categoryId of initialSelected) {
                const foundCategory = sampleCategories.find(cat => cat.id === categoryId);
                if (foundCategory) {
                    selected.push({ id: foundCategory.id, name: foundCategory.name });
                }
            }

            setSelectedCategories(selected);
            setParentPath(initialSelected.slice(0, -1));
            setCurrentLevel(initialSelected.length);
        }
    }, [initialSelected, hierarchicalCategories]);

    const handleCategorySelect = (category: Category) => {
        // If category has children, navigate to them
        if (category.children && category.children.length > 0) {
            setParentPath([...parentPath, category.id]);
            setCurrentLevel(currentLevel + 1);
        }

        // Update the selected path
        const newSelectedCategories = [
            ...selectedCategories.slice(0, category.level - 1),
            { id: category.id, name: category.name }
        ];
        setSelectedCategories(newSelectedCategories);
    };

    const handleGoBack = () => {
        if (parentPath.length > 0) {
            setParentPath(parentPath.slice(0, -1));
            setCurrentLevel(currentLevel - 1);
            setSelectedCategories(selectedCategories.slice(0, -1));
        }
    };

    const handleSave = () => {
        onSelect(selectedCategories.map(cat => cat.id));
        onClose();
    };

    const handleRemoveSelected = (index: number) => {
        setSelectedCategories(selectedCategories.slice(0, index));
        setParentPath(parentPath.slice(0, index));
        setCurrentLevel(index + 1);
    };

    const navigateToLevel = (level: number) => {
        if (level <= parentPath.length + 1) {
            setParentPath(parentPath.slice(0, level - 1));
            setCurrentLevel(level);
            setSelectedCategories(selectedCategories.slice(0, level));
        }
    };

    const getBreadcrumbs = () => {
        return (
            <Group gap={4} align="center" mb="md" className="flex-wrap">
                <Button
                    variant={parentPath.length === 0 ? "light" : "subtle"}
                    size="xs"
                    leftSection={<FiHome size={14} />}
                    onClick={() => {
                        setParentPath([]);
                        setCurrentLevel(1);
                        setSelectedCategories([]);
                    }}
                    px="xs"
                    h={30}
                >
                    Tất cả danh mục
                </Button>

                {selectedCategories.map((cat, index) => (
                    <Group key={cat.id} gap={4}>
                        <FiChevronRight size={14} className="text-gray-400" />
                        <Button
                            variant={index === selectedCategories.length - 1 ? "light" : "subtle"}
                            size="xs"
                            onClick={() => navigateToLevel(index + 1)}
                            px="xs"
                            h={30}
                        >
                            {cat.name}
                        </Button>
                    </Group>
                ))}
            </Group>
        );
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Chọn danh mục sản phẩm"
            size="lg"
        >
            <Stack>
                <Input
                    leftSection={<FiSearch size={16} />}
                    placeholder="Tìm kiếm danh mục..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />

                {/* Breadcrumbs */}
                {getBreadcrumbs()}

                {/* Selected path */}
                {selectedCategories.length > 0 && (
                    <Box className="bg-gray-50 p-2 rounded">
                        <Text size="sm" fw={500} mb={5}>Danh mục đã chọn:</Text>
                        <Group>
                            {selectedCategories.map((cat, index) => (
                                <Badge
                                    key={cat.id}
                                    size="lg"
                                    rightSection={
                                        <ActionIcon
                                            size="xs"
                                            radius="xl"
                                            onClick={() => handleRemoveSelected(index)}
                                        >
                                            <FiX size={12} />
                                        </ActionIcon>
                                    }
                                >
                                    {cat.name}
                                </Badge>
                            ))}
                        </Group>
                    </Box>
                )}

                <Divider label={`Cấp ${currentLevel}`} labelPosition="center" />

                {/* Category list */}
                <ScrollArea style={{ height: 300 }}>
                    {currentCategories.length > 0 ? (
                        <Stack gap={8}>
                            {currentCategories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant="light"
                                    color="gray"
                                    fullWidth
                                    justify="space-between"
                                    className="text-start"
                                    onClick={() => handleCategorySelect(category)}
                                    rightSection={category.children && category.children.length > 0 ? (
                                        <FiChevronRight size={16} />
                                    ) : null}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </Stack>
                    ) : (
                        <Text ta="center" c="dimmed" py="xl">
                            Không tìm thấy danh mục nào
                        </Text>
                    )}
                </ScrollArea>

                {currentLevel > 1 && (
                    <Button
                        variant="subtle"
                        onClick={handleGoBack}
                        leftSection={<FiArrowRight className="rotate-180" size={16} />}
                        size="sm"
                    >
                        Quay lại cấp trước
                    </Button>
                )}

                <Group justify="apart">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Hủy
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={selectedCategories.length === 0}
                    >
                        Xác nhận
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default HierarchicalCategoryModal;