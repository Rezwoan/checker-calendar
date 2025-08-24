// Stats & streak helpers
import { toISODate, addDays, startOfToday, startOfWeek, startOfMonth, startOfYear, isSameDay } from './date'

export function normalizeTabChecks(checks = {}) {
    // return Set of iso dates that are checked === true
    const s = new Set()
    for (const [iso, v] of Object.entries(checks)) if (v?.checked) s.add(iso)
    return s
}

export function currentStreak(checkedSet, today = startOfToday()) {
    // count consecutive days up to today (if today not checked, streak may be 0)
    let d = new Date(today)
    let count = 0
    while (checkedSet.has(toISODate(d))) {
        count++
        d = addDays(d, -1)
    }
    return count
}

export function bestStreak(checkedSet) {
    // O(n log n) by iterating over sorted dates
    const dates = Array.from(checkedSet).sort()
    let best = 0
    let run = 0
    for (let i = 0; i < dates.length; i++) {
        if (i === 0) { run = 1; best = 1; continue }
        const prev = new Date(dates[i - 1])
        const cur = new Date(dates[i])
        const diff = Math.round((cur - prev) / 86400000)
        run = diff === 1 ? run + 1 : 1
        if (run > best) best = run
    }
    return best
}

export function countsForPeriods(checkedSet, now = new Date()) {
    const todayISO = toISODate(now)
    const weekStart = startOfWeek(now)       // Monday
    const monthStart = startOfMonth(now)
    const yearStart = startOfYear(now)

    let today = 0, week = 0, month = 0, year = 0
    for (const iso of checkedSet) {
        const d = new Date(iso)
        if (iso === todayISO) today++
        if (d >= weekStart) week++
        if (d >= monthStart) month++
        if (d >= yearStart) year++
    }
    return { today, week, month, year }
}

export function lastNDaysArray(checkedSet, n = 30, endDate = startOfToday()) {
    const arr = []
    for (let i = n - 1; i >= 0; i--) {
        const d = addDays(endDate, -i)
        const iso = toISODate(d)
        arr.push({ iso, checked: checkedSet.has(iso), date: d })
    }
    return arr
}

export function percent(a, b) {
    if (b === 0) return 0
    return Math.round((a / b) * 100)
}
