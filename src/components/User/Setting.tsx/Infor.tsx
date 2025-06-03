import {
    Avatar,
    Box,
    Button,
    FileButton,
    Group,
    Select,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import {
    FiCheck,
    FiMail,
    FiSave,
    FiUpload
} from 'react-icons/fi';

interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

interface InforProps {
  initialProfileData?: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    avatar?: string;
  }
}

const Infor: React.FC<InforProps> = ({ 
  initialProfileData = {
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3'
  }
}) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialProfileData.avatar || null);
  
  // Form quản lý thông tin cá nhân
  const profileForm = useForm({
    initialValues: {
      fullName: initialProfileData.fullName,
      email: initialProfileData.email,
      phone: initialProfileData.phone,
      dateOfBirth: initialProfileData.dateOfBirth,
      gender: initialProfileData.gender,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
      phone: (value) => (/^[0-9]{10}$/.test(value) ? null : 'Số điện thoại không hợp lệ'),
    },
  });

  // Xử lý thay đổi avatar
  const handleAvatarChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Hiển thị thông báo thành công
      notifications.show({
        title: 'Cập nhật ảnh đại diện',
        message: 'Ảnh đại diện đã được cập nhật thành công',
        color: 'green',
        icon: <FiCheck />,
      });
    }
  };

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateProfile = (values: ProfileFormValues) => {
    // Xử lý cập nhật thông tin với API
    console.log('Cập nhật thông tin:', values);
    
    // Hiển thị thông báo thành công
    notifications.show({
      title: 'Cập nhật thông tin',
      message: 'Thông tin cá nhân đã được cập nhật thành công',
      color: 'green',
      icon: <FiCheck />,
    });
  };

  return (
    <>
      <Title order={4} className="!mb-6 text-slate-800">Thông tin cá nhân</Title>
      <Group align="flex-start" className="!mb-6">
        {/* Avatar */}
        <Box>
          <Text size="sm" fw={500} className="!mb-2 text-slate-700">
            Ảnh đại diện
          </Text>
          <Box className="flex flex-col items-center">
            <Avatar
              src={avatarPreview}
              alt="Avatar"
              size={120}
              radius={120}
              className="border-4 border-gray-100"
            />
            
            <FileButton
              onChange={handleAvatarChange}
              accept="image/png,image/jpeg,image/jpg"
            >
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  size="xs"
                  color="blue"
                  className="mt-3"
                  leftSection={<FiUpload size={14} />}
                >
                  Tải ảnh lên
                </Button>
              )}
            </FileButton>
            
            <Text size="xs" color="dimmed" className="!mt-2 text-center">
              JPG, JPEG hoặc PNG. Tối đa 1MB
            </Text>
          </Box>
        </Box>
        
        {/* Thông tin cá nhân */}
        <Box style={{ flex: 1 }} component="form" onSubmit={profileForm.onSubmit(handleUpdateProfile)}>
          <Text size="sm" fw={500} className="!mb-4 text-slate-700">
            Thông tin cơ bản
          </Text>
          
          <TextInput
            label="Họ và tên"
            placeholder="Nhập họ và tên đầy đủ"
            className="mb-3"
            {...profileForm.getInputProps('fullName')}
          />
          
          <Group grow className="mb-3">
            <TextInput
              label="Email"
              placeholder="example@gmail.com"
              rightSection={<FiMail size={16} />}
              {...profileForm.getInputProps('email')}
            />
            
            <TextInput
              label="Số điện thoại"
              placeholder="0912345678"
              {...profileForm.getInputProps('phone')}
            />
          </Group>
          
          <Group grow className="mb-3">
            <TextInput
              label="Ngày sinh"
              placeholder="YYYY-MM-DD"
              {...profileForm.getInputProps('dateOfBirth')}
            />
            
            <Select
              label="Giới tính"
              placeholder="Chọn giới tính"
              data={[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' },
              ]}
              {...profileForm.getInputProps('gender')}
            />
          </Group>
          
          <Button
            type="submit"
            className="mt-4 bg-primary hover:bg-picton-blue-600"
            leftSection={<FiSave size={16} />}
          >
            Lưu thay đổi
          </Button>
        </Box>
      </Group>
    </>
  );
};

export default Infor;