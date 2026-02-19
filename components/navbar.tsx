"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch — only render theme toggle after mount
    useEffect(() => { setMounted(true); }, []);

    const isDark = theme === "dark";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl shadow-sm transition-colors duration-300">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-md transition-colors duration-300 ${isDark
                            ? "bg-gradient-to-br from-teal-500 to-cyan-500 shadow-teal-500/20"
                            : "bg-indigo-500 shadow-indigo-200"
                        }`}>
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">Solix</span>
                </Link>

                {/* Nav Links + Controls */}
                <div className="flex items-center gap-6">
                    <Link href="/grid" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Grid
                    </Link>
                    <Link href="/analytics" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Analytics
                    </Link>

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            aria-label="Toggle theme"
                            className={`relative inline-flex h-8 w-14 items-center rounded-full border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isDark
                                    ? "bg-teal-500/20 border-teal-500/30"
                                    : "bg-indigo-100 border-indigo-200"
                                }`}
                        >
                            <span className={`absolute left-1 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-all duration-300 ${isDark
                                    ? "translate-x-6 bg-teal-400 text-[#0B0F14]"
                                    : "translate-x-0 bg-white text-indigo-500"
                                }`}>
                                {isDark
                                    ? <Moon className="h-3.5 w-3.5" />
                                    : <Sun className="h-3.5 w-3.5" />
                                }
                            </span>
                        </button>
                    )}

                    <ConnectButton />
                </div>
            </div>
        </nav>
    );
}
