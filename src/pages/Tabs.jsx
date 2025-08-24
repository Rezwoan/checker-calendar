import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import OverlayModal from "../components/OverlayModal.jsx";
import EmojiPicker from "../components/EmojiPicker.jsx";

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

    // quick-add state
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("✅");
    const [showAddPicker, setShowAddPicker] = useState(false);

    // per-row emoji picker state
    const [pickerForId, setPickerForId] = useState(null);

    return (
        <div className="space-y-3">
            {/* Quick add (mobile-first) */}
            <div className="card p-4 space-y-3">
                <div className="text-lg font-semibold">Create a new tab</div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-stretch">
                    <input
                        className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                        placeholder="Tab name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    {/* Emoji chooser (button opens picker) */}
                    <button
                        type="button"
                        className="bg-neutral-900 hover:bg-neutral-800 rounded-xl px-3 py-2 flex items-center justify-center text-2xl"
                        onClick={() => setShowAddPicker(true)}
                        aria-label="Choose emoji"
                        title="Choose emoji"
                    >
                        {emoji}
                    </button>

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

            {/* Manage existing tabs */}
            <div className="card p-4">
                <div className="text-lg font-semibold mb-2">Manage tabs</div>
                <ul className="divide-y divide-base-line">
                    {ordered.map((t) => (
                        <li key={t.id} className="py-3">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                {/* Active selector + emoji button */}
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

                                    {/* Open picker for this tab */}
                                    <button
                                        type="button"
                                        className="w-24 bg-neutral-900 hover:bg-neutral-800 rounded-xl px-3 py-2 text-center text-2xl"
                                        onClick={() => setPickerForId(t.id)}
                                        aria-label="Change emoji"
                                        title="Change emoji"
                                    >
                                        {t.emoji}
                                    </button>
                                </div>

                                {/* Name input spans two cols on larger screens */}
                                <input
                                    className="w-full bg-neutral-900 rounded-xl px-3 py-2 sm:col-span-2"
                                    value={t.name}
                                    onChange={(e) =>
                                        renameTab(t.id, e.target.value)
                                    }
                                    aria-label="Tab name"
                                />

                                {/* Actions */}
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

            {/* Add-tab emoji picker modal */}
            {showAddPicker && (
                <OverlayModal onClose={() => setShowAddPicker(false)} center>
                    <div className="text-lg font-semibold mb-2">
                        Choose an emoji
                    </div>
                    <EmojiPicker
                        value={emoji}
                        onPick={(e) => {
                            setEmoji(e);
                            setShowAddPicker(false);
                        }}
                        allowNone={false}
                    />
                    <div className="mt-3 text-sm text-base-mut">
                        Tip: you can change it later from the list.
                    </div>
                </OverlayModal>
            )}

            {/* Per-tab emoji picker modal */}
            {pickerForId && (
                <OverlayModal onClose={() => setPickerForId(null)} center>
                    <div className="text-lg font-semibold mb-2">
                        Change emoji
                    </div>
                    <EmojiPicker
                        value={
                            ordered.find((x) => x.id === pickerForId)?.emoji ||
                            "✅"
                        }
                        onPick={(e) => {
                            setTabEmoji(pickerForId, e || "✅");
                            setPickerForId(null);
                        }}
                        allowNone={false}
                    />
                </OverlayModal>
            )}
        </div>
    );
}
