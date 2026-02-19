"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap } from "lucide-react";
import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600 shadow-lg shadow-orange-500/20">
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Solix</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/grid" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                        Grid
                    </Link>
                    <Link href="/analytics" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                        Analytics
                    </Link>
                    <ConnectButton />
                </div>
            </div>
        </nav>
    );
}
