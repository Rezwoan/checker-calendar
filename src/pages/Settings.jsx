import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import * as gist from "../lib/gistSync";
import { QRCodeSVG } from "qrcode.react";
import {
    getState as getPWAState,
    subscribe as onPWAChange,
    promptInstall,
} from "../lib/pwaInstall";

export default function Settings() {
    const store = useAppStore();

    // ---------- PWA install state ----------
    const [pwa, setPwa] = useState(getPWAState());
    const isDev = import.meta.env.DEV;
    useEffect(() => onPWAChange(setPwa), []);

    // ---------- Gist sync state ----------
    const [token, setToken] = useState(localStorage.getItem("gh_token") || "");
    const [gistId, setGistId] = useState(localStorage.getItem("gh_gist") || "");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState(localStorage.getItem("cc_msg") || "");
    useEffect(() => {
        if (msg) localStorage.removeItem("cc_msg");
    }, [msg]);

    // ---------- Auto Sync ----------
    const [autoSync, setAutoSync] = useState(
        localStorage.getItem("cc_auto_sync") === "1"
    );
    const [intervalMin, setIntervalMin] = useState(
        Number(localStorage.getItem("cc_auto_interval") || 15)
    );
    const autoTimer = useRef(null);
    useEffect(() => {
        if (autoTimer.current) {
            clearInterval(autoTimer.current);
            autoTimer.current = null;
        }
        if (autoSync && token && gistId) {
            const run = async () => {
                try {
                    const snapshot = useAppStore.getState();
                    const content = JSON.stringify(snapshot, null, 2);
                    await gist.upsertGist({ token, gistId, content });
                    setMsg("Auto-sync: uploaded.");
                } catch (e) {
                    setMsg("Auto-sync failed: " + e.message);
                }
            };
            run();
            autoTimer.current = setInterval(
                run,
                Math.max(1, intervalMin) * 60_000
            );
        }
        return () => autoTimer.current && clearInterval(autoTimer.current);
    }, [autoSync, intervalMin, token, gistId]);
    const toggleAuto = (x) => {
        setAutoSync(x);
        localStorage.setItem("cc_auto_sync", x ? "1" : "0");
    };
    const saveInterval = (v) => {
        const n = Math.max(1, Number(v) || 15);
        setIntervalMin(n);
        localStorage.setItem("cc_auto_interval", String(n));
    };

    // ---------- Share link / QR (already in your project) ----------
    const makePayloadJSON = () =>
        JSON.stringify({ t: token.trim(), g: gistId.trim(), v: 1 });
    const makeBase64 = (json) => btoa(unescape(encodeURIComponent(json)));
    const makeShareLink = () => {
        const base = window.location.origin + import.meta.env.BASE_URL;
        const url = new URL(base);
        url.searchParams.set("ccsync", makeBase64(makePayloadJSON()));
        return url.toString();
    };

    // ---------- Gist actions ----------
    const saveLocal = () => {
        localStorage.setItem("gh_token", token.trim());
        localStorage.setItem("gh_gist", gistId.trim());
        setMsg("Saved locally (this browser only).");
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

    return (
        <div className="space-y-3">
            {/* Install App */}
            <div className="card p-4 space-y-3">
                <div className="text-lg font-semibold">Install App</div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        className="btn"
                        disabled={!pwa.canInstall || pwa.installed}
                        onClick={async () => {
                            try {
                                const { outcome } = await promptInstall();
                                setMsg(
                                    outcome === "accepted"
                                        ? "Installation started."
                                        : "Install dismissed."
                                );
                            } catch {
                                setMsg(
                                    "Install prompt not available right now."
                                );
                            }
                        }}
                    >
                        {pwa.installed
                            ? "Installed"
                            : pwa.canInstall
                            ? "Install"
                            : "Install (unavailable)"}
                    </button>

                    {/* Fixed: open the app start URL in this tab (no about:blank) */}
                    <button
                        className="btn"
                        onClick={() => {
                            const start = import.meta.env.BASE_URL || "./";
                            window.location.assign(start); // same tab, just (re)open the app
                        }}
                    >
                        Open in this window
                    </button>
                </div>

                <div className="text-xs text-base-mut">
                    {pwa.canInstall
                        ? "Install prompt is available."
                        : isDev
                        ? "Tip: We enabled PWA in dev. Hard-reload or open a fresh tab if you still don’t see the prompt."
                        : "On iOS Safari, use Share → “Add to Home Screen”. On desktop Chrome/Edge, click the Install icon in the address bar."}
                </div>
            </div>

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
                            onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const text = await f.text();
                                await store.importJSON(JSON.parse(text));
                                setMsg("Imported from file.");
                            }}
                        />
                    </label>
                </div>
                <p className="text-xs text-base-mut">
                    Data lives locally (IndexedDB). Export regularly for
                    backups.
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
                    <button
                        className="btn"
                        disabled={!token || !gistId}
                        onClick={async () => {
                            const link = makeShareLink();
                            try {
                                await navigator.clipboard.writeText(link);
                                setMsg("Share link copied.");
                            } catch {
                                setMsg(link);
                            }
                        }}
                    >
                        Copy Share Link
                    </button>
                </div>

                {/* Auto-sync controls */}
                <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            className="accent-white"
                            checked={autoSync}
                            onChange={(e) => toggleAuto(e.target.checked)}
                        />
                        Enable Auto Sync (upload)
                    </label>
                    <div className="flex items-center gap-2 text-sm">
                        every
                        <input
                            type="number"
                            min="1"
                            className="w-16 bg-neutral-900 rounded px-2 py-1"
                            value={intervalMin}
                            onChange={(e) => saveInterval(e.target.value)}
                        />
                        min
                    </div>
                </div>

                <div className="text-sm text-base-mut">{msg}</div>
            </div>
        </div>
    );
}
