// // src/utils/errorNotifier.ts
// import { notifications } from '@mantine/notifications';

// interface NotifyErrorOptions {
//   title?: string;
//   message?: string;
//   error?: any;
//   autoClose?: number;
// }

// export function notifyError({
//   title = 'Đã xảy ra lỗi!',
//   message,
//   error,
//   autoClose = 5000,
// }: NotifyErrorOptions) {
//   const finalMessage =
//     message ||
//     error?.message ||
//     'Lỗi không xác định. Vui lòng thử lại sau.';

//   notifications.show({
//     title,
//     message: finalMessage,
//     color: 'red',
//     autoClose,
//   });
// }
