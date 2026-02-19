"use client";

import { useAccount } from "wagmi";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Zap,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Activity,
    Plus,
    ShoppingCart,
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
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
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="container mx-auto flex h-[80vh] flex-col items-center justify-center p-4">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted clay">
                        <Wallet className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h1 className="mb-3 text-3xl font-bold text-foreground">Connect your wallet</h1>
                    <p className="text-muted-foreground mb-8 max-w-sm text-center">
                        Access your energy dashboard by connecting MetaMask or your preferred wallet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-1 text-foreground">My Grid Dashboard</h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Monitoring node {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild size="lg" className="rounded-2xl">
                            <Link href="/feed-grid" className="flex items-center gap-2">
                                <Plus className="h-5 w-5" /> Feed Grid
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-2xl">
                            <Link href="/grid" className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" /> Buy Energy
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Zap, label: "Live Production", value: `${stats.production.toFixed(1)} Wh`, trend: "+12%", trendUp: true, iconBg: "bg-primary/10", iconColor: "text-primary" },
                        { icon: Activity, label: "Current Usage", value: `${stats.consumption.toFixed(1)} Wh`, trend: "+4%", trendUp: false, iconBg: "bg-destructive/10", iconColor: "text-destructive" },
                        { icon: ArrowUpRight, label: "Grid Surplus", value: `${stats.surplus.toFixed(1)} Wh`, trend: null, trendUp: true, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400" },
                        { icon: ArrowDownLeft, label: "Total Earnings", value: "0.45 ETH", trend: null, trendUp: true, iconBg: "bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400" },
                    ].map((stat, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6 pb-6">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className={`h-11 w-11 rounded-2xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    {stat.trend && (
                                        <span className={`flex items-center gap-1 text-xs font-semibold ${stat.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                                            <TrendingUp className="h-3 w-3" /> {stat.trend}
                                        </span>
                                    )}
                                </div>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{stat.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {history.length === 0 && !loading && (
                    <Card className="mb-8 border-primary/30 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Activity className="h-5 w-5 text-primary" /> Link your Smart Meter
                            </CardTitle>
                            <CardDescription>Enter your ESP32 Meter ID to start seeing live energy data</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <Input
                                type="text"
                                placeholder="e.g. METER_001_HACK"
                                value={meterId}
                                onChange={(e) => setMeterId(e.target.value)}
                                className="flex-1 h-12"
                            />
                            <Button
                                onClick={handleLinkMeter}
                                disabled={isLinking || !meterId}
                                className="h-12 rounded-xl"
                            >
                                {isLinking ? "Linking..." : "Connect Meter"}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-foreground">Live Production vs. Consumption</CardTitle>
                            <CardDescription>Real-time data from your linked ESP32 smart meter</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full pt-4 relative">
                                {history.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={history}>
                                            <defs>
                                                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                            <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} unit=" Wh" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "var(--card)",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: "12px",
                                                    color: "var(--card-foreground)",
                                                }}
                                            />
                                            <Area type="monotone" dataKey="production" stroke="var(--chart-1)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProd)" name="Production" />
                                            <Area type="monotone" dataKey="consumption" stroke="var(--chart-2)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCons)" name="Consumption" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-muted/30 clay-inset">
                                        <div className="text-center">
                                            <Activity className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                                            <p className="text-muted-foreground font-semibold uppercase tracking-wider">No readings yet</p>
                                            <p className="text-sm text-muted-foreground mt-1">Link your ESP32 meter above to see live data</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-foreground">Grid Activity</CardTitle>
                            <CardDescription>Recent transactions in your area</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Zap className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">Bought 5.2 kWh</p>
                                            <p className="text-xs text-muted-foreground">From Grid Node #142</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+0.004 ETH</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Success</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-sm text-muted-foreground hover:text-foreground" asChild>
                                <Link href="/history">View All History</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
