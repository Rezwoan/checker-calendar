import React from "react";

export default function Usage() {
    return (
        <div className="space-y-3">
            <div className="card p-4 space-y-2">
                <h2 className="text-lg font-semibold">How to use</h2>
                <ul className="list-disc pl-5 text-sm text-base-mut space-y-1">
                    <li>Tap a day to toggle ✓</li>
                    <li>
                        Right-click / long-press a day to add a short note or
                        emoji
                    </li>
                    <li>Press “Check / Uncheck Today” on Home</li>
                    <li>Add, rename, and delete tabs from the top row</li>
                    <li>
                        Reports show Today, Week, Month, Year counters with
                        charts
                    </li>
                    <li>
                        Settings → Export/Import JSON and optional Gist Sync
                    </li>
                </ul>
            </div>
        </div>
    );
}
