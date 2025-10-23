import { notifications } from '@mantine/notifications';
import { TbFaceIdError } from "react-icons/tb";

export const showErrorNotification = (title = 'Lỗi', message: string) => {
  return notifications.show({
    title,
    message,
    color: 'red',
    icon: <TbFaceIdError size={18} />,
    withBorder: true,
    autoClose: 5000,
    styles: (theme) => ({
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderColor: theme.colors.red[4],
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        '&::before': { backgroundColor: theme.colors.red[5] },
      },
      title: {
        color: theme.colors.red[7],
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

export default showErrorNotification;