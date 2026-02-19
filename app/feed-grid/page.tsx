"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Upload, ArrowUpCircle, Info, Loader2, Gauge } from "lucide-react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import EnergyTradingABI from "@/blockchain/out/EnergyTrading.sol/EnergyTrading.json";
import { parseEther } from "viem";
import { toast } from "sonner";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function FeedGridPage() {
    const { isConnected, address } = useAccount();
    const [feedAmount, setFeedAmount] = useState<string>("");
    const [price, setPrice] = useState<string>("0.0002");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    interface GridStatus { producer: string; totalSupply: bigint; pricePerUnit: bigint; lastUpdated: bigint; }

    const { data: gridStatus } = useReadContract({
        address: CONTRACT_ADDRESS, abi: EnergyTradingABI.abi, functionName: "getGridStatus",
    }) as { data: GridStatus | undefined };

    const { writeContract, isPending: isFeedPending } = useWriteContract();

    const handleFeed = async () => {
        if (!feedAmount || parseFloat(feedAmount) <= 0) { toast.error("Please enter a valid amount"); return; }
        writeContract({ address: CONTRACT_ADDRESS, abi: EnergyTradingABI.abi, functionName: "feedGrid", args: [BigInt(feedAmount), parseEther(price)] },
            { onSuccess: () => { toast.success("Energy fed to the grid!"); setFeedAmount(""); }, onError: (err) => { toast.error("Transaction failed: " + err.message); } });
    };

    if (!mounted) return null;
    const isUserProducer = gridStatus?.producer?.toLowerCase() === address?.toLowerCase();

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <main className="container mx-auto px-4 pt-24">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black tracking-tight mb-3">Feed the Grid</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Connect your surplus capacity to the network. Every watt shared is green energy utilized by those who need it most.
                    </p>
                </div>

                {!isUserProducer && isConnected && (
                    <div className="mb-8 mx-auto max-w-2xl p-4 rounded-2xl border border-amber-300/50 bg-amber-500/5 text-center">
                        <p className="text-amber-500 font-bold text-sm">⚠️ Unauthorized Role</p>
                        <p className="text-xs text-muted-foreground mt-1">Only the registered grid producer can feed energy.</p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
                    {/* Status & Perks */}
                    <div className="space-y-5">
                        <Card className="border-border shadow-sm">
                            <CardContent className="p-7">
                                <div className="flex items-center justify-between mb-7">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Gauge className="h-7 w-7 text-primary" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">ESP32 Status</p>
                                        <p className="text-emerald-500 font-bold flex items-center gap-1 justify-end text-sm">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Online
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-muted border border-border">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Live Surplus</p>
                                        <p className="text-2xl font-black">2.1 kW</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted border border-border">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Max Supply</p>
                                        <p className="text-2xl font-black">5.0 kW</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-7 rounded-2xl border border-primary/30 bg-primary/5">
                            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-foreground">
                                <Info className="h-4 w-4 text-primary" /> Producer Perks
                            </h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <ArrowUpCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                    Earn ETH instantly on every neighbor purchase.
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowUpCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                    Dynamic pricing optimizes your revenue based on scarcity.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Feed Form */}
                    <Card className="border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Upload className="h-4 w-4 text-primary" /> Listing Configuration
                            </CardTitle>
                            <CardDescription>Update the grid with your current surplus capacity</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Supply Amount (Wh)</label>
                                <div className="relative">
                                    <Input type="number" placeholder="e.g. 5000" value={feedAmount}
                                        onChange={(e) => setFeedAmount(e.target.value)}
                                        className="h-12 rounded-xl pl-11 text-lg font-bold" />
                                    <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                </div>
                                <p className="text-xs text-muted-foreground">This will be added to the total grid pool.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Base Price (ETH / Wh)</label>
                                <Input type="number" step="0.0001" value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="h-12 rounded-xl text-lg font-bold" />
                            </div>

                            <Button onClick={handleFeed}
                                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold text-base text-primary-foreground shadow-md shadow-primary/20 disabled:opacity-50"
                                disabled={!isConnected || isFeedPending || !feedAmount}>
                                {isFeedPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transacting...</> : "Update Grid Supply"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
