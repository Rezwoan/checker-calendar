import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import * as gist from "../lib/gistSync";
import { QRCodeSVG } from "qrcode.react";

export default function Settings() {
    const store = useAppStore();

    const [token, setToken] = useState(localStorage.getItem("gh_token") || "");
    const [gistId, setGistId] = useState(localStorage.getItem("gh_gist") || "");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    // QR UI
    const [showQR, setShowQR] = useState(false);
    const [scanQR, setScanQR] = useState(false);
    const scannerRef = useRef(null);
    const scannerStarted = useRef(false);

    const saveLocal = () => {
        localStorage.setItem("gh_token", token.trim());
        localStorage.setItem("gh_gist", gistId.trim());
        setMsg("Saved locally (stored only in this browser).");
    };

    const doUpload = async () => {
        try {
            setBusy(true);
            setMsg("");
            const snapshot = useAppStore.getState();
            const content = JSON.stringify(snapshot, null, 2);
            const res = await gist.upsertGist({ token, gistId, content });
            localStorage.setItem("gh_gist", res.gistId);
            setGistId(res.gistId);
            setMsg(`Uploaded to Gist • id: ${res.gistId}`);
        } catch (e) {
            setMsg("Failed to update gist: " + e.message);
        } finally {
            setBusy(false);
        }
    };

    const doDownload = async () => {
        try {
            setBusy(true);
            setMsg("");
            const content = await gist.downloadGist({ token, gistId });
            await store.importJSON(JSON.parse(content));
            setMsg("Downloaded & applied from Gist.");
        } catch (e) {
            setMsg("Failed to download: " + e.message);
        } finally {
            setBusy(false);
        }
    };

    const testToken = async () => {
        try {
            setBusy(true);
            setMsg("");
            const res = await fetch("https://api.github.com/user", {
                headers: { Authorization: `token ${token}` },
            });
            if (!res.ok)
                throw new Error("Token failed (check scope or value).");
            const u = await res.json();
            setMsg(`Token OK • @${u.login}`);
        } catch (e) {
            setMsg(e.message);
        } finally {
            setBusy(false);
        }
    };

    const onImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        await store.importJSON(JSON.parse(text));
        setMsg("Imported from file.");
    };

    // ----- QR share/scan helpers -----
    // Encode token+gistId in a compact safe string
    const makeQRPayload = () => {
        const obj = { t: token.trim(), g: gistId.trim(), v: 1 };
        return (
            "checker-sync:" +
            btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
        );
    };

    // Decode from scanned string
    const parseQRPayload = (str) => {
        if (!str?.startsWith("checker-sync:"))
            throw new Error("Not a Checker code");
        const b64 = str.slice("checker-sync:".length);
        const json = decodeURIComponent(escape(atob(b64)));
        const obj = JSON.parse(json);
        if (!obj.t || !obj.g) throw new Error("Missing fields");
        return { token: obj.t, gistId: obj.g };
    };

    // Start camera scanner when modal opens
    useEffect(() => {
        let html5QrCode = null;
        let mounted = true;

        async function startScanner() {
            if (!scanQR || scannerStarted.current) return;
            scannerStarted.current = true;
            const { Html5Qrcode } = await import("html5-qrcode");
            if (!mounted) return;
            html5QrCode = new Html5Qrcode("qr-reader", { verbose: false });
            try {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: 240 },
                    (decoded) => {
                        try {
                            const { token: t, gistId: g } =
                                parseQRPayload(decoded);
                            setToken(t);
                            setGistId(g);
                            setMsg(
                                "Scanned. Click Save, then you can Download ← Gist."
                            );
                            setScanQR(false);
                        } catch (err) {
                            setMsg("Invalid QR: " + err.message);
                        }
                    }
                );
            } catch (e) {
                setMsg("Camera error: " + e.message);
            }
        }

        if (scanQR) startScanner();

        return () => {
            mounted = false;
            if (html5QrCode) {
                html5QrCode
                    .stop()
                    .catch(() => {})
                    .finally(() => html5QrCode.clear());
            }
            scannerStarted.current = false;
        };
    }, [scanQR]);

    return (
        <div className="space-y-3">
            {/* Data export/import */}
            <div className="card p-4 space-y-3">
                <div className="text-lg font-semibold">Data</div>
                <div className="flex gap-2 flex-wrap">
                    <button className="btn" onClick={() => store.exportJSON()}>
                        Export JSON
                    </button>
                    <label className="btn cursor-pointer">
                        Import JSON
                        <input
                            type="file"
                            accept="application/json"
                            className="hidden"
                            onChange={onImport}
                        />
                    </label>
                </div>
                <p className="text-xs text-base-mut">
                    Your data lives locally in this browser (IndexedDB). Export
                    regularly if you want backups.
                </p>
            </div>

            {/* Gist sync */}
            <div className="card p-4 space-y-3">
                <div className="text-lg font-semibold">
                    Optional GitHub Gist Sync
                </div>

                <div className="space-y-2">
                    <input
                        className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                        placeholder="GitHub Personal Access Token (gist scope)"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <input
                        className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                        placeholder="Gist ID (leave blank on first upload)"
                        value={gistId}
                        onChange={(e) => setGistId(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button className="btn" onClick={saveLocal}>
                        Save
                    </button>
                    <button
                        className="btn"
                        disabled={busy || !token}
                        onClick={testToken}
                    >
                        Test Token
                    </button>
                    <button
                        className="btn"
                        disabled={busy || !token}
                        onClick={doUpload}
                    >
                        Upload → Gist
                    </button>
                    <button
                        className="btn"
                        disabled={busy || !token || !gistId}
                        onClick={doDownload}
                    >
                        Download ← Gist
                    </button>
                    {/* QR actions */}
                    <button
                        className="btn"
                        disabled={!token || !gistId}
                        onClick={() => setShowQR(true)}
                    >
                        Show QR
                    </button>
                    <button className="btn" onClick={() => setScanQR(true)}>
                        Scan QR
                    </button>
                </div>

                <div className="text-sm text-base-mut">{msg}</div>
                <p className="text-xs text-base-mut">
                    Token & Gist ID are saved only in this browser
                    (localStorage). We only talk to GitHub when you press
                    Upload/Download.
                </p>

                {/* Instructions */}
                <div className="mt-3">
                    <details className="open:bg-neutral-900/50 rounded-xl p-3 border border-base-line">
                        <summary className="cursor-pointer text-sm font-medium">
                            How to create a GitHub token (for Gist sync)
                        </summary>
                        <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-base-mut">
                            <li>Sign in to GitHub.</li>
                            <li>
                                Open{" "}
                                <a
                                    className="underline"
                                    href="https://github.com/settings/tokens"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Settings → Developer settings → Personal
                                    access tokens
                                </a>
                                .
                            </li>
                            <li>
                                Choose <strong>Tokens (classic)</strong> →{" "}
                                <strong>Generate new token (classic)</strong>.
                            </li>
                            <li>
                                Name it (e.g., <em>Checker Calendar Gist</em>)
                                and set an expiration.
                            </li>
                            <li>
                                Enable only the <strong>gist</strong> scope.
                            </li>
                            <li>
                                Generate and copy the token (you’ll see it only
                                once).
                            </li>
                            <li>
                                Paste it above → Save → (optional) Test Token.
                            </li>
                            <li>
                                Click <strong>Upload → Gist</strong> (first time
                                leaves Gist ID empty; it will auto-fill).
                            </li>
                            <li>
                                On your phone: open Settings →{" "}
                                <strong>Scan QR</strong> to auto-fill, then{" "}
                                <strong>Save</strong> and{" "}
                                <strong>Download ← Gist</strong>.
                            </li>
                        </ol>
                        <p className="text-xs mt-2">
                            Security tip: Treat your token like a password. Only
                            show the QR to devices you trust.
                        </p>
                    </details>
                </div>
            </div>

            {/* ---- QR MODALS ---- */}
            {showQR && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setShowQR(false)}
                >
                    <div
                        className="card p-4 w-full max-w-xs text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-sm mb-2 text-base-mut">
                            Scan on your other device
                        </div>
                        <div className="bg-white rounded-xl p-3">
                            <QRCodeSVG value={makeQRPayload()} size={220} />
                        </div>
                        <div className="text-xs text-base-mut mt-2">
                            Contains your token + gist ID (v1).
                        </div>
                        <button
                            className="btn w-full mt-3"
                            onClick={() => setShowQR(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {scanQR && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setScanQR(false)}
                >
                    <div
                        className="card p-2 w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-sm mb-2 text-center text-base-mut">
                            Point camera at the QR
                        </div>
                        <div
                            id="qr-reader"
                            ref={scannerRef}
                            className="overflow-hidden rounded-xl bg-black"
                            style={{ height: 280 }}
                        />
                        <button
                            className="btn w-full mt-3"
                            onClick={() => setScanQR(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
