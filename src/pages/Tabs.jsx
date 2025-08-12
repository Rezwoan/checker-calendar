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

    // quick-add inline (not in the tab bar)
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("✅");

    return (
        <div className="space-y-3">
            <div className="card p-4 space-y-3">
                <div className="text-lg font-semibold">Create a new tab</div>
                <div className="flex gap-2 items-center">
                    <input
                        className="flex-1 bg-neutral-900 rounded-xl px-3 py-2"
                        placeholder="Tab name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-20 bg-neutral-900 rounded-xl px-3 py-2 text-center"
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                    />
                    <button
                        className="btn-primary"
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

            <div className="card p-4">
                <div className="text-lg font-semibold mb-2">Manage tabs</div>
                <ul className="divide-y divide-base-line">
                    {ordered.map((t, idx) => (
                        <li key={t.id} className="flex items-center gap-2 py-3">
                            <button
                                className={`px-2 py-1 rounded-lg ${
                                    activeTabId === t.id
                                        ? "bg-brand-600/20 border border-brand-600"
                                        : ""
                                }`}
                                onClick={() => setActiveTab(t.id)}
                                title="Set active"
                            >
                                {t.emoji}
                            </button>
                            <input
                                className="w-24 bg-neutral-900 rounded-xl px-3 py-2 text-center"
                                value={t.emoji}
                                onChange={(e) =>
                                    setTabEmoji(t.id, e.target.value)
                                }
                            />
                            <input
                                className="flex-1 bg-neutral-900 rounded-xl px-3 py-2"
                                value={t.name}
                                onChange={(e) =>
                                    renameTab(t.id, e.target.value)
                                }
                            />
                            <div className="flex items-center gap-1">
                                <button
                                    className="btn"
                                    onClick={() => moveTabUp(t.id)}
                                    title="Move up"
                                >
                                    ▲
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => moveTabDown(t.id)}
                                    title="Move down"
                                >
                                    ▼
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => removeTab(t.id)}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
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
