import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Report from "./pages/Report.jsx";
import History from "./pages/History.jsx";
import Usage from "./pages/Usage.jsx";
import Settings from "./pages/Settings.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "report", element: <Report /> },
            { path: "history", element: <History /> },
            { path: "usage", element: <Usage /> },
            { path: "settings", element: <Settings /> },
        ],
    },
]);

export default router;
