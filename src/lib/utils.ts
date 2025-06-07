import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeAgo(date: Date, t?: (key: string, options?: { count?: number }) => string): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (!t) {
    // Fallback for when translation function is not available
    if (diffInSeconds < 30) return "just now";
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInWeeks === 1) return "1 week ago";
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    if (diffInMonths === 1) return "1 month ago";
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    if (diffInYears === 1) return "1 year ago";
    return `${diffInYears} years ago`;
  }

  // With translation support
  if (diffInSeconds < 30) return t('time.justNow');
  if (diffInMinutes < 1) return t('time.justNow');
  if (diffInMinutes === 1) return t('time.minuteAgo', { count: 1 });
  if (diffInMinutes < 60) return t('time.minutesAgo', { count: diffInMinutes });
  if (diffInHours === 1) return t('time.hourAgo', { count: 1 });
  if (diffInHours < 24) return t('time.hoursAgo', { count: diffInHours });
  if (diffInDays === 1) return t('time.dayAgo', { count: 1 });
  if (diffInDays < 7) return t('time.daysAgo', { count: diffInDays });
  if (diffInWeeks === 1) return t('time.weekAgo', { count: 1 });
  if (diffInWeeks < 4) return t('time.weeksAgo', { count: diffInWeeks });
  if (diffInMonths === 1) return t('time.monthAgo', { count: 1 });
  if (diffInMonths < 12) return t('time.monthsAgo', { count: diffInMonths });
  if (diffInYears === 1) return t('time.yearAgo', { count: 1 });
  return t('time.yearsAgo', { count: diffInYears });
}

export function formatExpiryTime(expiryDate: Date, t?: (key: string, options?: { count?: number }) => string): string {
  const now = new Date();
  const diffInHours = Math.floor(
    (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  );

  if (!t) {
    // Fallback for when translation function is not available
    if (diffInHours < 0) return "Expired";
    if (diffInHours < 1) return "Expires soon";
    if (diffInHours < 24) return `${diffInHours}h left`;
    return `${Math.floor(diffInHours / 24)}d left`;
  }

  // With translation support
  if (diffInHours < 0) return t('expiry.expired');
  if (diffInHours < 1) return t('expiry.expiresSoon');
  if (diffInHours < 24) return t('expiry.hoursLeft', { count: diffInHours });
  return t('expiry.daysLeft', { count: Math.floor(diffInHours / 24) });
}
