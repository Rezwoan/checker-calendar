import React, { useMemo, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import {
    getMonthMatrix,
    startOfToday,
    toISODate,
    isSameDay,
} from "../lib/date";
import { motion } from "framer-motion";
import NoteEditor from "./NoteEditor.jsx";

export default function MonthCalendar() {
    const {
        activeTabId,
        checks,
        toggleCheck,
        setNote,
        clearNote,
        ui,
        setHomeCursorISO,
    } = useAppStore();
    const [cursor, setCursor] = useState(() => {
        // if navigation requested from History
        return ui?.homeCursorISO ? new Date(ui.homeCursorISO) : new Date();
    });
    const [noteFor, setNoteFor] = useState(null); // date object for modal
    const monthMatrix = useMemo(
        () => getMonthMatrix(cursor.getFullYear(), cursor.getMonth()),
        [cursor]
    );
    const tabChecks = checks[activeTabId] || {};

    const go = (delta) => {
        const d = new Date(cursor);
        d.setMonth(d.getMonth() + delta);
        setCursor(d);
        setHomeCursorISO(toISODate(d));
    };
    const monthLabel = cursor.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
    });

    // simple long-press for mobile
    const timersRef = useRef({});
    const startPress = (i, date, val) => {
        clearTimeout(timersRef.current[i]);
        timersRef.current[i] = setTimeout(() => setNoteFor({ date, val }), 350);
    };
    const cancelPress = (i) => clearTimeout(timersRef.current[i]);

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

            <div className="grid grid-cols-7 text-center text-[12px] text-base-mut">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
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
                                setNoteFor({ date: d, val });
                            }}
                            onPointerDown={() => startPress(i, d, val)}
                            onPointerUp={() => cancelPress(i)}
                            onPointerLeave={() => cancelPress(i)}
                            className={`aspect-square rounded-xl border overflow-hidden
                ${isCurrentMonth ? "" : "opacity-40"}
                ${
                    checked
                        ? "bg-brand-600/20 border-brand-600"
                        : "border-base-line"
                }`}
                            aria-label={`Day ${d.getDate()} ${
                                checked ? "checked" : "not checked"
                            }`}
                        >
                            <div className="grid grid-rows-[auto_1fr_auto] h-full w-full p-1">
                                <div className="text-[12px] sm:text-[13px] text-base-mut text-left leading-none">
                                    {d.getDate()}
                                </div>
                                <div className="flex items-center justify-center">
                                    <span className="text-[24px] sm:text-[30px] leading-none">
                                        {checked ? "✔️" : val?.emoji || ""}
                                    </span>
                                </div>
                                <div
                                    className={`h-1 rounded-full mx-1 mb-1 ${
                                        today
                                            ? "bg-brand-600/70"
                                            : "bg-transparent"
                                    }`}
                                />
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {noteFor && (
                <NoteEditor
                    date={noteFor.date}
                    initNote={noteFor.val?.note || ""}
                    initEmoji={noteFor.val?.emoji || ""}
                    onSave={(note, emoji) =>
                        setNote(toISODate(noteFor.date), note, emoji)
                    }
                    onClear={() => clearNote(toISODate(noteFor.date))}
                    onClose={() => setNoteFor(null)}
                />
            )}

            <p className="text-sm text-base-mut">
                Tip: long-press/right-click a day to add a note or emoji.
            </p>
        </div>
    );
}
