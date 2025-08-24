import React, { useMemo, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import OverlayModal from "../components/OverlayModal.jsx";
import NoteEditor from "../components/NoteEditor.jsx";
import { toISODate } from "../lib/date";

export default function History() {
    const {
        history,
        activeTabId,
        tabs,
        setHomeCursorISO,
        toggleCheck,
        checks,
    } = useAppStore();
    const activeName = tabs.find((t) => t.id === activeTabId)?.name || "—";
    const [action, setAction] = useState(null); // {dateISO}

    const shown = useMemo(() => {
        const allowed = new Set(["checked", "unchecked", "note"]);
        return (history || []).filter(
            (ev) => ev.tabId === activeTabId && allowed.has(ev.action)
        );
    }, [history, activeTabId]);

    const tabChecks = checks[activeTabId] || {};

    return (
        <div className="space-y-3">
            <div className="card p-4">
                <div className="text-sm text-base-mut mb-2">
                    Recent Activity •{" "}
                    <span className="text-white">{activeName}</span>
                </div>
                <ul className="space-y-3">
                    {shown.map((ev) => (
                        <li key={ev.id} className="flex items-center gap-3">
                            <button
                                className="w-2 h-2 rounded-full bg-brand-600"
                                aria-hidden
                            />
                            <button
                                className="flex-1 text-left hover:underline"
                                onClick={() => setAction({ dateISO: ev.date })}
                            >
                                <div className="text-sm capitalize">
                                    {ev.action}
                                </div>
                                <div className="text-xs text-base-mut">
                                    {new Date(ev.ts).toLocaleString()} —{" "}
                                    {ev.date}
                                </div>
                            </button>
                        </li>
                    ))}
                    {!shown.length && (
                        <div className="text-base-mut text-sm">
                            No activity for this tab yet.
                        </div>
                    )}
                </ul>
            </div>

            {action && (
                <OverlayModal onClose={() => setAction(null)} center>
                    <div className="text-lg font-semibold mb-2">
                        Entry · {action.dateISO}
                    </div>
                    <div className="space-y-2">
                        <button
                            className="btn-primary w-full"
                            onClick={() => {
                                setHomeCursorISO(action.dateISO);
                                window.location.hash = "#/";
                                setAction(null);
                            }}
                        >
                            Go to this day
                        </button>
                        <button
                            className="btn w-full"
                            onClick={() => {
                                toggleCheck(action.dateISO);
                                setAction(null);
                            }}
                        >
                            Toggle check for this day
                        </button>
                        <button
                            className="btn w-full"
                            onClick={() => {
                                // open note editor for the date
                                const d = new Date(action.dateISO);
                                const v = tabChecks[action.dateISO];
                                setAction({
                                    edit: { date: d, val: v },
                                    dateISO: action.dateISO,
                                });
                            }}
                        >
                            Edit note / emoji
                        </button>
                    </div>
                    <div className="text-xs text-base-mut mt-3">
                        Tip: “Go to this day” opens Home and jumps the calendar
                        there.
                    </div>
                </OverlayModal>
            )}

            {action?.edit && (
                <NoteEditor
                    date={action.edit.date}
                    initNote={action.edit.val?.note || ""}
                    initEmoji={action.edit.val?.emoji || ""}
                    onSave={() => {}}
                    onClose={() => setAction(null)}
                />
            )}
        </div>
    );
}
