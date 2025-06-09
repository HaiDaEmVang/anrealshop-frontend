import React from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { FiAlertTriangle, FiSave, FiCheck } from 'react-icons/fi';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityProps {
  initialPasswordValues?: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  loginActivities?: Array<{
    location: string;
    device: string;
    date: string;
    isCurrent: boolean;
  }>;
}

const Security: React.FC<SecurityProps> = ({
  initialPasswordValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  loginActivities = [
    {
      location: 'Hà Nội, Việt Nam',
      device: 'Chrome trên Windows',
      date: '02/06/2023, 15:30',
      isCurrent: true
    },
    {
      location: 'Hồ Chí Minh, Việt Nam',
      device: 'Firefox trên Mac',
      date: '01/06/2023, 10:15',
      isCurrent: false
    }
  ]
}) => {
  // Form đổi mật khẩu
  const passwordForm = useForm({
    initialValues: initialPasswordValues,
    validate: {
      currentPassword: (value) => (value.length >= 6 ? null : 'Mật khẩu phải có ít nhất 6 ký tự'),
      newPassword: (value) => (value.length >= 6 ? null : 'Mật khẩu phải có ít nhất 6 ký tự'),
      confirmPassword: (value, values) => (value === values.newPassword ? null : 'Mật khẩu không khớp'),
    },
  });

  // Xử lý đổi mật khẩu
  const handleChangePassword = (values: PasswordFormValues) => {
    // Xử lý thay đổi mật khẩu với API
    console.log('Thay đổi mật khẩu:', values);
    
    // Reset form
    passwordForm.reset();
    
    // Hiển thị thông báo thành công
    notifications.show({
      title: 'Đổi mật khẩu',
      message: 'Mật khẩu đã được thay đổi thành công',
      color: 'green',
      icon: <FiCheck />,
    });
  };

  return (
    <>
      <Title order={4} className="!mb-4 text-slate-800">Đổi mật khẩu</Title>
      
      <Box component="form" onSubmit={passwordForm.onSubmit(handleChangePassword)}>
        <Group align="flex-start">
          <Box style={{ flex: 1, maxWidth: 400 }}>
            <Alert color="blue" mb="md">
              <Group className='!flex !items-center !gap-2'>
                <FiAlertTriangle size={16} />
                <Text size="sm">
                  Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                </Text>
              </Group>
            </Alert>
            
            <PasswordInput
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              className="mb-3"
              {...passwordForm.getInputProps('currentPassword')}
            />
            
            <PasswordInput
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              className="mb-3"
              {...passwordForm.getInputProps('newPassword')}
            />
            
            <PasswordInput
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              className="mb-3"
              {...passwordForm.getInputProps('confirmPassword')}
            />
            
            <Button
              type="submit"
              className="mt-2 bg-primary hover:bg-picton-blue-600"
              leftSection={<FiSave size={16} />}
            >
              Đổi mật khẩu
            </Button>
          </Box>
          
          <Divider orientation="vertical" />
          
          <Box>
            <Title order={6} className="mb-3 text-slate-800">Hoạt động đăng nhập gần đây</Title>
            <Stack>
              {loginActivities.map((activity, index) => (
                <Box key={index} className="p-3 border border-gray-100 rounded-md">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>{activity.location}</Text>
                    {activity.isCurrent && (
                      <Badge color="green" size="sm">Hiện tại</Badge>
                    )}
                  </Group>
                  <Text size="xs" color="dimmed">{activity.device} · {activity.date}</Text>
                </Box>
              ))}
            </Stack>
          </Box>
        </Group>
      </Box>
    </>
  );
};

export default Security;