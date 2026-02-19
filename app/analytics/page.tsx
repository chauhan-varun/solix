"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Zap, TrendingUp, Users, Activity, Globe } from "lucide-react";

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

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export default function AnalyticsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const stats = [
        { label: "Total Transactions", value: "4,129", icon: Activity, iconBg: "bg-primary/10", iconColor: "text-primary" },
        { label: "Avg. Energy Price", value: "0.00021 ETH", icon: TrendingUp, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
        { label: "Active Grid Nodes", value: "152", icon: Users, iconBg: "bg-chart-4/20", iconColor: "text-chart-4" },
        { label: "Renewable Mix", value: "100%", icon: Zap, iconBg: "bg-chart-3/20", iconColor: "text-chart-3" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-4xl font-black tracking-tight mb-2 text-foreground">Grid Analytics</h1>
                    <p className="text-muted-foreground">Visualizing the flow of energy and value across the decentralized commons.</p>
                </div>

                {/* Global Stats */}
                <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6 pb-6">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className={`h-11 w-11 rounded-2xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                                </div>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Supply vs Demand */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-foreground">Grid Supply vs. Local Demand</CardTitle>
                            <CardDescription>Aggregate performance across the entire network</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full pt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gridData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: "var(--muted)" }}
                                            contentStyle={{
                                                backgroundColor: "var(--card)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "12px",
                                                color: "var(--card-foreground)",
                                            }}
                                        />
                                        <Bar dataKey="supply" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Energy Supply" />
                                        <Bar dataKey="demand" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Consumer Demand" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-foreground">Price Discovery</CardTitle>
                            <CardDescription>Dynamic pricing over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={priceHistory}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} axisLine={false} tickLine={false} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={12} axisLine={false} tickLine={false} unit=" ETH" />
                                        <Tooltip
                                            cursor={{ fill: "var(--muted)" }}
                                            contentStyle={{
                                                backgroundColor: "var(--card)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "12px",
                                                color: "var(--card-foreground)",
                                            }}
                                            formatter={(value: number) => [value.toFixed(5) + " ETH", "Price"]}
                                        />
                                        <Bar dataKey="price" radius={[4, 4, 0, 0]} name="Price (ETH)">
                                            {priceHistory.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-8 p-4 rounded-2xl bg-muted/50 clay-inset border border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Price Stability: High</p>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Volatility: +/- 4%</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Impact Map Preview */}
                <section className="mt-12">
                    <Card className="border-dashed border-primary/30 bg-primary/5">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <Globe className="h-16 w-16 text-muted-foreground/40 mb-6" />
                            <h2 className="text-2xl font-bold mb-4 text-foreground">Grid Geography</h2>
                            <p className="max-w-md text-muted-foreground mb-8 font-medium">
                                Our network topology maps how energy flows through the physical grid,
                                optimizing for minimal line loss.
                            </p>
                            <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">
                                Coming Soon — Interactive Map
                            </Badge>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}
