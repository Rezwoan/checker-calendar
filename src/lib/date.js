export function startOfToday(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
export function toISODate(d) {
    return d.toISOString().slice(0, 10)
}
export function getMonthMatrix(year, month) {
    // returns 6x7 grid of Date objects for calendar
    const first = new Date(year, month, 1)
    const start = new Date(first)
    start.setDate(first.getDate() - ((first.getDay() + 6) % 7)) // Monday=0 style grid
    const days = []
    for (let i = 0; i < 42; i++) {
        const dt = new Date(start)
        dt.setDate(start.getDate() + i)
        days.push(dt)
    }
    return days
}
export function isSameDay(a, b) { return a.toDateString() === b.toDateString() }
export function rangeDays(from, to) {
    const out = []
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) out.push(new Date(d))
    return out
}
