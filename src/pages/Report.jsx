import React, { useMemo } from "react";
import StatCard from "../components/StatCard.jsx";
import ChartPanel from "../components/ChartPanel.jsx";
import { useAppStore } from "../store/useAppStore";
import { startOfToday, toISODate } from "../lib/date";
import { StreakSummary } from "../components/Streaks.jsx";

export default function Report() {
    const { activeTabId, checks, createdAt } = useAppStore();
    const tabChecks = checks[activeTabId] || {};
    const today = startOfToday();
    const todayISO = toISODate(today);

    const counters = useMemo(() => {
        const d = new Date(today);
        // this week (Mon..Sun)
        const weekday = (d.getDay() + 6) % 7;
        const monday = new Date(d);
        monday.setDate(d.getDate() - weekday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        // this month
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

        // year
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const yearEnd = new Date(d.getFullYear(), 11, 31);

        const countRange = (from, to) => {
            let c = 0;
            for (
                let dt = new Date(from);
                dt <= to;
                dt.setDate(dt.getDate() + 1)
            ) {
                const iso = toISODate(dt);
                if (tabChecks[iso]?.checked) c++;
            }
            return c;
        };

        const todayCount = tabChecks[todayISO]?.checked ? 1 : 0;
        return {
            today: todayCount,
            week: countRange(monday, sunday),
            month: countRange(monthStart, monthEnd),
            year: countRange(yearStart, yearEnd),
            lastCheck: (() => {
                const dates = Object.keys(tabChecks)
                    .filter((k) => tabChecks[k]?.checked)
                    .sort()
                    .reverse();
                return dates[0] || "—";
            })(),
            createdAt: createdAt?.slice(0, 10) || "—",
        };
    }, [activeTabId, checks, createdAt, todayISO]);

    return (
        <div className="space-y-3">
            {/* keep your charts */}
            <ChartPanel days={7} />
            <ChartPanel days={30} />

            {/* new: streaks block (current, best, last-30d bar) */}
            <StreakSummary checks={tabChecks} />

            {/* your existing KPI grid */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard title="Today" value={counters.today} />
                <StatCard title="This Week" value={counters.week} />
                <StatCard title="This Month" value={counters.month} />
                <StatCard title="This Year" value={counters.year} />
                <StatCard title="Last Check Date" value={counters.lastCheck} />
                <StatCard title="Creation Date" value={counters.createdAt} />
            </div>
        </div>
    );
}
