import React from 'react';

export function Card({ children, className = '' }) {
    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
    return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
    return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
