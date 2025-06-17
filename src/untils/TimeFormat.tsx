import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatMessageTime = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date >= today) {
    return format(date, 'HH:mm', { locale: vi });
  } else if (date >= yesterday) {
    return 'Hôm qua';
  } else if (now.getFullYear() === date.getFullYear()) {
    return format(date, 'dd/MM', { locale: vi });
  } else {
    return format(date, 'dd/MM/yyyy', { locale: vi });
  }
};

export const getStatusColor = (status: string) => {
  switch(status) {
    case 'pending': return 'yellow';
    case 'processing': return 'blue';
    case 'shipping': return 'indigo';
    case 'completed': return 'green';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};