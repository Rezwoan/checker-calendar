import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function OverlayModal({ children, onClose, center = true }) {
    // lock scroll
    useEffect(() => {
        const y = window.scrollY;
        const b = document.body.style;
        const h = document.documentElement.style;
        const prevB = {
            position: b.position,
            top: b.top,
            overflowY: b.overflowY,
            width: b.width,
        };
        const prevH = { overflowY: h.overflowY };
        b.position = "fixed";
        b.top = `-${y}px`;
        b.width = "100%";
        b.overflowY = "scroll";
        h.overflowY = "hidden";
        return () => {
            b.position = prevB.position;
            b.top = prevB.top;
            b.overflowY = prevB.overflowY;
            b.width = prevB.width;
            h.overflowY = prevH.overflowY;
            window.scrollTo(0, y);
        };
    }, []);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[1000]">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div
                className={`absolute inset-0 p-4 ${
                    center
                        ? "flex items-center justify-center"
                        : "flex items-end justify-center"
                }`}
                onClick={onClose}
            >
                <div
                    className={`card w-[92vw] max-w-sm max-h-[90svh] overflow-auto rounded-2xl p-4 ${
                        center ? "" : "rounded-b-0"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
