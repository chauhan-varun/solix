"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
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

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7"];

export default function AnalyticsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic italic-none tracking-normal">Grid Analytics</h1>
                    <p className="text-white/50">Visualizing the flow of energy and value across the decentralized commons.</p>
                </div>

                {/* Global Stats */}
                <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Total Transactions", value: "4,129", icon: Activity, color: "text-blue-400" },
                        { label: "Avg. Energy Price", value: "0.00021 ETH", icon: TrendingUp, color: "text-green-400" },
                        { label: "Active Grid Nodes", value: "152", icon: Users, color: "text-purple-400" },
                        { label: "Renewable Mix", value: "100%", icon: Zap, color: "text-orange-400" },
                    ].map((stat, i) => (
                        <Card key={i} className="border-white/10 bg-white/[0.02]">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</span>
                                </div>
                                <div className="text-2xl font-black">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Supply vs Demand */}
                    <Card className="lg:col-span-2 border-white/10 bg-white/[0.02] backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Grid Supply vs. Local Demand</CardTitle>
                            <CardDescription>Aggregate performance across the entire network</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full pt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={gridData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                        <XAxis dataKey="name" stroke="#ffffff30" fontSize={11} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#ffffff30" fontSize={11} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: "#ffffff05" }}
                                            contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff10", borderRadius: "12px" }}
                                        />
                                        <Bar dataKey="supply" fill="#f97316" radius={[4, 4, 0, 0]} name="Energy Supply" />
                                        <Bar dataKey="demand" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Consumer Demand" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Trends */}
                    <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Price Discovery</CardTitle>
                            <CardDescription>Dynamic pricing over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={priceHistory}>
                                        <Bar dataKey="price" radius={[4, 4, 0, 0]} name="Price (ETH)">
                                            {priceHistory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                        <Tooltip
                                            cursor={{ fill: "#ffffff05" }}
                                            contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff10", borderRadius: "12px" }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <TrendingUp className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Price Stability: High</p>
                                        <p className="text-[10px] text-white/30 uppercase font-black">Volatility: +/- 4%</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Impact Map Preview */}
                <section className="mt-12">
                    <Card className="border-white/10 bg-gradient-to-br from-orange-600/10 via-black to-black border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <Globe className="h-16 w-16 text-white/10 mb-6" />
                            <h2 className="text-2xl font-bold mb-4">Grid Geography</h2>
                            <p className="max-w-md text-white/40 mb-8 font-medium">
                                Our network topology maps how energy flows through the physical grid,
                                optimizing for minimal line loss.
                            </p>
                            <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase border-white/20">
                                Coming Soon - Interactive Map
                            </Badge>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}

function Badge({ children, className, variant }: any) {
    return (
        <span className={`px-2 py-1 rounded inline-block ${className}`}>
            {children}
        </span>
    );
}
