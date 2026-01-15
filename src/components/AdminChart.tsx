'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminChartProps {
    data: any[];
}

export default function AdminChart({ data }: AdminChartProps) {
    const COLORS = {
        solo: '#3b82f6',
        duo: '#10b981',
        quad: '#f59e0b',
        bumper: '#a855f7',
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#ffffff40"
                    tick={{ fill: '#ffffff80', fontSize: 12 }}
                />
                <YAxis
                    stroke="#ffffff40"
                    tick={{ fill: '#ffffff80', fontSize: 12 }}
                />
                <Tooltip
                    cursor={{ fill: '#ffffff10' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="bg-[#0a0a0a]/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                    <p className="text-white font-bold mb-1">{data.name}</p>
                                    <p className="text-white/70 text-sm">Sold: <span className="text-white">{data.count}</span></p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#6b7280'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
