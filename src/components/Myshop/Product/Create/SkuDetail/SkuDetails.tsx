import {
    ActionIcon,
    Divider,
    Group,
    Paper,
    Stack,
    Title
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { uploadToCloudinary } from '../../../../../service/Cloundinary';
import type { ProductAttribute } from '../../../../../types/AttributeType';
import type { ProductCreateRequest } from '../../../../../types/ProductType';
import showErrorNotification from '../../../../Toast/NotificationError';
import AttributeSelecter from './AttributeSelecter';
import SkuBulkAction from './SkuBlukAction';
import SkuTable from './SkuTable';


interface SkuDetailsProps {
    form: UseFormReturnType<ProductCreateRequest>;
    attributeForSkuData: ProductAttribute[];
    setIsShowQuantity?: (value: boolean) => void;
}

const SkuDetails = ({ form, attributeForSkuData, setIsShowQuantity }: SkuDetailsProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
    const [selectedClassificationType, setSelectedClassificationType] = useState<string | null>(null);

    const formValues = useMemo(() => ({
        name: form.values.name,
        price: form.values.price,
        quantity: form.values.quantity
    }), [form.values.name, form.values.price, form.values.quantity]);

    const generateSkuCombinations = useCallback(() => {
        const activeAttributes = attributes.filter(attr => attr.values.length > 0);
        if (activeAttributes.length === 0) return [];

        const combinations = (index = 0, current: Record<string, string> = {}): Record<string, string>[] => {
            if (index >= activeAttributes.length) return [current];
            const attr = activeAttributes[index];
            return attr.values.flatMap(value =>
                combinations(index + 1, { ...current, [attr.attributeKeyDisplay]: value })
            );
        };

        const skuBase = formValues.name?.substring(0, 3).toUpperCase() || 'PRD';
        return combinations().map(combo => {
            const skuSuffix = Object.values(combo)
                .map(value => value.substring(0, 2).toUpperCase())
                .join('-');

            const attributesArray: ProductAttribute[] = Object.entries(combo).map(([key, value]) => ({
                attributeKeyDisplay: key,
                attributeKeyName: key.toLowerCase().replace(/\s+/g, '_'),
                values: [value]
            }));

            return {
                sku: `${skuBase}-${skuSuffix}`,
                price: formValues.price || 0,
                quantity: formValues.quantity || 0,
                imageUrl: '',
                attributes: attributesArray
            };
        });
    }, [attributes, formValues]);

    useEffect(() => {
        const skus = generateSkuCombinations();
        const currentSkus = form.values.productSkus || [];
        const skusChanged = skus.length !== currentSkus.length ||
            skus.some((sku, index) => sku.sku !== currentSkus[index]?.sku);

        if (skusChanged) {
            form.setFieldValue('productSkus', skus);
        }
    }, [generateSkuCombinations]);

    const updateSku = useCallback((skuId: string, field: string, value: any) => {
        const updatedSkus = form.values.productSkus.map(sku =>
            sku.sku === skuId ? { ...sku, [field]: value } : sku
        );
        form.setFieldValue('productSkus', updatedSkus);
    }, [form]);

    const handleBulkApply = useCallback((price: number | null, quantity: number | null, imageUrl?: string | null) => {
        const updatedSkus = form.values.productSkus.map(sku => ({
            ...sku,
            ...(price && { price }),
            ...(quantity && { quantity }),
            ...(imageUrl && { imageUrl })
        }));
        form.setFieldValue('productSkus', updatedSkus);
    }, [form]);

    const handleGroupApply = useCallback((attributeName: string, attributeValue: string, price: number | null, quantity: number | null, imageUrl?: string | null) => {
        const updatedSkus = form.values.productSkus.map(sku => {
            const hasMatchingAttribute = sku.attributes.some(attr =>
                attr.attributeKeyName === attributeName.toLowerCase().replace(/\s+/g, '_') &&
                attr.values[0] === attributeValue[0]
            );

            if (hasMatchingAttribute) {
                return {
                    ...sku,
                    ...(price && { price }),
                    ...(quantity && { quantity }),
                    ...(imageUrl && { imageUrl })
                };
            }
            return sku;
        });

        form.setFieldValue('productSkus', updatedSkus);
    }, [form]);

    const handleImageUpload = useCallback(async (skuId: string, file: File | null) => { // <-- Thêm async
        if (!file) return;

        try {
            const result = await uploadToCloudinary(file, 'image');
            updateSku(skuId, 'imageUrl', result.secure_url); 
        } catch (error) {
            showErrorNotification("Thông báo", "Không thể tải lên hình ảnh");
        }
    }, [updateSku]);

    useEffect(() => {
        const willShowSkuBulkAction = form.values.productSkus?.length > 0;
        if (setIsShowQuantity) {
            setIsShowQuantity(!willShowSkuBulkAction);
        }
    }, [form.values.productSkus, setIsShowQuantity]);

    return (
        <Paper shadow="xs" p="md" mb="md" className="bg-white">
            <Group justify="space-between" mb={collapsed ? 0 : "md"}>
                <Title order={5}>Phân loại sản phẩm</Title>
                <ActionIcon variant="subtle" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
                </ActionIcon>
            </Group>

            {!collapsed && (
                <Stack>
                    <AttributeSelecter
                        attributeForSku={attributeForSkuData || []}
                        attributes={attributes}
                        selectedClassificationType={selectedClassificationType}
                        onAttributesChange={setAttributes}
                        onClassificationTypeChange={setSelectedClassificationType}
                    />

                    {form.values.productSkus?.length > 0 && (
                        <>
                            <Divider label="Thiết lập chung" labelPosition="center" />
                            <SkuBulkAction
                                attributes={attributes}
                                skus={form.values.productSkus}
                                onApplyBulk={handleBulkApply}
                                onApplyToGroup={handleGroupApply}
                            />
                            <Divider label="Danh sách phân loại" labelPosition="center" />
                            <SkuTable
                                attributes={attributes}
                                skus={form.values.productSkus}
                                onImageUpload={handleImageUpload}
                                onSkuFieldUpdate={updateSku}
                            />
                        </>
                    )}
                </Stack>
            )}
        </Paper>
    );
};

export default SkuDetails;