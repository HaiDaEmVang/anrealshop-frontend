import { notifications } from '@mantine/notifications';
import { FaCheckCircle } from 'react-icons/fa';



export const showSuccessNotification = ( title = 'Thành công', message : string ) => {
  return notifications.show({
    title,
    message,
    color: 'primary', 
    icon: <FaCheckCircle size={20} className='text-primary' />,
    withBorder: true,
    styles: (theme) => ({
      root: {
        backgroundColor: theme.white,
        borderColor: theme.colors.blue[6], 
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