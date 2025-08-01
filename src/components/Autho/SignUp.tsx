// import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Checkbox,
  Stack,
  Divider,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux';
import type { RegisterRequest } from '../../types/UserType';
import showSuccessNotification from '../Toast/NotificationSuccess';
import { registerUser } from '../../feature/auth/authSlice';
import showErrorNotification from '../Toast/NotificationError';
import { validateAgreeTerms, validateConfirmPassword, validateEmail, validatePassword } from '../../untils/ValidateInput';

interface SignUpFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const form = useForm<SignUpFormValues>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
    validate: {
      fullName: (value) => (value ? null : 'Họ tên là bắt buộc'),
      email: (value) => {
        return validateEmail(value);
      },
      password: (value) => {
        return validatePassword(value);
      },
      confirmPassword: (value, values) => {
        return validateConfirmPassword(values.password, value);
      },
      agreeTerms: (value) => {
        return validateAgreeTerms(value);
      },
    },
  });

  const handleSubmit = async (values: SignUpFormValues) => {
    const registerData: RegisterRequest = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    }
    try {
      await dispatch(registerUser(registerData)).unwrap();
      showSuccessNotification('Đăng ký thành công!', `Chào mừng ${values.fullName || " bạn"} đến với hệ thống!`);
      navigate('/login');
    }catch (err: any) {
      console.error('Registration failed:', err);
      let notificationMessage = err.message || 'Đã có lỗi xảy ra trong quá trình đăng ký.';

      if (err.statusCode === 400 && err.details && Array.isArray(err.details)) {
        err.details.forEach((itemError: { field: string; message: string }) => {
          const formField = itemError.field === 'username' ? 'email' : itemError.field;
          if (form.values.hasOwnProperty(formField)) {
            form.setFieldError(formField, itemError.message);
          }
        });
        notificationMessage = err.message || 'Dữ liệu nhập vào không hợp lệ.';
      }

      showErrorNotification('Đăng ký thất bại', notificationMessage);
    }
  };

  return (
    <div className="w-1/2 bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Title order={1} className="text-3xl font-bold mb-6 text-center text-slate-800">
          Đăng ký
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Họ và tên"
              placeholder="Nhập tên đây nha thượng đế"
              required
              value={form.values.fullName}
              onChange={(event) => form.setFieldValue('fullName', event.currentTarget.value)}
              error={form.errors.fullName}
              size="md"
            />

            <TextInput
              label="Email"
              placeholder="email nè"
              required
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              size="md"
            />

            <PasswordInput
              label="Mật khẩu"
              placeholder="Ngày sinh người yêu cũ ha -.-"
              required
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              size="md"
            />

            <PasswordInput
              label="Xác nhận mật khẩu"
              placeholder="Nhang lại mật khẩu của bạn"
              required
              value={form.values.confirmPassword}
              onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
              error={form.errors.confirmPassword}
              size="md"
            />

            <Checkbox
              label="Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật"
              checked={form.values.agreeTerms}
              onChange={(event) => form.setFieldValue('agreeTerms', event.currentTarget.checked)}
              error={form.errors.agreeTerms}
            />

            <Button
              fullWidth
              type="submit"
              loading={isLoading}
              className="bg-primary hover:bg-primary/90 mt-4"
              size="md"
            >
              Đăng ký
            </Button>
          </Stack>
        </form>

        <Divider label="Hoặc đăng ký với" labelPosition="center" my="lg" />

        <Group grow>
          <Button
            leftSection={<FaGoogle size={16} />}
            variant="outline"
            className="border-gray-300"
          >
            Google
          </Button>
          <Button
            leftSection={<FaFacebook size={16} />}
            variant="outline"
            className="border-gray-300"
          >
            Facebook
          </Button>
        </Group>

        <Text className="!mt-6 text-center !text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Đăng nhập
          </Link>
        </Text>
      </div>
    </div>
  );
}