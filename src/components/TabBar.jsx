import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "../store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "./EmojiPicker.jsx";

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
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-base-bg to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-base-bg to-transparent" />

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

            {open && (
                <AddTabModal
                    name={name}
                    emoji={emoji}
                    setName={setName}
                    setEmoji={setEmoji}
                    onSave={(nm, em) => {
                        if (!nm.trim()) return;
                        addTab(nm.trim(), em || "✅");
                        setName("");
                        setEmoji("✅");
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}

/* ---------- Modal (portaled) ---------- */
function AddTabModal({ name, emoji, setName, setEmoji, onSave, onClose }) {
    useEffect(() => {
        const y = window.scrollY;
        const b = document.body.style;
        const h = document.documentElement.style;
        const pb = {
            position: b.position,
            top: b.top,
            overflowY: b.overflowY,
            width: b.width,
        };
        const ph = { overflowY: h.overflowY };
        b.position = "fixed";
        b.top = `-${y}px`;
        b.overflowY = "scroll";
        b.width = "100%";
        h.overflowY = "hidden";
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            b.position = pb.position;
            b.top = pb.top;
            b.overflowY = pb.overflowY;
            b.width = pb.width;
            h.overflowY = ph.overflowY;
            window.removeEventListener("keydown", onKey);
            window.scrollTo(0, y);
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[1000]">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div
                className="absolute inset-0 p-4 flex items-center justify-center"
                onClick={onClose}
            >
                <div
                    className="card w-[92vw] max-w-sm max-h-[90svh] overflow-auto rounded-2xl p-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-lg font-semibold mb-3">Add Tab</div>

                    <div className="space-y-3">
                        <label className="text-sm text-base-mut block">
                            Name
                        </label>
                        <input
                            className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                            placeholder="e.g., Gym"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <div className="text-sm text-base-mut mt-2 mb-1">
                            Emoji
                        </div>
                        <EmojiPicker
                            value={emoji}
                            onPick={setEmoji}
                            allowNone={false}
                            compact
                        />
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            className="btn-primary flex-1"
                            onClick={() => onSave(name, emoji)}
                        >
                            Save
                        </button>
                        <button className="btn flex-1" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
