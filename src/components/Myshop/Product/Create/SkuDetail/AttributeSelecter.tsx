import {
    ActionIcon,
    Button,
    Card,
    Group,
    MultiSelect,
    Select,
    Stack,
    Text
} from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { useCallback, useMemo } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { attributeForSku } from '../../../../../data/AttributeData';

interface VariantAttribute {
    id: string;
    name: string;
    values: string[];
}

interface AttributeSelecterProps {
    attributes: VariantAttribute[];
    selectedClassificationType: string | null;
    onAttributesChange: (attributes: VariantAttribute[]) => void;
    onClassificationTypeChange: (type: string | null) => void;
}

const AttributeSelecter = ({
    attributes,
    selectedClassificationType,
    onAttributesChange,
    onClassificationTypeChange
}: AttributeSelecterProps) => {

    // Filter out already selected attributes
    const classificationOptions = useMemo(() => {
        const selectedAttributeNames = attributes.map(attr => {
            // Find the corresponding attribute in attributeForSku to get the keyName
            const foundAttr = attributeForSku.find(skuAttr => skuAttr.attributeKeyDisplay === attr.name);
            return foundAttr?.attributeKeyName;
        }).filter(Boolean);

        return attributeForSku
            .filter(attr => !selectedAttributeNames.includes(attr.attributeKeyName))
            .map(attr => ({
                value: attr.attributeKeyName,
                label: attr.attributeKeyDisplay
            }));
    }, [attributes]);

    const addClassification = useCallback(() => {
        if (!selectedClassificationType) return;

        const selectedAttr = attributeForSku.find(
            attr => attr.attributeKeyName === selectedClassificationType
        );

        if (!selectedAttr) return;

        const newAttribute = {
            id: randomId(),
            name: selectedAttr.attributeKeyDisplay,
            values: []
        };

        const updatedAttributes = [...attributes, newAttribute];
        onAttributesChange(updatedAttributes);
        onClassificationTypeChange(null);
    }, [selectedClassificationType, attributes, onAttributesChange, onClassificationTypeChange]);

    const updateAttributeValues = useCallback((attributeId: string, values: string[]) => {
        const updatedAttributes = attributes.map(attr =>
            attr.id === attributeId ? { ...attr, values } : attr
        );
        onAttributesChange(updatedAttributes);
    }, [attributes, onAttributesChange]);

    const removeAttribute = useCallback((attributeId: string) => {
        const updatedAttributes = attributes.filter(attr => attr.id !== attributeId);
        onAttributesChange(updatedAttributes);
    }, [attributes, onAttributesChange]);

    const getValueSuggestions = useCallback((classificationType: string) => {
        const attribute = attributeForSku.find(attr => attr.attributeKeyDisplay === classificationType);
        return attribute?.value.map(value => ({ value, label: value })) || [];
    }, []);

    return (
        <Stack>
            {/* Add classification */}
            <Group align="flex-end">
                <Select
                    label="Loại phân loại"
                    placeholder={classificationOptions.length > 0 ? "Chọn loại phân loại" : "Đã chọn hết thuộc tính"}
                    data={classificationOptions}
                    value={selectedClassificationType}
                    onChange={onClassificationTypeChange}
                    style={{ flex: 1 }}
                    clearable
                    disabled={classificationOptions.length === 0}
                />
                <Button
                    leftSection={<FiPlus size={16} />}
                    onClick={addClassification}
                    disabled={!selectedClassificationType || classificationOptions.length === 0}
                >
                    Thêm
                </Button>
            </Group>

            {/* Attributes list */}
            {attributes.map(attribute => (
                <Card key={attribute.id} p="xs" shadow="xs" className='!bg-gray-100'>
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
                        placeholder={`Chọn ${attribute.name.toLowerCase()}`}
                        searchable
                        value={attribute.values}
                        onChange={(values) => updateAttributeValues(attribute.id, values)}
                        clearable
                    />
                </Card>
            ))}
        </Stack>
    );
};

export default AttributeSelecter;
