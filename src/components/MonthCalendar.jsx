import React, { useMemo, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import {
    getMonthMatrix,
    startOfToday,
    toISODate,
    isSameDay,
} from "../lib/date";
import { motion } from "framer-motion";

export default function MonthCalendar() {
    const { activeTabId, checks, toggleCheck, setNote } = useAppStore();
    const [cursor, setCursor] = useState(new Date());
    const monthMatrix = useMemo(
        () => getMonthMatrix(cursor.getFullYear(), cursor.getMonth()),
        [cursor]
    );
    const tabChecks = checks[activeTabId] || {};

    const go = (delta) => {
        const d = new Date(cursor);
        d.setMonth(d.getMonth() + delta);
        setCursor(d);
    };
    const monthLabel = cursor.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <button
                    className="btn"
                    onClick={() => go(-1)}
                    aria-label="Previous month"
                >
                    ‹
                </button>
                <div className="text-lg font-semibold">{monthLabel}</div>
                <button
                    className="btn"
                    onClick={() => go(1)}
                    aria-label="Next month"
                >
                    ›
                </button>
            </div>

            <div className="grid grid-cols-7 text-center text-[11px] text-base-mut">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* larger tap targets on phones; reduce gap so cells grow */}
            <div className="grid grid-cols-7 gap-1">
                {monthMatrix.map((d, i) => {
                    const iso = toISODate(d);
                    const isCurrentMonth = d.getMonth() === cursor.getMonth();
                    const val = tabChecks[iso];
                    const checked = !!val?.checked;
                    const today = isSameDay(d, startOfToday());
                    return (
                        <motion.button
                            key={i}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCheck(iso)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                const note = prompt(
                                    "Short note for this day (leave blank to clear):",
                                    val?.note || ""
                                );
                                if (note !== null) {
                                    const emoji = prompt(
                                        "Emoji (optional)",
                                        val?.emoji || ""
                                    );
                                    setNote(iso, note, emoji || "");
                                }
                            }}
                            className={`aspect-square rounded-xl border ${
                                isCurrentMonth ? "" : "opacity-40"
                            } ${
                                checked
                                    ? "bg-brand-600/20 border-brand-600"
                                    : "border-base-line"
                            } relative`}
                            aria-label={`Day ${d.getDate()} ${
                                checked ? "checked" : "not checked"
                            }`}
                        >
                            <div className="absolute top-1 left-1 text-[12px] text-base-mut">
                                {d.getDate()}
                            </div>
                            <div className="flex items-center justify-center h-full text-3xl md:text-4xl">
                                {checked ? "✔️" : val?.emoji || ""}
                            </div>
                            {today && (
                                <div className="absolute bottom-1 left-1 right-1 h-1 rounded-full bg-brand-600/70" />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <p className="text-sm text-base-mut">
                Tip: long-press/right-click a day to add a note or emoji.
            </p>
        </div>
    );
}
