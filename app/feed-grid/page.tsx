"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Upload, ArrowUpCircle, Info, Loader2, Gauge } from "lucide-react";
import { useAccount, useReadContract, useWriteContract, useChainId, useSwitchChain } from "wagmi";
import EnergyTradingABI from "@/blockchain/out/EnergyTrading.sol/EnergyTrading.json";
import { parseEther } from "viem";
import { sepolia } from "viem/chains";
import { toast } from "sonner";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function FeedGridPage() {
    const { isConnected, address } = useAccount();
    const [feedAmount, setFeedAmount] = useState<string>("");
    const [price, setPrice] = useState<string>("0.0002"); // Base price in ETH
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    interface GridStatus {
        producer: string;
        totalSupply: bigint;
        pricePerUnit: bigint;
        lastUpdated: bigint;
    }

    const { data: gridStatus } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: EnergyTradingABI.abi,
        functionName: "getGridStatus",
    }) as { data: GridStatus | undefined };

    const { data: userData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: EnergyTradingABI.abi,
        functionName: "users",
        args: address ? [address] : undefined,
    }) as { data: [string, number, boolean] | undefined };

    const { writeContract, isPending: isFeedPending } = useWriteContract();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    const isUserProducer = gridStatus?.producer?.toLowerCase() === address?.toLowerCase();
    const noProducerYet = !gridStatus?.producer || gridStatus.producer === "0x0000000000000000000000000000000000000000";
    const isRegistered = userData?.[2] === true;
    const isConsumer = userData?.[1] === 1;
    const isOnSepolia = chainId === sepolia.id;

    const getRevertMessage = (err: unknown): string => {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Already registered")) return "You're already registered. If you registered as Consumer, you cannot become Producer.";
        if (msg.includes("Producer already exists")) return "A producer is already registered for this grid.";
        if (msg.includes("User rejected") || msg.includes("user rejected")) return "Transaction was rejected.";
        return msg;
    };

    const handleRegisterProducer = async () => {
        if (!isOnSepolia) {
            switchChain?.({ chainId: sepolia.id });
            toast.error("Please switch to Sepolia network first.");
            return;
        }
        if (!CONTRACT_ADDRESS) {
            toast.error("Contract not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS.");
            return;
        }
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: EnergyTradingABI.abi,
            functionName: "registerUser",
            args: ["Producer", 0], // Role.Producer = 0
        }, {
            onSuccess: () => toast.success("Registered as producer! You can now feed the grid."),
            onError: (err) => toast.error("Registration failed: " + getRevertMessage(err)),
        });
    };

    const handleFeed = async () => {
        if (!feedAmount || parseFloat(feedAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: EnergyTradingABI.abi,
            functionName: "feedGrid",
            args: [BigInt(feedAmount), parseEther(price)],
        }, {
            onSuccess: () => {
                toast.success("Energy fed to the grid!");
                setFeedAmount("");
            },
            onError: (err) => {
                toast.error("Transaction failed: " + err.message);
            }
        });
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-black tracking-tight mb-4">Feed the Grid</h1>
                    <p className="text-white/50 max-w-2xl mx-auto text-lg">
                        Connect your surplus capacity to the network. Every watt shared is green
                        energy utilized by those who need it most.
                    </p>
                </div>

                {!isUserProducer && isConnected && (
                    <div className="mb-8 mx-auto max-w-2xl p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 space-y-3">
                        {!isOnSepolia ? (
                            <>
                                <p className="text-yellow-500 font-bold text-center">Wrong network</p>
                                <p className="text-xs text-white/50 text-center">Switch to Sepolia to interact with the grid.</p>
                                <Button
                                    onClick={() => switchChain?.({ chainId: sepolia.id })}
                                    variant="outline"
                                    className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                                >
                                    Switch to Sepolia
                                </Button>
                            </>
                        ) : noProducerYet && !isRegistered ? (
                            <>
                                <p className="text-yellow-500 font-bold text-center">No producer registered yet</p>
                                <p className="text-xs text-white/50 text-center">Be the first to register as the grid producer and start feeding surplus energy.</p>
                                <Button
                                    onClick={handleRegisterProducer}
                                    variant="outline"
                                    className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                                    disabled={isFeedPending}
                                >
                                    {isFeedPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : "Register as Producer"}
                                </Button>
                            </>
                        ) : noProducerYet && isRegistered && isConsumer ? (
                            <>
                                <p className="text-yellow-500 font-bold text-center">Already registered as Consumer</p>
                                <p className="text-xs text-white/50 text-center">You registered as a consumer. Each wallet can only have one role—you can buy from the grid but cannot become the producer.</p>
                            </>
                        ) : !noProducerYet ? (
                            <>
                                <p className="text-yellow-500 font-bold text-center">Unauthorized Role</p>
                                <p className="text-xs text-white/50 text-center">Only the registered grid producer can feed energy. You can buy from the grid as a consumer.</p>
                            </>
                        ) : null}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
                    {/* Status Indicators */}
                    <div className="space-y-6">
                        <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                        <Gauge className="h-8 w-8 text-orange-500" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-white/40 font-bold uppercase">ESP32 Status</p>
                                        <p className="text-green-500 font-black flex items-center gap-1 justify-end">
                                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Online
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] text-white/40 font-black uppercase mb-1">Live Surplus</p>
                                        <p className="text-2xl font-black tracking-tighter">2.1 kW</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-[10px] text-white/40 font-black uppercase mb-1">Max Supply</p>
                                        <p className="text-2xl font-black tracking-tighter">5.0 kW</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/20 via-transparent to-transparent border border-white/5">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info className="h-5 w-5 text-blue-400" /> Producer Perks
                            </h3>
                            <ul className="space-y-3 text-sm text-white/60">
                                <li className="flex items-start gap-2">
                                    <ArrowUpCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                                    Earn ETH instantly on every neighbor purchase.
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowUpCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                                    Dynamic pricing optimizes your revenue based on scarcity.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Feed Form */}
                    <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5 text-green-400" /> Listing Configuration
                            </CardTitle>
                            <CardDescription>Update the grid with your current surplus capacity</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/50">Supply Amount (Wh)</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="e.g. 5000"
                                        value={feedAmount}
                                        onChange={(e) => setFeedAmount(e.target.value)}
                                        className="h-14 rounded-2xl border-white/10 bg-white/5 text-xl font-bold pl-12 focus-visible:ring-green-500/50"
                                    />
                                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400" />
                                </div>
                                <p className="text-[10px] text-white/30 font-medium">This will be added to the total grid pool.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/50">Base Price (ETH / Wh)</label>
                                <Input
                                    type="number"
                                    step="0.0001"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="h-14 rounded-2xl border-white/10 bg-white/5 text-xl font-bold focus-visible:ring-blue-500/50"
                                />
                            </div>

                            <Button
                                onClick={handleFeed}
                                className="w-full h-16 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 font-black text-xl hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                                disabled={!isConnected || isFeedPending || !feedAmount || !isUserProducer}
                            >
                                {isFeedPending ? (
                                    <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Transacting...</>
                                ) : (
                                    "Update Grid Supply"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
