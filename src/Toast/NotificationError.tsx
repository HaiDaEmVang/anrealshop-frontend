import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';

interface NotificationErrorProps {
  title?: string;
  message: string;
}

/**
 * Hiển thị thông báo lỗi với biểu tượng cảnh báo và màu đỏ
 */
export const showErrorNotification = ({ title = 'Lỗi', message }: NotificationErrorProps) => {
  return notifications.show({
    title,
    message,
    color: 'red', // Màu đỏ cho thông báo lỗi
    icon: <IconAlertCircle size={18} />,
    withBorder: true,
    autoClose: 5000,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.white,
        borderColor: theme.colors.red[6],
        '&::before': { backgroundColor: theme.colors.red[6] },
      },
      title: { color: theme.colors.red[7] },
      description: { color: theme.colors.gray[7] },
      closeButton: {
        color: theme.colors.gray[7],
        '&:hover': { backgroundColor: theme.colors.gray[0] },
      },
    }),
  });
};

export default showErrorNotification;