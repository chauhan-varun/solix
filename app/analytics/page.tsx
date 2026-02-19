"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Zap, TrendingUp, TrendingDown, Users, Activity, Globe } from "lucide-react";

const gridData = [
    { name: "Node A", supply: 400, demand: 240 },
    { name: "Node B", supply: 300, demand: 139 },
    { name: "Node C", supply: 200, demand: 980 },
    { name: "Node D", supply: 278, demand: 390 },
    { name: "Node E", supply: 189, demand: 480 },
    { name: "Node F", supply: 239, demand: 380 },
    { name: "Node G", supply: 349, demand: 430 },
];

const priceHistory = [
    { day: "Day 1", price: 0.00018 },
    { day: "Day 2", price: 0.00021 },
    { day: "Day 3", price: 0.00019 },
    { day: "Day 4", price: 0.00025 },
    { day: "Day 5", price: 0.00022 },
    { day: "Day 6", price: 0.00020 },
    { day: "Day 7", price: 0.00023 },
];

const PRICE_SHADES = ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#14B8A6", "#22D3EE", "#67E8F9"];

const KPI_CARDS = [
    { label: "Total Transactions", value: "4,129", icon: Activity, iconClass: "text-primary bg-primary/10", trend: "up", trendLabel: "+12% today" },
    { label: "Avg. Energy Price", value: "0.00021 ETH", icon: TrendingUp, iconClass: "text-emerald-500 bg-emerald-500/10", trend: "down", trendLabel: "-3% today" },
    { label: "Active Grid Nodes", value: "152", icon: Users, iconClass: "text-muted-foreground bg-muted", trend: "up", trendLabel: "+5 today" },
    { label: "Renewable Mix", value: "100%", icon: Zap, iconClass: "text-violet-500 bg-violet-500/10", trend: "up", trendLabel: "Stable" },
];

const ChartLegend = () => (
    <div className="flex items-center gap-5 mb-4">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
            Supply (Wh)
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-3 w-3 rounded-sm bg-muted-foreground/60" />
            Demand (Wh)
        </span>
    </div>
);

export default function AnalyticsPage() {
    const [mounted, setMounted] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(12);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setLastUpdated((s) => (s >= 60 ? 5 : s + 1)), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) return null;

    const tooltipStyle = {
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
        fontSize: 12,
        color: "var(--foreground)",
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <main className="container mx-auto px-4 pt-24">
                {/* Header */}
                <div className="mb-7 text-center lg:text-left">
                    <h1 className="text-3xl font-black tracking-tight mb-1.5">Grid Analytics</h1>
                    <p className="text-muted-foreground text-sm">Real-time insights into energy flow, pricing, and grid performance.</p>
                </div>

                <hr className="border-border mb-7" />

                {/* KPI Cards */}
                <div className="grid gap-4 mb-3 md:grid-cols-2 lg:grid-cols-4">
                    {KPI_CARDS.map((stat, i) => (
                        <Card key={i} className="border-border shadow-sm">
                            <CardContent className="pt-5 pb-4">
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${stat.iconClass}`}>
                                        <stat.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                                </div>
                                <div className="text-2xl font-black mb-1">{stat.value}</div>
                                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trend === "up" ? "text-emerald-500" : "text-muted-foreground"}`}>
                                    {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {stat.trendLabel}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Last updated + volatility */}
                <div className="flex items-center justify-between mb-7 px-1">
                    <span className="text-xs text-muted-foreground">
                        Last updated: <span className="text-foreground font-medium">{lastUpdated} seconds ago</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Market Volatility: <span className="text-emerald-500 font-semibold">Low</span>
                    </span>
                </div>

                <hr className="border-border mb-7" />

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Supply vs Demand */}
                    <Card className="lg:col-span-2 border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Grid Supply vs. Local Demand</CardTitle>
                            <CardDescription>Aggregate performance across the entire network</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartLegend />
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gridData} margin={{ left: 8 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={11} axisLine={false} tickLine={false}
                                            label={{ value: "Wh", angle: -90, position: "insideLeft", offset: -2, style: { fill: "var(--muted-foreground)", fontSize: 11 } }}
                                        />
                                        <Tooltip cursor={{ fill: "var(--primary)", fillOpacity: 0.04 }} contentStyle={tooltipStyle}
                                            formatter={(val: number, name: string) => [`${val} Wh`, name === "supply" ? "Supply" : "Demand"]} />
                                        <Bar dataKey="supply" fill="var(--primary)" radius={[4, 4, 0, 0]} name="supply" />
                                        <Bar dataKey="demand" fill="var(--muted-foreground)" fillOpacity={0.5} radius={[4, 4, 0, 0]} name="demand" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Discovery */}
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Price Discovery</CardTitle>
                            <CardDescription>Dynamic pricing over last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={priceHistory} margin={{ left: 8 }}>
                                        <YAxis stroke="var(--muted-foreground)" fontSize={10} axisLine={false} tickLine={false}
                                            tickFormatter={(v) => v.toFixed(4)}
                                            label={{ value: "ETH/Wh", angle: -90, position: "insideLeft", offset: -2, style: { fill: "var(--muted-foreground)", fontSize: 10 } }}
                                        />
                                        <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} axisLine={false} tickLine={false} />
                                        <Bar dataKey="price" radius={[4, 4, 0, 0]} name="Price (ETH/Wh)">
                                            {priceHistory.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={PRICE_SHADES[index % PRICE_SHADES.length]} />
                                            ))}
                                        </Bar>
                                        <Tooltip cursor={{ fill: "var(--primary)", fillOpacity: 0.04 }} contentStyle={tooltipStyle}
                                            formatter={(v: number) => [`${v.toFixed(5)} ETH/Wh`, "Price"]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-5 p-4 rounded-2xl bg-muted border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Market Volatility: Low</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Price swing: ±4%</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <hr className="border-border mt-8 mb-8" />

                {/* Grid Geography */}
                <section>
                    <Card className="border-border border-dashed shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <Globe className="h-14 w-14 text-muted-foreground/30 mb-5" />
                            <h2 className="text-xl font-bold mb-3">Grid Geography</h2>
                            <p className="max-w-md text-muted-foreground mb-7 text-sm">
                                Our network topology maps how energy flows through the physical grid, optimizing for minimal line loss.
                            </p>
                            <span className="px-3 py-1.5 rounded-full border border-border bg-muted text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                                Coming Soon — Interactive Map
                            </span>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}
