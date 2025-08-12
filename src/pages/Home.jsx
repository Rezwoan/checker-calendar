import React from "react";
import MonthCalendar from "../components/MonthCalendar.jsx";
import { useAppStore } from "../store/useAppStore";

export default function Home() {
    const { toggleCheck } = useAppStore();
    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <button className="btn flex-1" onClick={() => toggleCheck()}>
                    Check / Uncheck Today
                </button>
            </div>
            <MonthCalendar />
        </div>
    );
}
