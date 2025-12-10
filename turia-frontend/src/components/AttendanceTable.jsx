import React from 'react';
import { format } from 'date-fns';

export function AttendanceTable({ data }) {
    return (
        <div className="w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800">
                        <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 dark:text-zinc-400">
                            Date
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 dark:text-zinc-400">
                            Employee
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 dark:text-zinc-400">
                            Punch In
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 dark:text-zinc-400">
                            Punch Out
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 dark:text-zinc-400">
                            Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 [&:has([role=checkbox])]:pr-0 dark:text-zinc-400">
                            Total Hours
                        </th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {data.map((record) => (
                        <tr
                            key={record.id}
                            className="border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800"
                        >
                            <td className="p-4 align-middle">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                            <td className="p-4 align-middle">{record.Employee?.name || 'Unknown'}</td>
                            <td className="p-4 align-middle">{record.punchInTime ? format(new Date(record.punchInTime), 'hh:mm a') : '-'}</td>
                            <td className="p-4 align-middle">{record.punchOutTime ? format(new Date(record.punchOutTime), 'hh:mm a') : '-'}</td>
                            <td className="p-4 align-middle">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${record.status === 'on-time' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        record.status === 'late' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    }`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className="p-4 align-middle">{record.totalHours || '-'}</td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-4 text-center text-zinc-500">No records found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
