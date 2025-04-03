
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDays, differenceInDays, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol'
  }).format(amount);
}

export function calculateTotalPrice(dailyPrice: number, startDate: Date, endDate: Date): number {
  const days = differenceInDays(endDate, startDate) + 1; // Include both start and end date
  return dailyPrice * days;
}

export function formatDate(date: Date): string {
  return format(date, 'dd MMM, yyyy');
}

export function getDefaultEndDate(startDate: Date): Date {
  return addDays(startDate, 3); // Default rental period of 3 days
}
