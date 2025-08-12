import React from "react";
import { Link, useLocation } from "react-router-dom";

const items = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/report", label: "Report", icon: "📈" },
    { to: "/history", label: "History", icon: "🕘" },
    { to: "/tabs", label: "Tabs", icon: "🗂️" },
    { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function BottomNav() {
    const loc = useLocation();
    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-base-line bg-base-bg/90 backdrop-blur">
            <div className="mx-auto max-w-screen-sm grid grid-cols-5">
                {items.map((it) => {
                    const active = loc.pathname === it.to;
                    return (
                        <Link
                            key={it.to}
                            to={it.to}
                            className="flex flex-col items-center py-2 text-xs"
                        >
                            <div
                                className={`text-lg ${
                                    active ? "opacity-100" : "opacity-60"
                                }`}
                            >
                                {it.icon}
                            </div>
                            <div
                                className={`${
                                    active ? "text-white" : "text-base-mut"
                                }`}
                            >
                                {it.label}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
