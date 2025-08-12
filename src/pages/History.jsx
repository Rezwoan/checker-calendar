import React, { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";

export default function History() {
    const { history, activeTabId, tabs } = useAppStore();
    const activeName = tabs.find((t) => t.id === activeTabId)?.name || "—";

    // Only show per-day actions for the currently active tab
    const shown = useMemo(() => {
        const allowed = new Set(["checked", "unchecked", "note"]);
        return (history || []).filter(
            (ev) => ev.tabId === activeTabId && allowed.has(ev.action)
        );
    }, [history, activeTabId]);

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
                            <div className="w-2 h-2 rounded-full bg-brand-600" />
                            <div className="flex-1">
                                <div className="text-sm capitalize">
                                    {ev.action}
                                </div>
                                <div className="text-xs text-base-mut">
                                    {new Date(ev.ts).toLocaleString()}
                                </div>
                            </div>
                            <div className="text-xs text-base-mut">
                                {ev.date || ""}
                            </div>
                        </li>
                    ))}
                    {!shown.length && (
                        <div className="text-base-mut text-sm">
                            No activity for this tab yet.
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
