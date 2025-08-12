import React, { useMemo } from "react";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { useAppStore } from "../store/useAppStore";
import { rangeDays, startOfToday, toISODate } from "../lib/date";

export default function ChartPanel({ days = 7 }) {
    const { activeTabId, checks } = useAppStore();
    const tabChecks = checks[activeTabId] || {};
    const today = startOfToday();
    const from = new Date(today);
    from.setDate(from.getDate() - (days - 1));
    const data = useMemo(() => {
        return rangeDays(from, today).map((d) => {
            const iso = toISODate(d);
            return {
                date: iso.slice(5),
                value: tabChecks[iso]?.checked ? 1 : 0,
            };
        });
    }, [activeTabId, checks, days]);

    return (
        <div className="card p-4">
            <div className="mb-2 text-sm text-base-mut">Last {days} days</div>
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 1]} tickCount={2} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
