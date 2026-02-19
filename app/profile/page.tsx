"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Wallet, Shield, Settings, CheckCircle2, Copy } from "lucide-react";
import { useAccount } from "wagmi";
import { toast } from "sonner";

export default function ProfilePage() {
    const { isConnected, address } = useAccount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            toast.success("Address copied to clipboard");
        }
    };

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto flex h-[80vh] flex-col items-center justify-center p-4">
                    <Wallet className="mb-6 h-16 w-16 text-white/20" />
                    <h1 className="mb-4 text-3xl font-bold">Connect your wallet</h1>
                    <p className="text-white/50 mb-8 text-center max-w-md">
                        Please connect your wallet to view and manage your grid identity.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <Navbar />

            <main className="container mx-auto px-4 pt-24 max-w-4xl">
                <div className="mb-10 flex items-center gap-6">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 p-[2px]">
                        <div className="h-full w-full rounded-[1.4rem] bg-black flex items-center justify-center">
                            <User className="h-12 w-12 text-white/80" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">My Profile</h1>
                        <div className="flex items-center gap-2 text-white/50 font-mono bg-white/5 px-3 py-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors" onClick={copyAddress}>
                            {address} <Copy className="h-3 w-3" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Identity Card */}
                    <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Shield className="h-5 w-5 text-orange-400" /> Grid Identity
                            </CardTitle>
                            <CardDescription>Verified blockchain credentials</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                    <span className="text-sm font-medium text-white/50">Current Role</span>
                                    <div className="flex items-center gap-2 font-black text-orange-400 uppercase tracking-widest text-xs">
                                        <CheckCircle2 className="h-4 w-4" /> Consumer
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                    <span className="text-sm font-medium text-white/50">Meter Status</span>
                                    <span className="text-sm font-bold text-green-400">Linked & Active</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                    <span className="text-sm font-medium text-white/50">Registration Date</span>
                                    <span className="text-sm font-bold text-white/80">Feb 18, 2024</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 text-sm font-bold uppercase tracking-widest">
                                Update Profile Info
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Settings Card */}
                    <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Settings className="h-5 w-5 text-blue-400" /> Account Settings
                            </CardTitle>
                            <CardDescription>Hardware and notification preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Linked Meter ID</label>
                                <Input defaultValue="METER_001_HACK" className="h-12 rounded-xl border-white/10 bg-white/5 font-mono" />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                <div>
                                    <p className="text-sm font-bold">Auto-Feed Grid</p>
                                    <p className="text-[10px] text-white/30 font-medium">Automatically push surplus to the grid pool</p>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-orange-600 p-1 flex justify-end cursor-pointer">
                                    <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 opacity-50">
                                <div>
                                    <p className="text-sm font-bold">Email Alerts</p>
                                    <p className="text-[10px] text-white/30 font-medium">Weekly savings reports</p>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-white/10 p-1 cursor-pointer">
                                    <div className="h-4 w-4 rounded-full bg-white/20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
