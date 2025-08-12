import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import * as gist from "../lib/gistSync";

export default function Settings() {
    const store = useAppStore();
    const [token, setToken] = useState(localStorage.getItem("gh_token") || "");
    const [gistId, setGistId] = useState(localStorage.getItem("gh_gist") || "");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    const saveLocal = () => {
        localStorage.setItem("gh_token", token.trim());
        localStorage.setItem("gh_gist", gistId.trim());
        setMsg("Saved locally.");
    };

    const doUpload = async () => {
        try {
            setBusy(true);
            setMsg("");
            const content = JSON.stringify(store.getState(), null, 2);
            const res = await gist.upsertGist({ token, gistId, content });
            localStorage.setItem("gh_gist", res.gistId);
            setGistId(res.gistId);
            setMsg(`Uploaded → ${res.gistId}`);
        } catch (e) {
            setMsg(e.message);
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
            setMsg("Downloaded & applied.");
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
        setMsg("Imported.");
    };

    return (
        <div className="space-y-3">
            <div className="card p-4 space-y-3">
                <div className="text-lg font-semibold">Data</div>
                <div className="flex gap-2">
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
            </div>

            <div className="card p-4 space-y-3">
                <div className="text-lg font-semibold">
                    Optional GitHub Gist Sync
                </div>
                <input
                    className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                    placeholder="GitHub Personal Access Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                <input
                    className="w-full bg-neutral-900 rounded-xl px-3 py-2"
                    placeholder="Gist ID (auto-filled after first upload)"
                    value={gistId}
                    onChange={(e) => setGistId(e.target.value)}
                />
                <div className="flex gap-2">
                    <button className="btn" onClick={saveLocal}>
                        Save
                    </button>
                    <button
                        className="btn"
                        disabled={busy || !token}
                        onClick={doUpload}
                    >
                        Upload
                    </button>
                    <button
                        className="btn"
                        disabled={busy || !token || !gistId}
                        onClick={doDownload}
                    >
                        Download
                    </button>
                </div>
                <div className="text-sm text-base-mut">{msg}</div>
                <p className="text-xs text-base-mut">
                    Token is stored in your browser only.
                </p>
            </div>
        </div>
    );
}
