// src/core/utils/calendar.ts

import {EthDateTime} from 'ethiopian-calendar-date-converter';

// Ethiopian months (approximate start day in Gregorian for non-leap year)
export const ETHIOPIAN_MONTHS = [
  {name: 'መስከረም', startDay: 11}, // September
  {name: 'ጥቅምት', startDay: 11}, // October
  {name: 'ኅዳር', startDay: 10}, // November
  {name: 'ታኅሣሥ', startDay: 10}, // December
  {name: 'ጥር', startDay: 9}, // January
  {name: 'የካቲት', startDay: 8}, // February
  {name: 'መጋቢት', startDay: 10}, // March
  {name: 'ሚያዝያ', startDay: 9}, // April
  {name: 'ግንቦት', startDay: 9}, // May
  {name: 'ሰኔ', startDay: 8}, // June
  {name: 'ሐምሌ', startDay: 8}, // July
  {name: 'ነሐሴ', startDay: 7}, // August
  {name: 'ጳጉሜን', startDay: 6}, // Pagumen (intercalary month)
];

// Ethiopian days of the week
export const ETHIOPIAN_DAYS_OF_WEEK = [
  'እሑድ', // Sunday
  'ሰኞ', // Monday
  'ማክሰኞ', // Tuesday
  'ረቡዕ', // Wednesday
  'ሐሙስ', // Thursday
  'ዓርብ', // Friday
  'ቅዳሜ', // Saturday
];

// Function to get the current date as a string in YYYY-MM-DD format
export const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Julian Date for Ethiopian epoch (approximate)
// This is a simplification. Accurate conversion is complex.
export const ETHIOPIAN_EPOCH_JULIAN_DATE = 1724220.5; // Julian day for 0001-01-01 (Ethiopian)

// Calculate days between two dates (simple difference)
export const getDaysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};

// --- Function to Get Ethiopian Date String ---
export function getEthiopianDateString(date: Date = new Date()): string {
  try {
    const ethiopianDate: EthDateTime = EthDateTime.fromEuropeanDate(date);
    const day: number = ethiopianDate.date;
    const monthIndex: number = ethiopianDate.month - 1;
    const monthName: string =
      ETHIOPIAN_MONTHS[monthIndex]?.name || `Month ${ethiopianDate.month}`;
    const year: number = ethiopianDate.year;
    return `${monthName} ${day}, ${year} ዓ.ም`;
  } catch (error: unknown) {
    console.error('Calendar Util: Error calculating Ethiopian date:', error); // Changed to single quotes
    return 'ቀኑን ማሳየት አልተቻለም።'; // Changed to single quotes // "Could not display the date."
  }
}

// --- Function to Get Ethiopian Date Object ---
export function getEthiopianDate(date: Date = new Date()): EthDateTime {
  try {
    return EthDateTime.fromEuropeanDate(date);
  } catch (error: unknown) {
    console.error('Calendar Util: Error calculating Ethiopian date:', error);
    throw error;
  }
}

// --- Function to Check if Date is Today ---
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
