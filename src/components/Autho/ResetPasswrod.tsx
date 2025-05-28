import { useState, useEffect } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Modal,
  PinInput,
  Group,
  Text,
  Stack,
  Title
} from '@mantine/core';
import { FiMail, FiLock } from 'react-icons/fi';
import { useDisclosure } from '@mantine/hooks';

interface ResetPasswordProps {
  opened: boolean;
  close: () => void;
}

interface FormValues {
  email: string;
  otp: string;
  password: string;
}

interface FormErrors {
  email: string;
  otp: string;
  password: string;
}

export function ResetPassword(props: ResetPasswordProps) {
  const [valueForm, setValueForm] = useState<FormValues>({
    email: '',
    otp: '',
    password: ''
  });
  const [errorForm, setErrorForm] = useState<FormErrors>({
    email: '',
    otp: '',
    password: ''
  });
  
  const [otpSend, setOtpSend] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [resetting, setResetting] = useState(false);
  
  const [time, setTime] = useState(60);
  const [timeRequest, setTimeRequest] = useState(0);
  
  const [visible, { toggle }] = useDisclosure(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeRequest > 0) {
      interval = setInterval(() => {
        setTimeRequest(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRequest]);
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setValueForm(prev => ({ ...prev, [name]: value }));
    setErrorForm(prev => ({ ...prev, [name]: '' }));
  };
  
  const handleSendOTP = async () => {
    // Validate email
    if (!valueForm.email) {
      setErrorForm(prev => ({ ...prev, email: 'Email là bắt buộc' }));
      return;
    }
    
    if (!validateEmail(valueForm.email)) {
      setErrorForm(prev => ({ ...prev, email: 'Email không hợp lệ' }));
      return;
    }
    
    setOtpSending(true);
    try {
      // Here you would send a request to your API to send the OTP
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setOtpSend(true);
      setTimeRequest(time);
      // Show success message or notification here
    } catch (error) {
      setErrorForm(prev => ({ ...prev, email: 'Không thể gửi OTP. Vui lòng thử lại.' }));
    } finally {
      setOtpSending(false);
    }
  };
  
  const handleVerifyOtp = async (otp: string) => {
    setValueForm(prev => ({ ...prev, otp }));
    
    try {
      // Here you would verify the OTP with your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setVerifyOtp(true);
      // Show success message
    } catch (error) {
      setErrorForm(prev => ({ ...prev, otp: 'OTP không hợp lệ' }));
    }
  };
  
  const handleChangeEmail = () => {
    setOtpSend(false);
    setVerifyOtp(false);
    setValueForm(prev => ({ ...prev, otp: '', password: '' }));
    setErrorForm({ email: '', otp: '', password: '' });
  };
  
  const handleChangePass = async () => {
    // Validate password
    if (!valueForm.password) {
      setErrorForm(prev => ({ ...prev, password: 'Mật khẩu là bắt buộc' }));
      return;
    }
    
    if (valueForm.password.length < 6) {
      setErrorForm(prev => ({ ...prev, password: 'Mật khẩu phải có ít nhất 6 ký tự' }));
      return;
    }
    
    setResetting(true);
    try {
      // Here you would send a request to your API to reset the password
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Success - close the modal and show success message
      props.close();
      // You could show a notification here
    } catch (error) {
      setErrorForm(prev => ({ ...prev, password: 'Không thể đặt lại mật khẩu. Vui lòng thử lại.' }));
    } finally {
      setResetting(false);
    }
  };
  
  return (
    <Modal 
      opened={props.opened} 
      onClose={props.close} 
      title={
        <Title order={4} className="text-slate-800 mb-2">
          Đặt lại mật khẩu
        </Title>
      }
      centered
    >
      <Stack gap="md">
        {!verifyOtp && (
          <Text size="sm" className="text-gray-500 -mt-2 mb-2">
            Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
          </Text>
        )}
        
        <TextInput
          required
          name="email"
          error={errorForm.email}
          value={valueForm.email}
          onChange={handleChange}
          disabled={otpSend}
          leftSection={<FiMail className="w-5 h-5" />}
          rightSection={
            <Button 
              size="xs" 
              className="m-1" 
              variant="filled" 
              onClick={handleSendOTP}
              disabled={valueForm.email.length === 0 || otpSend}
              loading={otpSending}
            >
              Gửi OTP
            </Button>
          }
          rightSectionWidth={100}
          label="Email"
          placeholder="Email của bạn"
        />
        
        {otpSend && (
          <>
            <Text size="sm" className="text-gray-500 text-center">
              Nhập mã OTP đã được gửi đến email của bạn
            </Text>
            <Group justify="center">
              <PinInput
                autoFocus
                type="number"
                length={6}
                size="md"
                onComplete={handleVerifyOtp}
                onChange={(e) => setValueForm({...valueForm, 'otp': e})}
                error={!!errorForm.otp}
              />
            </Group>
            {errorForm.otp && (
              <Text size="sm" color="red" className="text-center">
                {errorForm.otp}
              </Text>
            )}
            
            <Group grow>
              <Button 
                variant="light" 
                color="primary"
                disabled={timeRequest > 0 || otpSending || verifyOtp} 
                onClick={handleSendOTP}
              >
                {timeRequest > 0 ? `${timeRequest}s` : "Gửi lại"}
              </Button>
              <Button 
                variant="filled" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleChangeEmail}
              >
                Đổi email
              </Button>
            </Group>
          </>
        )}
        
        {verifyOtp && (
          <>
            <PasswordInput
              required
              value={valueForm.password}
              onChange={handleChange}
              error={errorForm.password}
              name='password'
              leftSection={<FiLock className="w-5 h-5" />}
              label="Mật khẩu mới"
              visible={visible}
              onVisibilityChange={toggle}
              placeholder="Nhập mật khẩu mới"
            />
            
            <Button 
              fullWidth 
              variant="filled" 
              className="bg-primary hover:bg-primary/90"
              onClick={handleChangePass}
              loading={resetting}
            >
              Đặt lại mật khẩu
            </Button>
          </>
        )}
      </Stack>
    </Modal>
  );
}

export default ResetPassword;