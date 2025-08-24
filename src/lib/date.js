// src/lib/date.js

/** Return a new Date at local 00:00 for the given date */
export function startOfDay(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Today at local 00:00 */
export function startOfToday() {
    return startOfDay(new Date());
}

/** Add n days to a date and return a date at local 00:00 */
export function addDays(d, n) {
    const t = new Date(d);
    t.setDate(t.getDate() + n);
    return startOfDay(t);
}

/** Monday-start week beginning for a given date (local) */
export function startOfWeek(d = new Date()) {
    const day = (d.getDay() + 6) % 7; // Mon=0..Sun=6
    return addDays(startOfDay(d), -day);
}

/** First day of the month at 00:00 */
export function startOfMonth(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** First day of the year at 00:00 */
export function startOfYear(d = new Date()) {
    return new Date(d.getFullYear(), 0, 1);
}

/** Compare two dates by Y-M-D (local) */
export function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/** Format a Date as YYYY-MM-DD (local) */
export function toISODate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

/**
 * Build a 6x7 matrix (42 Date objects) for a month view.
 * Weeks start on Monday. Cells include leading/trailing days from adjacent months.
 */
export function getMonthMatrix(year, month /* 0-11 */) {
    const first = new Date(year, month, 1);
    const mondayIndex = (first.getDay() + 6) % 7; // Mon=0..Sun=6
    const start = addDays(first, -mondayIndex);

    const days = [];
    for (let i = 0; i < 42; i++) {
        days.push(addDays(start, i));
    }
    return days;
}

/**
 * rangeDays:
 * - rangeDays(n) -> last n days up to today (array of Date, oldest→newest)
 * - rangeDays(fromDate, toDate) -> inclusive range (array of Date, oldest→newest)
 */
export function rangeDays(a, b) {
    // Last N days
    if (typeof a === 'number') {
        const n = Math.max(1, a | 0);
        const end = startOfToday();
        const start = addDays(end, -(n - 1));
        return rangeDays(start, end);
    }

    // From..to (inclusive)
    const from = startOfDay(a);
    const to = startOfDay(b ?? a);
    const arr = [];
    for (let d = from; d <= to; d = addDays(d, 1)) {
        arr.push(d);
    }
    return arr;
}
