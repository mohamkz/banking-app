import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTransactionDate = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) 
      ? 'Date invalide' 
      : date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  } catch {
    return 'Date invalide';
  }
};

export const formatCurrency = (value: number) => {
  if (isNaN(value) || value == null) return '0,00 $US';

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
