"use client";

import { useAccount } from "wagmi";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Zap,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Activity,
    Plus,
    ShoppingCart
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface ReadingData {
    time: string;
    production: number;
    consumption: number;
}

export function DashboardClient() {
    const { isConnected, address } = useAccount();
    const [mounted, setMounted] = useState(false);
    const [history, setHistory] = useState<ReadingData[]>([]);
    const [stats, setStats] = useState<{ production: number; consumption: number; surplus: number }>({
        production: 0,
        consumption: 0,
        surplus: 0,
    });
    const [loading, setLoading] = useState(true);
    const [meterId, setMeterId] = useState("");
    const [isLinking, setIsLinking] = useState(false);

    const fetchData = async (showLoading = true) => {
        if (!address) {
            setLoading(false);
            return;
        }
        if (showLoading) setLoading(true);
        try {
            const res = await fetch(`/api/readings?address=${address}`);
            const data = await res.json();
            if (data.history) setHistory(data.history);
            if (data.live) setStats(data.live);
        } catch (err) {
            console.error("Failed to fetch readings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkMeter = async () => {
        if (!meterId) return;
        setIsLinking(true);
        try {
            const res = await fetch('/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: address,
                    meterId: meterId,
                    role: 'producer'
                })
            });
            if (res.ok) {
                toast.success("Meter linked successfully!");
                fetchData();
            }
        } catch {
            toast.error("Failed to link meter");
        } finally {
            setIsLinking(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            fetchData(true); // Initial load with loading state
            const interval = setInterval(() => fetchData(false), 5000); // Realtime: poll every 5s, no loading flash
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [isConnected, address]);

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto flex h-[80vh] flex-col items-center justify-center p-4">
                    <Wallet className="mb-6 h-16 w-16 text-white/20" />
                    <h1 className="mb-4 text-3xl font-bold">Please connect your wallet</h1>
                    <p className="text-white/50 mb-8">Access your energy dashboard by connecting your MetaMask</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">My Grid Dashboard</h1>
                        <p className="text-white/50 font-medium">Monitoring node {address?.slice(0, 6)}...{address?.slice(-4)}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button asChild className="rounded-full bg-orange-600 hover:bg-orange-700">
                            <Link href="/feed-grid" className="flex items-center gap-2">
                                <Plus className="h-5 w-5" /> Feed Grid
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full border-white/10 hover:bg-white/5">
                            <Link href="/grid" className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" /> Buy Energy
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-white/10 bg-white/[0.02]">
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-orange-500" />
                                </div>
                                <div className="flex items-center gap-1 text-xs text-green-400">
                                    <TrendingUp className="h-3 w-3" /> +12%
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{stats.production.toFixed(1)} Wh</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider font-bold">Live Production</div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/[0.02]">
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <Activity className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="flex items-center gap-1 text-xs text-red-400">
                                    <TrendingUp className="h-3 w-3" /> +4%
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{stats.consumption.toFixed(1)} Wh</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider font-bold">Current Usage</div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/[0.02]">
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{stats.surplus.toFixed(1)} Wh</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider font-bold">Grid Surplus</div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/[0.02]">
                        <CardContent className="pt-6">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <ArrowDownLeft className="h-5 w-5 text-blue-500" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">0.45 ETH</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider font-bold">Total Earnings</div>
                        </CardContent>
                    </Card>
                </div>

                {history.length === 0 && !loading && (
                    <Card className="mb-8 border-orange-500/30 bg-orange-500/5 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-orange-500" /> Link your Smart Meter
                            </CardTitle>
                            <CardDescription>Enter your ESP32 Meter ID to start seeing live energy data from MongoDB</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="e.g. METER_001_HACK"
                                value={meterId}
                                onChange={(e) => setMeterId(e.target.value)}
                                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            />
                            <Button
                                onClick={handleLinkMeter}
                                disabled={isLinking || !meterId}
                                className="rounded-xl bg-orange-600 hover:bg-orange-700"
                            >
                                {isLinking ? "Linking..." : "Connect Meter"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2 border-white/10 bg-white/[0.02] backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Live Production vs. Consumption</CardTitle>
                            <CardDescription>Real-time data from your linked ESP32 smart meter (MongoDB)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full pt-4 relative">
                                {history.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={history}>
                                            <defs>
                                                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} unit=" Wh" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff20", borderRadius: "12px" }}
                                                itemStyle={{ color: "#fff" }}
                                            />
                                            <Area type="monotone" dataKey="production" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" name="Production" />
                                            <Area type="monotone" dataKey="consumption" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCons)" name="Consumption" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                                        <p className="text-white/40 font-bold uppercase tracking-widest">No readings yet from ESP32</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/[0.02] backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Grid Activity</CardTitle>
                            <CardDescription>Recent transactions in your area</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                            <Zap className="h-5 w-5 text-orange-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">Bought 5.2 kWh</p>
                                            <p className="text-xs text-white/40">From Grid Node #142</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-green-400">+0.004 ETH</p>
                                            <p className="text-[10px] text-white/40 uppercase font-black">Success</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-sm text-white/40 hover:text-white hover:bg-white/5" asChild>
                                <Link href="/history">View All History</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
