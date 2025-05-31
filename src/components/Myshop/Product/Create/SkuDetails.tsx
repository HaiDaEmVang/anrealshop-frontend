import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Divider,
    Group,
    Image,
    MultiSelect,
    NumberInput,
    Paper,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';

interface ProductVariant {
    id: string;
    sku: string;
    attributes: {
        [key: string]: string;
    };
    price: number;
    comparePrice?: number;
    stock: number;
    image?: string;
}

interface VariantAttribute {
    id: string;
    name: string;
    values: string[];
}

interface SkuDetailsProps {
    form: UseFormReturnType<any>;
}

// Classification options
const CLASSIFICATION_OPTIONS = [
    { value: 'color', label: 'Màu sắc' },
    { value: 'size', label: 'Kích thước' },
    { value: 'material', label: 'Chất liệu' },
    { value: 'style', label: 'Phong cách' }
];

// Sample values for each classification
const SAMPLE_VALUES = {
    color: [
        'Đỏ', 'Xanh', 'Đen', 'Trắng', 'Vàng', 'Nâu', 'Hồng', 'Tím', 'Cam', 'Xám'
    ],
    size: [
        'S', 'M', 'L', 'XL', '2XL', '3XL', '35', '36', '37', '38', '39', '40', '41', '42'
    ],
    material: [
        'Cotton', 'Polyester', 'Da', 'Nylon', 'Denim', 'Len', 'Lụa'
    ],
    style: [
        'Thường ngày', 'Trang trọng', 'Thể thao', 'Đường phố', 'Vintage', 'Tối giản'
    ]
};

const SkuDetails = ({ form }: SkuDetailsProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [attributes, setAttributes] = useState<VariantAttribute[]>([]);
    const [selectedClassificationType, setSelectedClassificationType] = useState<string | null>(null);

    // Generate variants based on attributes
    const generateVariantCombinations = () => {
        // Only use attributes that have values
        const activeAttributes = attributes.filter(attr => attr.values.length > 0);

        if (activeAttributes.length === 0) {
            return [];
        }

        // Create combinations of values
        const generateCombinations = (attrIndex = 0, currentCombination: Record<string, string> = {}) => {
            if (attrIndex >= activeAttributes.length) {
                // We have a complete combination
                return [currentCombination];
            }

            const currentAttr = activeAttributes[attrIndex];
            const combinations: Record<string, string>[] = [];

            // For each value of the current attribute
            for (const value of currentAttr.values) {
                const newCombination = {
                    ...currentCombination,
                    [currentAttr.name]: value
                };

                // Recursively generate combinations for the next attribute
                const nestedCombinations = generateCombinations(attrIndex + 1, newCombination);
                combinations.push(...nestedCombinations);
            }

            return combinations;
        };

        const combinations = generateCombinations();

        // Convert combinations to variants
        return combinations.map(combo => {
            // Create SKU from combination
            const skuBase = form.values.name
                ? form.values.name.substring(0, 3).toUpperCase()
                : 'PRD';

            let skuSuffix = '';
            Object.entries(combo).forEach(([key, value]) => {
                // Take first 2 chars of each value
                const shortValue = value.substring(0, 2).toUpperCase();
                skuSuffix += `-${shortValue}`;
            });

            return {
                id: randomId(),
                sku: `${skuBase}${skuSuffix}`,
                attributes: combo,
                price: form.values.price || 0,
                comparePrice: form.values.comparePrice || 0,
                stock: form.values.stock || 0,
                image: ''
            };
        });
    };

    // Update variants when attributes change
    useEffect(() => {
        const variants = generateVariantCombinations();
        form.setFieldValue('variants', variants);
    }, [attributes]);

    const toggleSection = () => {
        setCollapsed(!collapsed);
    };

    const addClassification = () => {
        if (!selectedClassificationType) return;

        // Get label from options
        const classificationType = CLASSIFICATION_OPTIONS.find(
            opt => opt.value === selectedClassificationType
        );

        if (!classificationType) return;

        // Add new attribute with empty values
        const newAttribute = {
            id: randomId(),
            name: classificationType.label,
            values: []
        };

        setAttributes([...attributes, newAttribute]);
        setSelectedClassificationType(null);
    };

    const updateAttributeValues = (attributeId: string, values: string[] | { value: string, label: string }[]) => {
        // Convert to array of strings if objects are passed
        const stringValues = Array.isArray(values)
            ? values.map(v => typeof v === 'string' ? v : v.value)
            : [];

        setAttributes(
            attributes.map(attr =>
                attr.id === attributeId
                    ? { ...attr, values: stringValues }
                    : attr
            )
        );
    };

    const removeAttribute = (attributeId: string) => {
        setAttributes(attributes.filter(attr => attr.id !== attributeId));
    };

    const handleImageUpload = (variantId: string, file: File | null) => {
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        const updatedVariants = form.values.variants.map((variant: ProductVariant) =>
            variant.id === variantId ? { ...variant, image: imageUrl } : variant
        );

        form.setFieldValue('variants', updatedVariants);
    };

    const updateVariantField = (variantId: string, field: string, value: any) => {
        const updatedVariants = form.values.variants.map((variant: ProductVariant) =>
            variant.id === variantId ? { ...variant, [field]: value } : variant
        );

        form.setFieldValue('variants', updatedVariants);
    };

    // Create a data array for the MultiSelect with sample values
    const getValueSuggestions = (classificationType: string) => {
        const typeKey = CLASSIFICATION_OPTIONS.find(opt => opt.label === classificationType)?.value;
        if (!typeKey || !SAMPLE_VALUES[typeKey as keyof typeof SAMPLE_VALUES]) {
            return [];
        }

        return SAMPLE_VALUES[typeKey as keyof typeof SAMPLE_VALUES].map(value => ({
            value,
            label: value
        }));
    };

    return (
        <>
            <Paper shadow="xs" p="md" mb="md" className="bg-white">
                {/* Header */}
                <Group justify="space-between" mb={collapsed ? 0 : "md"}>
                    <Title order={5}>Phân loại sản phẩm</Title>
                    <ActionIcon variant="subtle" onClick={toggleSection}>
                        {collapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
                    </ActionIcon>
                </Group>

                {!collapsed && (
                    <Stack>
                        {/* Add classification button */}
                        <Group align="flex-end">
                            <Select
                                label="Loại phân loại"
                                placeholder="Chọn loại phân loại"
                                data={CLASSIFICATION_OPTIONS}
                                value={selectedClassificationType}
                                onChange={setSelectedClassificationType}
                                w="70%"
                                clearable
                            />

                            <Button
                                leftSection={<FiPlus size={16} />}
                                onClick={addClassification}
                                disabled={!selectedClassificationType}
                            >
                                Thêm phân loại
                            </Button>
                        </Group>
                        {/* Classification list */}
                        {attributes.map(attribute => (
                            <Card key={attribute.id} p="xs" mb="xs" shadow="xs">
                                <Group justify="apart" mb="xs">
                                    <Text fw={500}>{attribute.name}</Text>
                                    <ActionIcon
                                        color="red"
                                        variant="subtle"
                                        onClick={() => removeAttribute(attribute.id)}
                                    >
                                        <FiTrash2 size={16} />
                                    </ActionIcon>
                                </Group>

                                <MultiSelect
                                    data={getValueSuggestions(attribute.name)}
                                    placeholder={`Chọn hoặc nhập giá trị cho ${attribute.name.toLowerCase()}`}
                                    searchable
                                    value={attribute.values}
                                    onChange={(values: any) => updateAttributeValues(attribute.id, values)}
                                    clearable
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim() !== '') {
                                            const newValue = (e.target as HTMLInputElement).value.trim();
                                            updateAttributeValues(attribute.id, [...attribute.values, newValue]);
                                            (e.target as HTMLInputElement).value = '';
                                            e.preventDefault();
                                        }
                                    }}
                                />

                                {attribute.values.length > 0 && (
                                    <Group mt="xs" gap={8}>
                                        {attribute.values.map(value => (
                                            <Badge key={value} variant="outline">
                                                {value}
                                            </Badge>
                                        ))}
                                    </Group>
                                )}
                            </Card>
                        ))}



                        {/* Variant list */}
                        {form.values.variants?.length > 0 && (
                            <>


                                <Card p="sm" mb="md" shadow="none">
                                    <Group align="flex-end">
                                        <NumberInput
                                            placeholder="Giá bán cho tất cả"
                                            min={0}
                                            step={1000}
                                            rightSection={<Text size="xs">₫</Text>}
                                            id="bulk-price"
                                            style={{ flex: 1 }}
                                        />

                                        <NumberInput
                                            placeholder="Tồn kho cho tất cả"
                                            min={0}
                                            step={1}
                                            id="bulk-stock"
                                            style={{ flex: 1 }}
                                        />

                                        <Button
                                            onClick={() => {
                                                const priceInput = document.getElementById('bulk-price') as HTMLInputElement;
                                                const stockInput = document.getElementById('bulk-stock') as HTMLInputElement;

                                                // Parse values manually
                                                const priceValue = priceInput ? priceInput.value.replace(/[^\d.-]/g, '') : '';
                                                const stockValue = stockInput ? stockInput.value : '';

                                                const price = priceValue ? parseFloat(priceValue) : null;
                                                const stock = stockValue ? parseFloat(stockValue) : null;

                                                const validPrice = price !== null && !isNaN(price);
                                                const validStock = stock !== null && !isNaN(stock);

                                                if (validPrice || validStock) {
                                                    const updatedVariants = form.values.variants.map((variant: ProductVariant) => ({
                                                        ...variant,
                                                        ...(validPrice ? { price: price as number } : {}),
                                                        ...(validStock ? { stock: stock as number } : {})
                                                    }));

                                                    form.setFieldValue('variants', updatedVariants);

                                                    // Nếu đang dùng ref thì xài thế này, còn controlled component thì reset qua state
                                                    if (priceInput) priceInput.value = '';
                                                    if (stockInput) stockInput.value = '';
                                                }
                                            }}
                                        >
                                            Áp dụng
                                        </Button>
                                    </Group>
                                </Card>

                                <Divider label="Danh sách phân loại" labelPosition="center" />

                                <div className="overflow-x-auto">
                                    <Table striped highlightOnHover >
                                        <Table.Thead>
                                            <Table.Tr>
                                                {attributes.map(attr => (
                                                    <Table.Th key={attr.id}>{attr.name}</Table.Th>
                                                ))}
                                                <Table.Th>Hình ảnh</Table.Th>
                                                <Table.Th>Giá</Table.Th>
                                                <Table.Th>Tồn kho</Table.Th>
                                                <Table.Th>SKU</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {form.values.variants.map((variant: ProductVariant, index: number) => (
                                                <Table.Tr key={variant.id}>
                                                    {attributes.map(attr => (
                                                        <Table.Td key={`${variant.id}-${attr.id}`}>
                                                            {variant.attributes[attr.name] || '-'}
                                                        </Table.Td>
                                                    ))}
                                                    <Table.Td>
                                                        <div className="w-12 h-12 relative">
                                                            {variant.image ? (
                                                                <Image
                                                                    src={variant.image}
                                                                    alt={`Variant ${index}`}
                                                                    width={48}
                                                                    height={48}
                                                                    fit="cover"
                                                                />
                                                            ) : (
                                                                <label
                                                                    className="border border-dashed border-gray-300 rounded flex items-center justify-center h-full w-full cursor-pointer hover:border-blue-500"
                                                                    htmlFor={`variant-image-${variant.id}`}
                                                                >
                                                                    <FiImage size={16} className="text-gray-400" />
                                                                    <input
                                                                        type="file"
                                                                        id={`variant-image-${variant.id}`}
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleImageUpload(variant.id, e.target.files?.[0] || null)}
                                                                    />
                                                                </label>
                                                            )}
                                                        </div>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <NumberInput
                                                            size="xs"
                                                            value={variant.price}
                                                            onChange={(val) => updateVariantField(variant.id, 'price', val ?? 0)}
                                                            min={0}
                                                            step={1000}
                                                            w={100}
                                                            hideControls
                                                            rightSection={<Text size="xs" c="dimmed">₫</Text>}
                                                        />
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <NumberInput
                                                            size="xs"
                                                            value={variant.stock}
                                                            onChange={(val) => updateVariantField(variant.id, 'stock', val)}
                                                            min={0}
                                                            step={1}
                                                            w={80}
                                                        />
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <TextInput
                                                            size="xs"
                                                            value={variant.sku}
                                                            onChange={(e) => updateVariantField(variant.id, 'sku', e.target.value)}
                                                            w={120}
                                                        />
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </Stack>
                )}
            </Paper>
        </>
    );
};

export default SkuDetails;