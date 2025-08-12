import React from "react";
import MonthCalendar from "../components/MonthCalendar.jsx";
import { useAppStore } from "../store/useAppStore";

export default function Home() {
    const { toggleCheck } = useAppStore();
    return (
        <div className="space-y-3">
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
