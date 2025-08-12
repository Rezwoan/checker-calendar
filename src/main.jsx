import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import "./styles.css";
import { registerSW } from "virtual:pwa-register";
import "./lib/pwaInstall"; // initialize PWA install listeners

// Deep-link import for token+gist via ?ccsync=... or #ccsync=...
(function handleDeepLinkImport() {
    try {
        const url = new URL(window.location.href);
        const fromQuery = url.searchParams.get("ccsync");
        const fromHash = url.hash.startsWith("#ccsync=")
            ? url.hash.slice("#ccsync=".length)
            : null;
        const payload = fromQuery || fromHash;
        if (!payload) return;
        const json = decodeURIComponent(escape(atob(payload)));
        const obj = JSON.parse(json);
        if (obj?.t && obj?.g) {
            localStorage.setItem("gh_token", obj.t);
            localStorage.setItem("gh_gist", obj.g);
            localStorage.setItem(
                "cc_msg",
                "Imported credentials from link. You can Download ← Gist now."
            );
        }
        const clean = new URL(
            window.location.origin + import.meta.env.BASE_URL + "settings"
        );
        window.history.replaceState({}, "", clean.toString());
    } catch {}
})();

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
