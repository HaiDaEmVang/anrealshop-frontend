import { notifications } from '@mantine/notifications';
import { FaMousePointer, FaTimesCircle } from 'react-icons/fa';

interface NotificationOptions {
  title?: string;
  message: string;
  onClick?: () => void;
  autoClose?: number | false;
}

export const showErrorNotification = (
  titleOrOptions: string | NotificationOptions,
  message?: string
) => {
  const options: NotificationOptions = typeof titleOrOptions === 'string'
    ? { title: titleOrOptions, message: message || '' }
    : titleOrOptions;

  const { title = 'Lỗi', message: msg, onClick, autoClose } = options;

  const finalAutoClose = autoClose !== undefined ? autoClose : (onClick ? 7000 : 4000);

  return notifications.show({
    title,
    message: (
      <div>
        <div>{msg}</div>
        {onClick && (
          <div className="mt-2 flex items-center gap-1 text-red-600 text-sm font-medium">
            <FaMousePointer size={12} />
            <span>Nhấn để xem chi tiết</span>
          </div>
        )}
      </div>
    ),
    color: 'red',
    icon: <FaTimesCircle size={20} className='text-red-500' />,
    withBorder: true,
    autoClose: finalAutoClose,
    onClick,
    styles: (theme) => ({
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderColor: theme.colors.red[4],
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        '&::before': { backgroundColor: theme.colors.red[5] },
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
        } : undefined,
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