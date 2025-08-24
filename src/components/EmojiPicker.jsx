import React, { useMemo, useState, useEffect } from "react";

const COMMON = [
    // Health & workout
    "✅",
    "🏋️",
    "💪",
    "🚶",
    "🏃",
    "🧘",
    "🚴",
    "🥇",
    "⏱️",
    "🩺",
    // Study & focus
    "📚",
    "📝",
    "⌛",
    "🎯",
    "🧠",
    "💻",
    "🧪",
    // Food / habits
    "🍎",
    "🥗",
    "🍳",
    "🍗",
    "🍞",
    "☕",
    "💧",
    "🍽️",
    // Mood
    "😀",
    "🙂",
    "😐",
    "😕",
    "😴",
    "😌",
    "🔥",
    "🌟",
    // Misc
    "📅",
    "🛏️",
    "🧹",
    "🛒",
    "🧺",
    "🧼",
    "📈",
];

const recentKey = "cc_recent_emojis";

export default function EmojiPicker({
    value,
    onPick,
    allowNone = true,
    compact = false,
}) {
    const [recent, setRecent] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        try {
            const raw = localStorage.getItem(recentKey);
            if (raw) setRecent(JSON.parse(raw));
        } catch {}
    }, []);

    const pick = (e) => {
        const emoji = e.currentTarget.dataset.emoji;
        if (!emoji && allowNone) return onPick("");
        onPick(emoji);
        try {
            const next = [emoji, ...recent.filter((x) => x !== emoji)].slice(
                0,
                16
            );
            setRecent(next);
            localStorage.setItem(recentKey, JSON.stringify(next));
        } catch {}
    };

    const filtered = useMemo(() => {
        if (!query.trim()) return COMMON;
        // simple filter: if query matches emoji name set (tiny static list)
        const map = {
            check: "✅",
            tick: "✅",
            yes: "✅",
            gym: "🏋️",
            lift: "🏋️",
            workout: "🏋️",
            run: "🏃",
            walk: "🚶",
            study: "📚",
            read: "📚",
            note: "📝",
            coffee: "☕",
            water: "💧",
            bike: "🚴",
            sleep: "🛏️",
            meditate: "🧘",
            code: "💻",
        };
        const hit = Object.entries(map)
            .filter(([k]) => k.includes(query.toLowerCase()))
            .map(([, v]) => v);
        return Array.from(new Set([...hit, ...COMMON]));
    }, [query]);

    return (
        <div className="space-y-2">
            {!compact && (
                <input
                    className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                    placeholder="Search (e.g., gym, study, water)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            )}

            {!!recent.length && (
                <div>
                    <div className="text-xs text-base-mut mb-1">Recent</div>
                    <div className="grid grid-cols-8 gap-2">
                        {recent.map((e) => (
                            <button
                                key={"r" + e}
                                data-emoji={e}
                                onClick={pick}
                                className={`aspect-square rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xl ${
                                    value === e ? "ring-2 ring-brand-600" : ""
                                }`}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="text-xs text-base-mut mb-1">Common</div>
            <div
                className={`grid ${
                    compact ? "grid-cols-8" : "grid-cols-8"
                } gap-2`}
            >
                {allowNone && (
                    <button
                        onClick={() => onPick("")}
                        className={`aspect-square rounded-lg border border-base-line text-xs ${
                            value === "" ? "ring-2 ring-brand-600" : ""
                        }`}
                    >
                        none
                    </button>
                )}
                {filtered.map((e) => (
                    <button
                        key={e}
                        data-emoji={e}
                        onClick={pick}
                        className={`aspect-square rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xl ${
                            value === e ? "ring-2 ring-brand-600" : ""
                        }`}
                    >
                        {e}
                    </button>
                ))}
            </div>
        </div>
    );
}
