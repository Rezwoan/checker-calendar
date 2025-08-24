import React from "react";
import MonthCalendar from "../components/MonthCalendar.jsx";
import { useAppStore } from "../store/useAppStore";
import { StreakSummary } from "../components/Streaks.jsx";

export default function Home() {
    const { toggleCheck, activeTabId, checks } = useAppStore();
    const tabChecks = checks[activeTabId] || {};

    return (
        <div className="space-y-3">
            <StreakSummary checks={tabChecks} />

            <button
                className="btn-primary w-full"
                onClick={() => toggleCheck()}
            >
                Check / Uncheck Today
            </button>

            <MonthCalendar />
        </div>
    );
}
