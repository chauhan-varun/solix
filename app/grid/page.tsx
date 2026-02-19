"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ShoppingCart, TrendingUp, Info, Loader2, Activity } from "lucide-react";
import { useAccount, useReadContract, useWriteContract, useBalance } from "wagmi";
import EnergyTradingABI from "@/blockchain/out/EnergyTrading.sol/EnergyTrading.json";
import { formatEther } from "viem";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const INITIAL_TRADES = [
    { user: "0xA1...3f", amount: 200, mins: 1 },
    { user: "0xB4...9c", amount: 500, mins: 3 },
    { user: "0xC7...2d", amount: 150, mins: 6 },
    { user: "0xD2...8e", amount: 1000, mins: 9 },
];

function generateSupplyHistory(currentSupply: number) {
    return Array.from({ length: 11 }, (_, i) => ({
        t: `${10 - i}m`,
        supply: Math.max(0, currentSupply + Math.round((Math.random() - 0.5) * 200)),
    })).reverse();
}

export default function GridPage() {
    const { isConnected, address } = useAccount();
    const [buyAmount, setBuyAmount] = useState<string>("");
    const [mounted, setMounted] = useState(false);
    const [trades, setTrades] = useState(INITIAL_TRADES);
    const [supplyHistory, setSupplyHistory] = useState<{ t: string; supply: number }[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => { setMounted(true); }, []);

    interface GridStatus { producer: string; totalSupply: bigint; pricePerUnit: bigint; lastUpdated: bigint; }

    const { data: gridStatus, isLoading: isGridLoading } = useReadContract({
        address: CONTRACT_ADDRESS, abi: EnergyTradingABI.abi, functionName: "getGridStatus",
    }) as { data: GridStatus | undefined; isLoading: boolean };

    const { data: balance } = useBalance({ address });
    const { writeContract, isPending: isBuyPending } = useWriteContract();

    useEffect(() => {
        const supply = Number(gridStatus?.totalSupply || 0);
        setSupplyHistory(generateSupplyHistory(supply));
    }, [gridStatus]);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTrades((prev) => {
                const names = ["0xA1...3f", "0xB4...9c", "0xC7...2d", "0xD2...8e", "0xE5...1a"];
                const amounts = [100, 200, 300, 500, 750, 1000];
                const newTrade = { user: names[Math.floor(Math.random() * names.length)], amount: amounts[Math.floor(Math.random() * amounts.length)], mins: 0 };
                return [newTrade, ...prev.map((t) => ({ ...t, mins: t.mins + 1 }))].slice(0, 5);
            });
        }, 8000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    const handleBuy = async () => {
        if (!buyAmount || parseFloat(buyAmount) <= 0) { toast.error("Please enter a valid amount"); return; }
        const pricePerUnit = gridStatus?.pricePerUnit || BigInt(0);
        const totalCost = BigInt(Math.floor(parseFloat(buyAmount))) * pricePerUnit;
        writeContract({ address: CONTRACT_ADDRESS, abi: EnergyTradingABI.abi, functionName: "buyFromGrid", args: [BigInt(buyAmount)], value: totalCost },
            { onSuccess: () => { toast.success("Energy purchase successful!"); setBuyAmount(""); }, onError: (err) => { toast.error("Purchase failed: " + err.message); } });
    };

    if (!mounted) return null;

    const supplyRaw = Number(gridStatus?.totalSupply || 0);
    const MAX_SUPPLY = 2000;
    const supplyPct = Math.min(100, Math.round((supplyRaw / MAX_SUPPLY) * 100));
    const supplyColor = supplyPct > 60
        ? { bar: "#10B981", label: "🟢 Surplus", text: "text-emerald-500" }
        : supplyPct > 30
            ? { bar: "#F59E0B", label: "🟡 Normal", text: "text-amber-500" }
            : { bar: "#EF4444", label: "🔴 Low Supply", text: "text-red-500" };
    const priceEth = parseFloat(formatEther(gridStatus?.pricePerUnit || BigInt(0)));

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <main className="container mx-auto px-4 pt-24">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black tracking-tight mb-3">
                        Live <span className="text-primary">Energy Marketplace</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Buy surplus solar energy directly from local producers. Prices go up or down
                        based on how much is available — no middlemen, just the blockchain.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Grid Status */}
                    <Card className="border-border shadow-sm lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Zap className="h-4 w-4 text-primary" /> Grid Status
                            </CardTitle>
                            <CardDescription>Live stats from the Sepolia grid</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Supply */}
                            <div className="p-4 rounded-2xl bg-muted border border-border space-y-3">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Available Supply</p>
                                <div className="text-2xl font-black">
                                    {isGridLoading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : `${supplyRaw} Wh`}
                                </div>
                                <p className="text-xs text-muted-foreground">Available for trading</p>
                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <span className={`text-xs font-semibold ${supplyColor.text}`}>{supplyColor.label}</span>
                                        <span className="text-xs text-muted-foreground">{supplyPct}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${supplyPct}%`, background: supplyColor.bar }} />
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="p-4 rounded-2xl bg-muted border border-border space-y-1">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Dynamic Price</p>
                                <div className={`text-2xl font-black ${supplyColor.text}`}>
                                    {isGridLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : `${priceEth} ETH/Wh`}
                                </div>
                                <p className="text-xs text-muted-foreground">Current market price</p>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                                    <TrendingUp className="h-3 w-3" /> Updated 2m ago
                                </p>
                            </div>

                            {/* Info */}
                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-primary/30 bg-primary/5">
                                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    The grid is currently in <span className="font-bold text-foreground">surplus state</span>.
                                    Prices are discounted to encourage consumption.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right column */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Buy Card */}
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" /> Buy from Grid
                                </CardTitle>
                                <CardDescription>Pick an amount, check the cost, and confirm your purchase</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Amount (Wh)</label>
                                    <Input type="number" placeholder="e.g. 500" value={buyAmount}
                                        onChange={(e) => setBuyAmount(e.target.value)}
                                        className="h-12 rounded-xl text-lg font-bold" />
                                    <div className="flex gap-2 pt-1">
                                        {[100, 500, 1000].map((preset) => (
                                            <button key={preset} onClick={() => setBuyAmount(String(preset))}
                                                className="flex-1 rounded-xl border border-border bg-muted py-2 text-sm font-semibold text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all active:scale-95">
                                                {preset} Wh
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-4 rounded-xl bg-muted border border-border">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Estimated Cost</p>
                                        <p className="text-xl font-black">
                                            {buyAmount ? (parseFloat(buyAmount) * priceEth).toFixed(6) : "0.000000"} ETH
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Your Balance</p>
                                        <p className="text-sm font-semibold">
                                            {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : "0.0000"} ETH
                                        </p>
                                    </div>
                                </div>

                                <Button onClick={handleBuy}
                                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold text-base text-primary-foreground shadow-md shadow-primary/20 disabled:opacity-50"
                                    disabled={!isConnected || isBuyPending || !buyAmount || isGridLoading}>
                                    {isBuyPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming on chain...</>
                                        : !isConnected ? "Connect wallet to buy" : "Buy Energy Now"}
                                </Button>
                                <p className="text-center text-xs text-muted-foreground">
                                    Payment goes directly to the producer. Transaction is logged on Sepolia.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Mini Chart */}
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Activity className="h-4 w-4 text-primary" /> Energy Supply — Last 10 Minutes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={140}>
                                    <LineChart data={supplyHistory} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis dataKey="t" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12, color: "var(--foreground)" }} formatter={(val: number) => [`${val} Wh`, "Supply"]} />
                                        <Line type="monotone" dataKey="supply" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Trade Feed */}
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    Live Trade Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {trades.map((trade, i) => (
                                        <li key={i} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                                            <span className="flex items-center gap-2">
                                                <span className="text-emerald-500 text-xs">●</span>
                                                <span className="font-mono text-muted-foreground text-xs">User {trade.user}</span>
                                                <span className="font-semibold">bought {trade.amount} Wh</span>
                                            </span>
                                            <span className="text-xs text-muted-foreground shrink-0 ml-4">
                                                {trade.mins === 0 ? "just now" : `${trade.mins}m ago`}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
