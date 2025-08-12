import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

export default function TabBar() {
    const {
        tabs,
        activeTabId,
        setActiveTab,
        addTab,
        renameTab,
        removeTab,
        reorderTabs,
        load,
    } = useAppStore();
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("✅");

    useEffect(() => {
        load();
    }, []); // initial load

    return (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1">
            <AnimatePresence initial={false}>
                {tabs
                    .sort((a, b) => a.order - b.order)
                    .map((t) => (
                        <motion.button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`chip flex items-center gap-2 ${
                                activeTabId === t.id
                                    ? "ring-2 ring-brand-600"
                                    : ""
                            }`}
                            whileTap={{ scale: 0.97 }}
                            layout
                        >
                            <span>{t.emoji}</span>
                            <span className="text-sm">{t.name}</span>
                        </motion.button>
                    ))}
            </AnimatePresence>

            <button
                className="chip text-base hover:bg-neutral-800"
                onClick={() => setAdding(true)}
            >
                ＋
            </button>

            {adding && (
                <div className="flex w-full gap-2 mt-2">
                    <input
                        className="flex-1 bg-neutral-900 rounded-xl px-3 py-2 outline-none"
                        placeholder="New tab name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="w-16 bg-neutral-900 rounded-xl px-3 py-2 outline-none text-center"
                        value={emoji}
                        onChange={(e) => setEmoji(e.target.value)}
                    />
                    <button
                        className="btn"
                        onClick={() => {
                            if (!name.trim()) return;
                            addTab(name.trim(), emoji || "✅");
                            setName("");
                            setEmoji("✅");
                            setAdding(false);
                        }}
                    >
                        Add
                    </button>
                    <button className="btn" onClick={() => setAdding(false)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
