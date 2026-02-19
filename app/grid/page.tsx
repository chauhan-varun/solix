"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ShoppingCart, TrendingUp, Info, Loader2 } from "lucide-react";
import { useAccount, useReadContract, useWriteContract, useBalance, useChainId, useSwitchChain } from "wagmi";
import EnergyTradingABI from "@/blockchain/out/EnergyTrading.sol/EnergyTrading.json";
import { formatEther } from "viem";
import { sepolia } from "viem/chains";
import { toast } from "sonner";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function GridPage() {
    const { isConnected, address } = useAccount();
    const [buyAmount, setBuyAmount] = useState<string>("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    interface GridStatus {
        producer: string;
        totalSupply: bigint;
        pricePerUnit: bigint;
        lastUpdated: bigint;
    }

    const { data: gridStatus, isLoading: isGridLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: EnergyTradingABI.abi,
        functionName: "getGridStatus",
    }) as { data: GridStatus | undefined, isLoading: boolean };

    const { data: dynamicPrice } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: EnergyTradingABI.abi,
        functionName: "getDynamicPrice",
    }) as { data: bigint | undefined };

    const { data: userData, refetch: refetchUser } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: EnergyTradingABI.abi,
        functionName: "users",
        args: address ? [address] : undefined,
    }) as { data: [string, number, boolean] | undefined; refetch: () => void };

    const { data: balance } = useBalance({ address });

    const { writeContract, isPending } = useWriteContract();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    const isRegistered = userData?.[2] === true;
    const isConsumer = userData?.[1] === 1; // Role.Consumer = 1
    const isOnSepolia = chainId === sepolia.id;

    const getRevertMessage = (err: unknown): string => {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Only consumers can buy")) return "Register as Consumer first.";
        if (msg.includes("Insufficient payment")) return "Insufficient payment. Price may have changed.";
        if (msg.includes("Not enough energy")) return "Not enough energy in the grid.";
        if (msg.includes("User rejected") || msg.includes("user rejected")) return "Transaction was rejected.";
        return msg;
    };

    const handleRegister = async () => {
        if (!isOnSepolia) {
            switchChain?.({ chainId: sepolia.id });
            toast.error("Please switch to Sepolia network first.");
            return;
        }
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: EnergyTradingABI.abi,
            functionName: "registerUser",
            args: ["Consumer", 1], // Role.Consumer = 1
        }, {
            onSuccess: () => {
                toast.success("Registered as consumer!");
                refetchUser();
            },
            onError: (err) => toast.error("Registration failed: " + getRevertMessage(err)),
        });
    };

    const handleBuy = async () => {
        if (!isOnSepolia) {
            switchChain?.({ chainId: sepolia.id });
            toast.error("Please switch to Sepolia network first.");
            return;
        }
        if (!buyAmount || parseFloat(buyAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        const amountWh = BigInt(Math.floor(parseFloat(buyAmount)));
        const pricePerWh = dynamicPrice ?? gridStatus?.pricePerUnit ?? BigInt(0);
        const totalCost = amountWh * pricePerWh;

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: EnergyTradingABI.abi,
            functionName: "buyFromGrid",
            args: [amountWh],
            value: totalCost,
        }, {
            onSuccess: () => {
                toast.success("Energy purchase successful!");
                setBuyAmount("");
            },
            onError: (err) => toast.error("Purchase failed: " + getRevertMessage(err)),
        });
    };

    const buyDisabled = !isConnected || isPending || !buyAmount || isGridLoading || !isRegistered || !isConsumer || !isOnSepolia;
    const buyDisabledReason = !isConnected ? "Connect wallet" : !isOnSepolia ? "Switch to Sepolia" : !isRegistered || !isConsumer ? "Register as Consumer first" : !buyAmount ? "Enter amount" : isGridLoading ? "Loading..." : "";

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-black tracking-tight mb-4">Grid Marketplace</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Directly access surplus energy from local producers. Prices adjust dynamically
                        based on real-time grid supply and demand.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Grid Status Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary" /> Grid Status
                            </CardTitle>
                            <CardDescription>Live stats from the Sepolia grid</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-2xl bg-muted/50 clay-inset space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase">Available Supply</p>
                                <div className="text-3xl font-black text-foreground">
                                    {isGridLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${gridStatus?.totalSupply?.toString() || 0} Wh`}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-muted/50 clay-inset space-y-1">
                                <p className="text-xs text-muted-foreground font-bold uppercase">Dynamic Price</p>
                                <div className="text-3xl font-black text-primary">
                                    {isGridLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${formatEther(dynamicPrice ?? gridStatus?.pricePerUnit ?? BigInt(0))} ETH/Wh`}
                                </div>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> Updated 2m ago
                                </p>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-primary/30 bg-primary/5">
                                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    The grid is currently in surplus state. Prices are discounted
                                    to encourage consumption.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Buy Energy Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-primary" /> Buy from Grid
                            </CardTitle>
                            <CardDescription>Enter the amount of energy you wish to purchase</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Amount (Wh)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 500"
                                        value={buyAmount}
                                        onChange={(e) => setBuyAmount(e.target.value)}
                                        className="h-14 rounded-2xl text-xl font-bold"
                                    />
                                </div>

                                <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/50 clay-inset">
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase">Estimated Cost</p>
                                        <p className="text-xl font-black text-foreground">
                                            {buyAmount ? (parseFloat(buyAmount) * parseFloat(formatEther(dynamicPrice ?? gridStatus?.pricePerUnit ?? BigInt(0)))).toFixed(6) : "0.000000"} ETH
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground font-bold uppercase">Your Balance</p>
                                        <p className="text-sm font-medium text-foreground">{balance ? parseFloat(formatEther(balance.value)).toFixed(4) : "0.0000"} ETH</p>
                                    </div>
                                </div>
                            </div>

                            {!isOnSepolia && isConnected && (
                                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-3">
                                    <p className="text-amber-600 dark:text-amber-400 font-bold text-sm text-center">Wrong network</p>
                                    <p className="text-xs text-muted-foreground text-center">Switch to Sepolia to buy from the grid.</p>
                                    <Button
                                        onClick={() => switchChain?.({ chainId: sepolia.id })}
                                        variant="outline"
                                        className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                                    >
                                        Switch to Sepolia
                                    </Button>
                                </div>
                            )}
                            {isOnSepolia && !isRegistered && isConnected && (
                                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-3">
                                    <p className="text-amber-600 dark:text-amber-400 font-bold text-sm text-center">Register as Consumer first</p>
                                    <p className="text-xs text-muted-foreground text-center">You must register on-chain before buying from the grid.</p>
                                    <Button
                                        onClick={handleRegister}
                                        variant="outline"
                                        className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                                        disabled={isPending}
                                    >
                                        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : "Register as Consumer"}
                                    </Button>
                                </div>
                            )}
                            <Button
                                onClick={handleBuy}
                                className="w-full h-16 rounded-2xl font-black text-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                                disabled={buyDisabled}
                                title={buyDisabledReason}
                            >
                                {isPending ? (
                                    <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Confirming...</>
                                ) : (
                                    "Initiate Smart Transaction"
                                )}
                            </Button>
                            {buyDisabled && buyDisabledReason && (
                                <p className="text-center text-xs text-amber-600 dark:text-amber-400">— {buyDisabledReason} —</p>
                            )}

                            <p className="text-center text-xs text-muted-foreground px-6 font-medium">
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
