"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ExternalLink, ArrowRight, User } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import EnergyTradingABI from "@/blockchain/out/EnergyTrading.sol/EnergyTrading.json";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function HistoryPage() {
    const { isConnected, address } = useAccount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: userTrades, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: EnergyTradingABI.abi,
        functionName: "getUserTrades",
        args: [address],
    }) as any;

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24">
                <div className="mb-10">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Trade History</h1>
                    <p className="text-white/50">A permanent, immutable record of all energy transactions on Ethereum Sepolia.</p>
                </div>

                <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">
                    <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Network Ledger</CardTitle>
                                <CardDescription>Verified grid settlement logs</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-green-400 font-black tracking-widest uppercase text-[10px] px-3">
                                Live Sync
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-white/40 font-bold uppercase text-xs w-[120px]">Type</TableHead>
                                    <TableHead className="text-white/40 font-bold uppercase text-xs">Amount</TableHead>
                                    <TableHead className="text-white/40 font-bold uppercase text-xs">Total Price</TableHead>
                                    <TableHead className="text-white/40 font-bold uppercase text-xs">Partner</TableHead>
                                    <TableHead className="text-white/40 font-bold uppercase text-xs text-right">Blockchain</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isConnected && userTrades?.length > 0 ? (
                                    userTrades.map((trade: any, i: number) => {
                                        const isBuyer = trade.buyer.toLowerCase() === address?.toLowerCase();
                                        return (
                                            <TableRow key={i} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                                                <TableCell>
                                                    <Badge variant="outline" className={isBuyer ? "border-blue-500/20 bg-blue-500/10 text-blue-400" : "border-green-500/20 bg-green-500/10 text-green-400"}>
                                                        {isBuyer ? "Purchase" : "Sale"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-bold">{trade.energyAmount.toString()} Wh</TableCell>
                                                <TableCell className="font-black text-orange-400">{formatEther(trade.totalPrice)} ETH</TableCell>
                                                <TableCell className="font-mono text-xs text-white/50">
                                                    {isBuyer ? `Producer ${trade.producer.slice(0, 6)}...` : `Consumer ${trade.buyer.slice(0, 6)}...`}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/5">
                                                        <ExternalLink className="h-4 w-4 text-white/40" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-white/20 italic font-medium">
                                            {isLoading ? "Fetching records..." : "No trade records found on this network node."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="mt-8 p-6 rounded-3xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                            <User className="h-6 w-6 text-white/40" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Node Identity Verified</p>
                            <p className="text-[10px] text-white/30 uppercase font-black">Contract verified on Sepolia Etherscan</p>
                        </div>
                    </div>
                    <Zap className="h-6 w-6 text-white/10" />
                </div>
            </main>
        </div>
    );
}
