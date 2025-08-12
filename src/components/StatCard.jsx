import React from "react";

export default function StatCard({ title, value, sub }) {
    return (
        <div className="card p-4">
            <div className="text-sm text-base-mut">{title}</div>
            <div className="text-3xl font-semibold mt-1">{value}</div>
            {sub && <div className="text-xs text-base-mut mt-1">{sub}</div>}
        </div>
    );
}
