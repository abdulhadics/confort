"use client"

import { useMemo } from "react"
import { useCalls } from "@/hooks/use-calls"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from "recharts"
import { startOfDay, subDays, format, isSameDay, parseISO } from "date-fns"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DashboardCharts() {
    const { calls, isLoading } = useCalls()

    // 1. Call Volume (Last 7 Days)
    const volumeData = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = subDays(new Date(), 6 - i);
            return {
                date: d,
                label: format(d, 'MMM dd'),
                count: 0
            };
        });

        calls.forEach(call => {
            if (!call.created_at) return;
            const callDate = new Date(call.created_at);
            const dayStat = last7Days.find(d => isSameDay(d.date, callDate));
            if (dayStat) {
                dayStat.count++;
            }
        });

        return last7Days;
    }, [calls]);

    // 2. Call Type Distribution (Status)
    const typeData = useMemo(() => {
        const counts: Record<string, number> = {};
        calls.forEach(call => {
            const status = call.status || 'Unknown';
            counts[status] = (counts[status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [calls]);

    // 3. Lead Score Distribution
    const scoreData = useMemo(() => {
        const distribution = [
            { name: 'Low (0-39)', count: 0, fill: '#ef4444' }, // Red
            { name: 'Medium (40-69)', count: 0, fill: '#eab308' }, // Yellow
            { name: 'Gold (70-100)', count: 0, fill: '#22c55e' }, // Green
        ];

        calls.forEach(call => {
            const score = call.lead_score || 0;
            if (score >= 70) distribution[2].count++;
            else if (score >= 40) distribution[1].count++;
            else distribution[0].count++;
        });

        return distribution;
    }, [calls]);

    if (isLoading) {
        return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-64 bg-slate-100 rounded-lg"></div>
            <div className="h-64 bg-slate-100 rounded-lg"></div>
            <div className="h-64 bg-slate-100 rounded-lg"></div>
        </div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chart 1: Call Volume */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Weekly Call Volume</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={volumeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Chart 2: Status Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Call Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Chart 3: Lead Quality */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Lead Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {scoreData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
