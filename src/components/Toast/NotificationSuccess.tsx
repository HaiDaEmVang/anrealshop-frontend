import { notifications } from '@mantine/notifications';
import { FaCheckCircle } from 'react-icons/fa';

export const showSuccessNotification = (title = 'Thành công', message: string) => {
  return notifications.show({
    title,
    message,
    color: 'primary',
    icon: <FaCheckCircle size={20} className='text-primary' />,
    withBorder: true,
    styles: (theme) => ({
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderColor: theme.colors.blue[4],
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        '&::before': { backgroundColor: theme.colors.blue[5] },
      },
      title: {
        color: theme.colors.blue[7],
        fontWeight: 600
      },
      description: {
        color: theme.colors.gray[7]
      },
      closeButton: {
        color: theme.colors.gray[6],
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)'
        },
      },
    }),
  });
};

export default showSuccessNotification;