import React, { useState, useEffect } from 'react';
import {
  Modal,
  Group,
  Button,
  SimpleGrid,
  TextInput,
  Select,
  Grid,
  Radio,
  Title,
} from '@mantine/core';
import { FiCheck, FiMapPin } from 'react-icons/fi';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { type ShippingAddress } from './Address';

interface ModalFormAddressProps {
  opened: boolean;
  onClose: () => void;
  onAddAddress: (address: ShippingAddress) => void;
  dummyVietnamProvinces: { value: string; label: string }[];
  dummyVietnamDistricts: Record<string, { value: string; label: string }[]>;
  dummyVietnamWards: Record<string, { value: string; label: string }[]>;
  addressToEdit?: ShippingAddress | null;
}

const ModalFormAddress: React.FC<ModalFormAddressProps> = ({
  opened,
  onClose,
  onAddAddress,
  dummyVietnamProvinces,
  dummyVietnamDistricts,
  dummyVietnamWards,
  addressToEdit = null,
}) => {
  const [districts, setDistricts] = useState<{ value: string; label: string }[]>([]);
  const [wards, setWards] = useState<{ value: string; label: string }[]>([]);
  const isEditMode = Boolean(addressToEdit);

  // Form cho địa chỉ mới hoặc chỉnh sửa
  const addressForm = useForm({
    initialValues: {
      fullName: '',
      phone: '',
      email: '',
      province: '',
      district: '',
      ward: '',
      streetAddress: '',
      isDefault: false,
    },
    validate: {
      fullName: (value) => (value.trim() === '' ? 'Họ tên không được để trống' : null),
      phone: (value) => (/^[0-9]{10}$/.test(value) ? null : 'Số điện thoại không hợp lệ'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
      province: (value) => (value ? null : 'Vui lòng chọn Tỉnh/Thành phố'),
      district: (value) => (value ? null : 'Vui lòng chọn Quận/Huyện'),
      ward: (value) => (value ? null : 'Vui lòng chọn Phường/Xã'),
      streetAddress: (value) => (value.trim() === '' ? 'Địa chỉ không được để trống' : null),
    },
  });

  // Cập nhật form với dữ liệu địa chỉ cần chỉnh sửa
  useEffect(() => {
    if (opened && addressToEdit) {
      addressForm.setValues({
        fullName: addressToEdit.fullName,
        phone: addressToEdit.phone,
        email: addressToEdit.email,
        province: addressToEdit.province,
        district: addressToEdit.district,
        ward: addressToEdit.ward,
        streetAddress: addressToEdit.streetAddress,
        isDefault: addressToEdit.isDefault,
      });
      
      // Cập nhật districts và wards dựa trên province và district
      if (addressToEdit.province) {
        setDistricts(dummyVietnamDistricts[addressToEdit.province] || []);
      }
      if (addressToEdit.district) {
        setWards(dummyVietnamWards[addressToEdit.district] || []);
      }
    } else if (opened && !addressToEdit) {
      // Reset form khi mở modal thêm mới
      addressForm.reset();
      setDistricts([]);
      setWards([]);
    }
  }, [opened, addressToEdit]);

  // Update districts when province changes
  useEffect(() => {
    if (addressForm.values.province) {
      setDistricts(dummyVietnamDistricts[addressForm.values.province] || []);
      
      // Chỉ reset district và ward khi không phải đang load dữ liệu từ addressToEdit
      if (!addressToEdit || addressToEdit.province !== addressForm.values.province) {
        addressForm.setFieldValue('district', '');
        addressForm.setFieldValue('ward', '');
      }
    }
  }, [addressForm.values.province, dummyVietnamDistricts]);

  // Update wards when district changes
  useEffect(() => {
    if (addressForm.values.district) {
      setWards(dummyVietnamWards[addressForm.values.district] || []);
      
      // Chỉ reset ward khi không phải đang load dữ liệu từ addressToEdit
      if (!addressToEdit || addressToEdit.district !== addressForm.values.district) {
        addressForm.setFieldValue('ward', '');
      }
    }
  }, [addressForm.values.district, dummyVietnamWards]);

  const handleSubmit = (values: ShippingAddress) => {
    onAddAddress(values);
    notifications.show({
      title: isEditMode ? 'Địa chỉ đã được cập nhật' : 'Địa chỉ đã được lưu',
      message: isEditMode 
        ? 'Địa chỉ đã được cập nhật thành công' 
        : 'Địa chỉ mới đã được lưu và chọn cho đơn hàng này',
      color: 'green',
      icon: <FiCheck />,
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3} className="text-slate-800 flex items-center">
          <FiMapPin className="inline-block mr-2" size={18} /> 
          {isEditMode ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        </Title>
      }
      size="lg"
      padding="xl"
      radius="md"
      centered
    >
      <form onSubmit={addressForm.onSubmit(handleSubmit)}>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            label="Họ và tên"
            required
            placeholder="Nhập họ và tên"
            radius="md"
            size="md"
            {...addressForm.getInputProps('fullName')}
          />
          <TextInput
            label="Số điện thoại"
            required
            placeholder="Nhập số điện thoại"
            radius="md"
            size="md"
            {...addressForm.getInputProps('phone')}
          />
        </SimpleGrid>

        <TextInput
          label="Email"
          required
          placeholder="Nhập địa chỉ email"
          mt="md"
          radius="md"
          size="md"
          {...addressForm.getInputProps('email')}
        />

        <Grid grow mt="md">
          <Grid.Col span={4}>
            <Select
              label="Tỉnh/Thành phố"
              required
              placeholder="Chọn Tỉnh/Thành phố"
              data={dummyVietnamProvinces}
              {...addressForm.getInputProps('province')}
              searchable
              radius="md"
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Quận/Huyện"
              required
              placeholder="Chọn Quận/Huyện"
              data={districts}
              {...addressForm.getInputProps('district')}
              disabled={!addressForm.values.province}
              searchable
              radius="md"
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Phường/Xã"
              required
              placeholder="Chọn Phường/Xã"
              data={wards}
              {...addressForm.getInputProps('ward')}
              disabled={!addressForm.values.district}
              searchable
              radius="md"
              size="md"
            />
          </Grid.Col>
        </Grid>

        <TextInput
          label="Địa chỉ cụ thể"
          required
          placeholder="Số nhà, tên đường, tòa nhà, ..."
          mt="md"
          radius="md"
          size="md"
          {...addressForm.getInputProps('streetAddress')}
        />

        <Radio
          mt="lg"
          label="Đặt làm địa chỉ mặc định"
          checked={addressForm.values.isDefault}
          onChange={(e) => addressForm.setFieldValue('isDefault', e.currentTarget.checked)}
        />

        <Group justify="right" mt="xl">
          <Button
            variant="default"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            color="blue"
            type="submit"
            radius="md"
            leftSection={<FiCheck size={16} />}
            className="bg-primary hover:bg-picton-blue-600"
          >
            {isEditMode ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ModalFormAddress;