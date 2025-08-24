import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import OverlayModal from "./OverlayModal.jsx";

/**
 * QrScanner
 * - Works on localhost (allowed by browsers) and HTTPS (required on cPanel).
 * - Prefers rear camera; provides a "Switch camera" button if multiple cameras exist.
 * - Uses a rectangular qrbox to match "barcode-like" scanners.
 */
export default function QrScanner({ open, onClose, onResult }) {
    const regionId = useRef(`scan_${Math.random().toString(36).slice(2)}`);
    const h5 = useRef(null);
    const [cams, setCams] = useState([]);
    const [idx, setIdx] = useState(0);
    const [err, setErr] = useState("");

    useEffect(() => {
        if (!open) return;

        let mounted = true;

        async function setup() {
            try {
                const devices = await Html5Qrcode.getCameras();
                if (!mounted) return;
                setCams(devices || []);
                // choose back camera by label if possible
                let startId = devices?.[0]?.id || undefined;
                const back = devices?.find((d) =>
                    /back|rear|environment/i.test(d.label)
                );
                if (back) startId = back.id;
                await startWithDevice(startId);
            } catch (e) {
                setErr(
                    e?.message || "Camera not available. Use HTTPS on mobile."
                );
            }
        }

        setup();

        return () => {
            mounted = false;
            stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    async function startWithDevice(deviceId) {
        stop();
        h5.current = new Html5Qrcode(regionId.current, { verbose: false });

        // compute a rectangular qrbox based on viewport width
        const width = Math.min(
            480,
            Math.max(240, Math.floor(window.innerWidth * 0.9))
        );
        const height = Math.round(width / 2.2); // rectangle
        const config = {
            fps: 10,
            aspectRatio: 1.777, // 16:9
            qrbox: { width, height },
        };

        try {
            await h5.current.start(
                deviceId
                    ? { deviceId: { exact: deviceId } }
                    : { facingMode: "environment" },
                config,
                (decodedText) => {
                    // debounce duplicate reads
                    stop().finally(() => onResult?.(decodedText));
                },
                () => {}
            );
            setErr("");
        } catch (e) {
            setErr(e?.message || "Failed to start camera");
        }
    }

    function stop() {
        if (h5.current) {
            const inst = h5.current;
            h5.current = null;
            if (inst.isScanning) return inst.stop().then(() => inst.clear());
            return Promise.resolve();
        }
        return Promise.resolve();
    }

    async function switchCam() {
        if (!cams.length) return;
        const next = (idx + 1) % cams.length;
        setIdx(next);
        await startWithDevice(cams[next].id);
    }

    if (!open) return null;

    return (
        <OverlayModal onClose={onClose} center>
            <div className="text-lg font-semibold mb-2">Scan Share Code</div>
            <div className="text-xs text-base-mut mb-3">
                Tip: On mobile devices, camera access needs HTTPS (your cPanel
                domain is fine; localhost also works).
            </div>

            <div
                id={regionId.current}
                className="rounded-xl overflow-hidden border border-base-line bg-black"
            />

            {!!err && <div className="text-xs text-red-400 mt-2">{err}</div>}

            <div className="flex gap-2 mt-3">
                <button
                    className="btn flex-1"
                    onClick={switchCam}
                    disabled={!cams.length || cams.length < 2}
                >
                    {cams.length < 2 ? "No other camera" : "Switch camera"}
                </button>
                <button className="btn flex-1" onClick={onClose}>
                    Close
                </button>
            </div>
        </OverlayModal>
    );
}
