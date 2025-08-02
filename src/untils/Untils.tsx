import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Function to format date/time for conversations
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

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
 
export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
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


export function formatSkuPart(input: string, maxLen: number = 3): string {
  if (!input) return '';

  return input
    .normalize('NFD')                    
    .replace(/[\u0300-\u036f]/g, '')    
    .replace(/đ/g, 'd')                 
    .replace(/Đ/g, 'D')                 
    .replace(/[^a-zA-Z0-9]/g, '')       
    .substring(0, maxLen)               
    .toUpperCase();                     
}