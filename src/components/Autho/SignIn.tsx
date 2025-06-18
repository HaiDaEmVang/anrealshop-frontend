import { Link, useNavigate } from 'react-router-dom';
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
import { useDisclosure } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginUser } from '../../feature/auth/authSlice';
import showSuccessNotification from '../Toast/NotificationSuccess';
import showErrorNotification from '../Toast/NotificationError';
import ResetPassword from './ResetPasswrod';
import type { LoginRequest } from '../../types/AuthType';
import type { UserDto } from '../../types/UserType';

interface SignInFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth); 
  const isLoading = status === 'loading';
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
    form.clearErrors(); 
    const loginData: LoginRequest = {
      username: values.email, 
      password: values.password,
    };

    try {
      const resultAction = await dispatch(loginUser(loginData)).unwrap();
      const user: UserDto = resultAction.user; 
      
      showSuccessNotification('Đăng nhập thành công!', `Chào mừng ${user.fullName || user.username} trở lại!`);
      navigate('/');
    } catch (err: any) {
      console.error('Login failed in component:', err);

      let notificationMessage = err.message || 'Email hoặc mật khẩu không chính xác.';
      
      if (err.statusCode === 400 && err.details && Array.isArray(err.details)) {
        err.details.forEach((itemError: { field: string; message: string }) => {
          const formField = itemError.field === 'username' ? 'email' : itemError.field;
          if (form.values.hasOwnProperty(formField)) {
            form.setFieldError(formField, itemError.message);
          }
        });
        notificationMessage = err.message || 'Dữ liệu nhập vào không hợp lệ.';
      } else {
          notificationMessage = err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
      }

     showErrorNotification('Đăng nhập thất bại', notificationMessage);
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
              {...form.getInputProps('email')}
              size="md"
            />

            <PasswordInput
              label="Mật khẩu"
              placeholder="Mật khẩu của bạn"
              required
              {...form.getInputProps('password')}
              size="md"
            />

            <Group justify="apart">
              <Checkbox
                label="Ghi nhớ đăng nhập"
                {...form.getInputProps('rememberMe', { type: 'checkbox' })}
              />
              <Anchor size="sm" component="button" type="button" className="text-primary" onClick={open}>
                Quên mật khẩu?
              </Anchor>
            </Group>

            <Button
              fullWidth
              type="submit"
              loading={isLoading}
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
        {opened && <ResetPassword opened={opened} close={close} />}
      </div>
    </div>
  );
}