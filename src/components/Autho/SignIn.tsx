import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Checkbox,
  Anchor,
  Stack,
  Divider,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import ResetPassword from './ResetPasswrod';
import { useDisclosure } from '@mantine/hooks';

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<SignInFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => {
        if (!value) return 'Email là bắt buộc';
        if (!/^\S+@\S+$/.test(value)) return 'Email không hợp lệ';
        return null;
      },
      password: (value) => {
        if (!value) return 'Mật khẩu là bắt buộc';
        if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        return null;
      },
    },
  });

  const handleSubmit = async (values: SignInFormValues) => {
    setLoading(true);
    try {
      console.log('Login values:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Login error:', error);
      form.setErrors({ password: 'Email hoặc mật khẩu không chính xác' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Title order={1} className="text-3xl font-bold mb-6 text-center text-slate-800">
          Đăng nhập
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              size="md"
            />

            <PasswordInput
              label="Mật khẩu"
              placeholder="Mật khẩu của bạn"
              required
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              size="md"
            />

            <Group justify="apart">
              <Checkbox
                label="Ghi nhớ đăng nhập"
                checked={form.values.rememberMe}
                onChange={(event) => form.setFieldValue('rememberMe', event.currentTarget.checked)}
              />
              <Anchor size="sm" component="button" type="button" className="text-primary" onClick={open}>
                Quên mật khẩu?
              </Anchor>
            </Group>

            <Button
              fullWidth
              type="submit"
              loading={loading}
              className="bg-primary hover:bg-primary/90 mt-4"
              size="md"
            >
              Đăng nhập
            </Button>
          </Stack>
        </form>

        <Divider label="Hoặc đăng nhập với" labelPosition="center" my="lg" />

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
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </Text>
        {
          opened && <ResetPassword opened={opened} close={close} />
        }
      </div>
    </div>
  );
}