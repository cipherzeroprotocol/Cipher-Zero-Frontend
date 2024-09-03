// formatUtils.ts

import numeral from 'numeral';
import { format } from 'date-fns';

// Format a number with commas
export function formatNumberWithCommas(number: number): string {
  return numeral(number).format('0,0');
}

// Format a date to a specified format
export function formatDate(date: Date, formatStr: string = 'MM/dd/yyyy'): string {
  return format(date, formatStr);
}

// Format a currency amount
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  return numeral(amount).format(`$0,0.00[${currencyCode}]`);
}

// Convert a number to a percentage string
export function formatPercentage(number: number): string {
  return numeral(number).format('0.00%');
}

// Format bytes into a human-readable string
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}