"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ShoppingCart, TrendingUp, Info, Loader2 } from "lucide-react";
import { useAccount, useReadContract, useWriteContract, useBalance } from "wagmi";
import EnergyTradingABI from "@/blockchain/out/EnergyTrading.sol/EnergyTrading.json";
import { formatEther, parseEther } from "viem";
import { toast } from "sonner";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function GridPage() {
    const { isConnected, address } = useAccount();
    const [buyAmount, setBuyAmount] = useState<string>("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: gridStatus, isLoading: isGridLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: EnergyTradingABI.abi,
        functionName: "getGridStatus",
    }) as any;

    const { data: balance } = useBalance({ address });

    const { writeContract, isPending: isBuyPending } = useWriteContract();

    const handleBuy = async () => {
        if (!buyAmount || parseFloat(buyAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        const pricePerUnit = gridStatus?.pricePerUnit || BigInt(0);
        const totalCost = BigInt(Math.floor(parseFloat(buyAmount))) * pricePerUnit;

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: EnergyTradingABI.abi,
            functionName: "buyFromGrid",
            args: [BigInt(buyAmount)],
            value: totalCost,
        }, {
            onSuccess: () => {
                toast.success("Energy purchase successful!");
                setBuyAmount("");
            },
            onError: (err) => {
                toast.error("Purchase failed: " + err.message);
            }
        });
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-black tracking-tight mb-4">Grid Marketplace</h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg">
                        Directly access surplus energy from local producers. Prices adjust dynamically
                        based on real-time grid supply and demand.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Grid Status Card */}
                    <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-orange-400" /> Grid Status
                            </CardTitle>
                            <CardDescription>Live stats from the Sepolia grid</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-2xl bg-white/5 space-y-1">
                                <p className="text-xs text-white/40 font-bold uppercase">Available Supply</p>
                                <div className="text-3xl font-black">
                                    {isGridLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${gridStatus?.totalSupply?.toString() || 0} Wh`}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 space-y-1">
                                <p className="text-xs text-white/40 font-bold uppercase">Dynamic Price</p>
                                <div className="text-3xl font-black text-green-400">
                                    {isGridLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${formatEther(gridStatus?.pricePerUnit || BigInt(0))} ETH/Wh`}
                                </div>
                                <p className="text-[10px] text-white/30 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> Updated 2m ago
                                </p>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                                <Info className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-white/60 leading-relaxed">
                                    The grid is currently in **surplus state**. Prices are discounted
                                    to encourage consumption.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Buy Energy Card */}
                    <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl lg:col-span-2 shadow-2xl shadow-orange-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-blue-400" /> Buy from Grid
                            </CardTitle>
                            <CardDescription>Enter the amount of energy you wish to purchase</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/50">Amount (Wh)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 500"
                                        value={buyAmount}
                                        onChange={(e) => setBuyAmount(e.target.value)}
                                        className="h-14 rounded-2xl border-white/10 bg-white/5 text-xl font-bold focus-visible:ring-orange-500/50"
                                    />
                                </div>

                                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                                    <div>
                                        <p className="text-xs text-white/40 font-bold uppercase">Estimated Cost</p>
                                        <p className="text-xl font-black">
                                            {buyAmount ? (parseFloat(buyAmount) * parseFloat(formatEther(gridStatus?.pricePerUnit || BigInt(0)))).toFixed(6) : "0.000000"} ETH
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-white/40 font-bold uppercase">Your Balance</p>
                                        <p className="text-sm font-medium text-white/60">{balance ? parseFloat(formatEther(balance.value)).toFixed(4) : "0.0000"} ETH</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleBuy}
                                className="w-full h-16 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 font-black text-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                                disabled={!isConnected || isBuyPending || !buyAmount || isGridLoading}
                            >
                                {isBuyPending ? (
                                    <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Confirming...</>
                                ) : (
                                    "Initiate Smart Transaction"
                                )}
                            </Button>

                            <p className="text-center text-xs text-white/30 px-6 font-medium">
                                By purchasing, you agree to the automated trade terms. Funds will be
                                transferred directly to the producer node upon blockchain verification.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
