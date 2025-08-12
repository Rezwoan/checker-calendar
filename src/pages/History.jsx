import React from "react";
import { useAppStore } from "../store/useAppStore";

export default function History() {
    const { history } = useAppStore();
    return (
        <div className="space-y-3">
            <div className="card p-4">
                <div className="text-sm text-base-mut mb-2">
                    Recent Activity
                </div>
                <ul className="space-y-3">
                    {history.map((ev) => (
                        <li key={ev.id} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand-600" />
                            <div className="flex-1">
                                <div className="text-sm">{ev.action}</div>
                                <div className="text-xs text-base-mut">
                                    {new Date(ev.ts).toLocaleString()}
                                </div>
                            </div>
                            <div className="text-xs text-base-mut">
                                {ev.date || ""}
                            </div>
                        </li>
                    ))}
                    {!history.length && (
                        <div className="text-base-mut text-sm">
                            No history yet.
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
