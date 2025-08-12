import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";

export default function Tabs() {
    const {
        tabs,
        activeTabId,
        setActiveTab,
        renameTab,
        setTabEmoji,
        removeTab,
        moveTabUp,
        moveTabDown,
        addTab,
    } = useAppStore();

    const ordered = [...tabs].sort((a, b) => a.order - b.order);
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("✅");

    return (
        <div className="space-y-3">
            {/* Quick add (stacked on mobile) */}
            <div className="card p-4 space-y-3">
                <div className="text-lg font-semibold">Create a new tab</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                        className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                        placeholder="Tab name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-full sm:w-24 bg-neutral-900 rounded-xl px-3 py-2 text-center"
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                    />
                    <div className="sm:col-span-2 flex items-center">
                        <button
                            className="btn-primary w-full"
                            onClick={() => {
                                if (!name.trim()) return;
                                addTab(name.trim(), emoji || "✅");
                                setName("");
                                setEmoji("✅");
                            }}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Manage list (responsive rows) */}
            <div className="card p-4">
                <div className="text-lg font-semibold mb-2">Manage tabs</div>
                <ul className="divide-y divide-base-line">
                    {ordered.map((t) => (
                        <li key={t.id} className="py-3">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                {/* Active selector / emoji block */}
                                <div className="flex gap-2 items-center">
                                    <button
                                        className={`px-3 py-2 rounded-lg border ${
                                            activeTabId === t.id
                                                ? "bg-brand-600/20 border-brand-600"
                                                : "border-base-line"
                                        }`}
                                        onClick={() => setActiveTab(t.id)}
                                        title="Set active"
                                    >
                                        <span className="text-lg">
                                            {t.emoji}
                                        </span>
                                    </button>
                                    <input
                                        className="w-24 bg-neutral-900 rounded-xl px-3 py-2 text-center"
                                        value={t.emoji}
                                        onChange={(e) =>
                                            setTabEmoji(t.id, e.target.value)
                                        }
                                        aria-label="Emoji"
                                    />
                                </div>

                                {/* Name input (full width on mobile) */}
                                <input
                                    className="w-full bg-neutral-900 rounded-xl px-3 py-2 sm:col-span-2"
                                    value={t.name}
                                    onChange={(e) =>
                                        renameTab(t.id, e.target.value)
                                    }
                                    aria-label="Tab name"
                                />

                                {/* Actions - wrap on small screens */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className="btn px-3 py-2"
                                        onClick={() => moveTabUp(t.id)}
                                        title="Move up"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        className="btn px-3 py-2"
                                        onClick={() => moveTabDown(t.id)}
                                        title="Move down"
                                    >
                                        ▼
                                    </button>
                                    <button
                                        className="btn px-3 py-2"
                                        onClick={() => removeTab(t.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {!ordered.length && (
                        <div className="text-sm text-base-mut py-2">
                            No tabs yet.
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
}
