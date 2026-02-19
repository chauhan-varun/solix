"use client";

import { useAccount } from "wagmi";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Zap, TrendingUp, ArrowUpRight, ArrowDownLeft,
    Wallet, Activity, Plus, ShoppingCart,
} from "lucide-react";
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area,
} from "recharts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface ReadingData {
    time: string;
    production: number;
    consumption: number;
}

export interface DashboardInitialData {
    history: ReadingData[];
    live: { production: number; consumption: number; surplus: number } | null;
}

const mockHistory: ReadingData[] = [
    { time: "10:00", production: 2.1, consumption: 1.2 },
    { time: "11:00", production: 3.5, consumption: 1.4 },
    { time: "12:00", production: 4.8, consumption: 1.5 },
    { time: "13:00", production: 5.2, consumption: 1.3 },
    { time: "14:00", production: 4.5, consumption: 1.6 },
    { time: "15:00", production: 3.2, consumption: 1.8 },
    { time: "16:00", production: 2.0, consumption: 2.1 },
];

export function DashboardClient({ initialData }: { initialData: DashboardInitialData }) {
    const { isConnected, address } = useAccount();
    const [mounted, setMounted] = useState(false);
    const [history, setHistory] = useState<ReadingData[]>(initialData.history);
    const [stats, setStats] = useState(
        initialData.live ?? { production: 0, consumption: 0, surplus: 0 }
    );
    const [loading, setLoading] = useState(false);
    const [meterId, setMeterId] = useState("");
    const [isLinking, setIsLinking] = useState(false);

    const fetchData = async () => {
        if (!address) return;
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
            const res = await fetch("/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress: address, meterId, role: "producer" }),
            });
            if (res.ok) { toast.success("Meter linked successfully!"); fetchData(); }
        } catch { toast.error("Failed to link meter"); }
        finally { setIsLinking(false); }
    };

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (isConnected && address) {
            fetchData();
            const interval = setInterval(fetchData, 5000);
            return () => clearInterval(interval);
        }
    }, [isConnected, address]);

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="container mx-auto flex h-[80vh] flex-col items-center justify-center p-4">
                    <Wallet className="mb-6 h-14 w-14 text-muted-foreground/30" />
                    <h1 className="mb-3 text-3xl font-bold">Connect your wallet</h1>
                    <p className="text-muted-foreground mb-8">Access your energy dashboard by connecting MetaMask</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <main className="container mx-auto px-4 pt-24">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-1">My Grid Dashboard</h1>
                        <p className="text-muted-foreground text-sm">
                            Monitoring node {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20">
                            <Link href="/feed-grid" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Feed Grid
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/grid" className="flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" /> Buy Energy
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Zap, colorCls: "text-primary", bgCls: "bg-primary/10", label: "Live Production", value: `${stats.production.toFixed(1)} Wh`, trend: "+12%", trendUp: true },
                        { icon: Activity, colorCls: "text-muted-foreground", bgCls: "bg-muted", label: "Current Usage", value: `${stats.consumption.toFixed(1)} Wh`, trend: "+4%", trendUp: false },
                        { icon: ArrowUpRight, colorCls: "text-emerald-500", bgCls: "bg-emerald-500/10", label: "Grid Surplus", value: `${stats.surplus.toFixed(1)} Wh`, trend: null, trendUp: true },
                        { icon: ArrowDownLeft, colorCls: "text-violet-500", bgCls: "bg-violet-500/10", label: "Total Earnings", value: "0.45 ETH", trend: null, trendUp: true },
                    ].map((s, i) => (
                        <Card key={i} className="border-border shadow-sm">
                            <CardContent className="pt-5 pb-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className={`h-9 w-9 rounded-xl ${s.bgCls} flex items-center justify-center`}>
                                        <s.icon className={`h-5 w-5 ${s.colorCls}`} />
                                    </div>
                                    {s.trend && (
                                        <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.trendUp ? "text-emerald-500" : "text-muted-foreground"}`}>
                                            <TrendingUp className="h-3 w-3" /> {s.trend}
                                        </span>
                                    )}
                                </div>
                                <div className="text-2xl font-bold">{s.value}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{s.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Link Meter Banner */}
                {history.length === 0 && !loading && (
                    <Card className="mb-8 border-primary/30 bg-primary/5 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary text-base">
                                <Activity className="h-5 w-5" /> Link your Smart Meter
                            </CardTitle>
                            <CardDescription>Enter your ESP32 Meter ID to start seeing live energy data</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text" placeholder="e.g. METER_001_HACK"
                                value={meterId} onChange={(e) => setMeterId(e.target.value)}
                                className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <Button onClick={handleLinkMeter} disabled={isLinking || !meterId}
                                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                                {isLinking ? "Linking..." : "Connect Meter"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2 border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Live Production vs. Consumption</CardTitle>
                            <CardDescription>Real-time data from your linked ESP32 smart meter</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[280px] w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={history.length > 0 ? history : mockHistory}>
                                        <defs>
                                            <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} unit=" Wh" />
                                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: 12, color: "var(--foreground)" }} />
                                        <Area type="monotone" dataKey="production" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProd)" name="Production" />
                                        <Area type="monotone" dataKey="consumption" stroke="var(--muted-foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorCons)" name="Consumption" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Grid Activity</CardTitle>
                            <CardDescription>Recent transactions in your area</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Zap className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">Bought 5.2 kWh</p>
                                            <p className="text-xs text-muted-foreground">From Grid Node #142</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-emerald-500">+0.004 ETH</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Success</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-5 text-sm text-muted-foreground hover:text-foreground" asChild>
                                <Link href="/history">View All History</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
