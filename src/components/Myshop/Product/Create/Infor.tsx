import { Stack } from '@mantine/core';
import { type UseFormReturnType } from '@mantine/form';
import '@mantine/tiptap/styles.css';
import type { ProductCreateRequest } from '../../../../types/ProductType';
import SkuInfor from './AttributeInfo/AttributeInfor';
import BasicInfor from './BasicInfo/BasicInfor';
import Shipping from './Shipping/Shipping';
import SkuDetails from './SkuDetail/SkuDetails';
import MediaUpload from './uploadImage/MediaUpload';
import { memo } from 'react';

interface InforProps {
  form: UseFormReturnType<ProductCreateRequest>;
  isEditMode?: boolean;
}

const Infor = memo(({ form, isEditMode = false }: InforProps) => {
  return (
    <Stack>
      <MediaUpload
        media={form.values.media} 
        setMedia={(newMedia) => form.setFieldValue('media', newMedia)} 
      />

      <BasicInfor 
        name={form.values.name}
        sortDescription={form.values.sortDescription}
        price={form.values.price}
        discountPrice={form.values.discountPrice}
        categoryId={form.values.categoryId}
        description={form.values.description}
        nameError={form.errors.name}
        sortDescriptionError={form.errors.sortDescription}
        priceError={form.errors.price}
        discountPriceError={form.errors.discountPrice}
        categoryIdError={form.errors.categoryId}
        onNameChange={(value) => form.setFieldValue('name', value)}
        onSortDescriptionChange={(value) => form.setFieldValue('sortDescription', value)}
        onPriceChange={(value) => form.setFieldValue('price', typeof value === 'string' ? parseFloat(value) || 0 : value)}
        onDiscountPriceChange={(value) => form.setFieldValue('discountPrice', typeof value === 'string' ? parseFloat(value) || 0 : value)}
        onCategoryIdChange={(value) => form.setFieldValue('categoryId', value)}
        onDescriptionChange={(value) => form.setFieldValue('description', value)}
      />

      <SkuInfor 
        attributes={form.values.attributes}
        onAttributesChange={(attributes) => form.setFieldValue('attributes', attributes)}
      />

      <SkuDetails form={form} />

      <Shipping 
        weightProps={{...form.getInputProps("weight")}} 
        heightProps={{...form.getInputProps("height")}} 
        withProps={{...form.getInputProps("width")}} 
        lengthProps={{...form.getInputProps("length")}}
      />
    </Stack>
  );
});

export default Infor;