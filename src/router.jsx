import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Report from "./pages/Report.jsx";
import History from "./pages/History.jsx";
import Tabs from "./pages/Tabs.jsx";
import Settings from "./pages/Settings.jsx";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                { index: true, element: <Home /> },
                { path: "report", element: <Report /> },
                { path: "history", element: <History /> },
                { path: "tabs", element: <Tabs /> },
                { path: "settings", element: <Settings /> },
            ],
        },
    ],
    { basename: import.meta.env.BASE_URL }
);

export default router;
