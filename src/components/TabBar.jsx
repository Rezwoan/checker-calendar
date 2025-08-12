import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

export default function TabBar() {
    const { tabs, activeTabId, setActiveTab, addTab, load } = useAppStore();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("✅");

    useEffect(() => {
        load();
    }, []);

    const sorted = [...tabs].sort((a, b) => a.order - b.order);

    return (
        <>
            <div className="relative">
                {/* subtle edge fades */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-base-bg to-transparent"></div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-base-bg to-transparent"></div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-snap-x p-1">
                    <AnimatePresence initial={false}>
                        {sorted.map((t) => (
                            <motion.button
                                key={t.id}
                                onClick={() => setActiveTab(t.id)}
                                className={`chip flex items-center gap-2 snap-start ${
                                    activeTabId === t.id
                                        ? "ring-2 ring-brand-600"
                                        : ""
                                }`}
                                whileTap={{ scale: 0.98 }}
                                layout
                            >
                                <span className="text-base">{t.emoji}</span>
                                <span className="text-sm">{t.name}</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>

                    <button
                        className="chip text-base hover:bg-neutral-800"
                        onClick={() => setOpen(true)}
                        title="Add tab"
                    >
                        ＋
                    </button>
                </div>
            </div>

            {/* Add Tab Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="card w-full sm:max-w-sm p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-lg font-semibold mb-2">
                            Add Tab
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-base-mut block">
                                Name
                            </label>
                            <input
                                className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                                placeholder="e.g., Gym"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label className="text-sm text-base-mut block mt-2">
                                Emoji
                            </label>
                            <input
                                className="w-24 bg-neutral-900 rounded-xl px-3 py-2 text-center"
                                value={emoji}
                                onChange={(e) => setEmoji(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                className="btn-primary flex-1"
                                onClick={() => {
                                    if (!name.trim()) return;
                                    addTab(name.trim(), emoji || "✅");
                                    setName("");
                                    setEmoji("✅");
                                    setOpen(false);
                                }}
                            >
                                Save
                            </button>
                            <button
                                className="btn flex-1"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
