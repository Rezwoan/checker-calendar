import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import BottomNav from "./components/BottomNav.jsx";
import TabBar from "./components/TabBar.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
    const loc = useLocation();
    return (
        <div className="mx-auto max-w-screen-sm min-h-dvh flex flex-col">
            <header className="sticky top-0 z-20 bg-base-bg/80 backdrop-blur border-b border-base-line">
                <div className="px-4 py-3 flex items-center gap-3">
                    <span className="text-lg font-semibold">Checker</span>
                    <div className="ml-auto text-sm text-base-mut">
                        <Link to="/settings" className="hover:text-white">
                            Settings
                        </Link>
                    </div>
                </div>
                <div className="px-2 pb-2">
                    <TabBar />
                </div>
            </header>

            <main className="flex-1 px-3 pb-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={loc.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <BottomNav />
        </div>
    );
}
