import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export function StatsCard({ title, value, icon: Icon, description }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
