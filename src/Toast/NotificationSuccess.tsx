import { notifications } from '@mantine/notifications';
import { FaCheckCircle } from 'react-icons/fa';

interface NotificationSuccessProps {
  title?: string;
  message: string;
}

/**
 * Hiển thị thông báo thành công với biểu tượng check và màu primary
 */
export const showSuccessNotification = ({ title = 'Thành công', message }: NotificationSuccessProps) => {
  return notifications.show({
    title,
    message,
    color: 'primary', // Sử dụng màu primary thay vì màu green mặc định
    icon: <FaCheckCircle size={20} className='text-primary' />,
    withBorder: true,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.white,
        borderColor: theme.colors.blue[6], // Sử dụng màu primary cho viền
        '&::before': { backgroundColor: theme.colors.blue[6] },
      },
      title: { color: theme.colors.blue[6] },
      description: { color: theme.colors.gray[7] },
      closeButton: {
        color: theme.colors.gray[7],
        '&:hover': { backgroundColor: theme.colors.gray[0] },
      },
    }),
  });
};

export default showSuccessNotification;