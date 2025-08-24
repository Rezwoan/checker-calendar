import React from "react";
import {
    normalizeTabChecks,
    currentStreak,
    bestStreak,
    lastNDaysArray,
    percent,
    countsForPeriods,
} from "../lib/stats";
import { startOfToday } from "../lib/date";

export function StreakSummary({ checks }) {
    const set = normalizeTabChecks(checks);
    const cur = currentStreak(set, startOfToday());
    const best = bestStreak(set);
    const last30 = lastNDaysArray(set, 30);
    const done = last30.filter((d) => d.checked).length;
    const pct = percent(done, last30.length);

    return (
        <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Streaks</div>
                <div className="chip">{pct}% last 30d</div>
            </div>

            <div className="flex gap-3">
                <div className="flex-1 card bg-neutral-900/40 border-base-line p-3 text-center">
                    <div className="text-xs text-base-mut">Current</div>
                    <div className="text-2xl font-semibold">{cur}</div>
                    <div className="text-xs text-base-mut">
                        day{cur === 1 ? "" : "s"}
                    </div>
                </div>
                <div className="flex-1 card bg-neutral-900/40 border-base-line p-3 text-center">
                    <div className="text-xs text-base-mut">Best</div>
                    <div className="text-2xl font-semibold">{best}</div>
                    <div className="text-xs text-base-mut">
                        day{best === 1 ? "" : "s"}
                    </div>
                </div>
            </div>

            {/* mini streak bar (last 30 days) */}
            <div className="grid grid-cols-15 gap-1">
                {last30.map(({ iso, checked }) => (
                    <div
                        key={iso}
                        className={`h-3 rounded-sm ${
                            checked ? "bg-brand-600" : "bg-neutral-800"
                        }`}
                    />
                ))}
            </div>
            <div className="text-xs text-base-mut">Last 30 days</div>
        </div>
    );
}

export function PeriodCards({ checks }) {
    const set = normalizeTabChecks(checks);
    const c = countsForPeriods(set);
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="card p-3 text-center">
                <div className="text-xs text-base-mut">Today</div>
                <div className="text-2xl font-semibold">{c.today}</div>
            </div>
            <div className="card p-3 text-center">
                <div className="text-xs text-base-mut">This Week</div>
                <div className="text-2xl font-semibold">{c.week}</div>
            </div>
            <div className="card p-3 text-center">
                <div className="text-xs text-base-mut">This Month</div>
                <div className="text-2xl font-semibold">{c.month}</div>
            </div>
            <div className="card p-3 text-center">
                <div className="text-xs text-base-mut">This Year</div>
                <div className="text-2xl font-semibold">{c.year}</div>
            </div>
        </div>
    );
}
