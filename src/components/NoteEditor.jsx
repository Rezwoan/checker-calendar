import React, { useState } from "react";
import OverlayModal from "./OverlayModal.jsx";
import EmojiPicker from "./EmojiPicker.jsx";
import { toISODate } from "../lib/date";

export default function NoteEditor({
    date,
    initNote = "",
    initEmoji = "",
    onSave,
    onClear,
    onClose,
}) {
    const [note, setNote] = useState(initNote);
    const [emoji, setEmoji] = useState(initEmoji);

    return (
        <OverlayModal onClose={onClose} center={false}>
            <div className="text-lg font-semibold mb-2">Edit Note</div>
            <div className="text-xs text-base-mut mb-3">{toISODate(date)}</div>

            <textarea
                className="w-full min-h-[84px] bg-neutral-900 rounded-xl px-3 py-2"
                placeholder="Short note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <div className="mt-3">
                <div className="text-sm text-base-mut mb-1">Emoji</div>
                <EmojiPicker
                    value={emoji}
                    onPick={setEmoji}
                    allowNone
                    compact
                />
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    className="btn-primary flex-1"
                    onClick={() => {
                        onSave(note.trim(), emoji || "");
                        onClose();
                    }}
                >
                    Save
                </button>
                <button className="btn flex-1" onClick={onClose}>
                    Cancel
                </button>
            </div>

            {!!(initNote || initEmoji) && (
                <button
                    className="btn w-full mt-2"
                    onClick={() => {
                        onClear?.();
                        onClose();
                    }}
                >
                    Clear note
                </button>
            )}
        </OverlayModal>
    );
}
