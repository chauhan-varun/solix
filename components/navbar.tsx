"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalance } from "wagmi";
import { formatEther } from "viem";
import { Zap, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const isDark = theme === "dark";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl clay">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground clay">
                        <Zap className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">Solix</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/grid" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Grid
                    </Link>
                    <Link href="/analytics" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Analytics
                    </Link>

                    {mounted && (
                        <button
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            aria-label="Toggle theme"
                            className="flex h-9 w-9 items-center justify-center rounded-xl clay border border-border/50 bg-card text-foreground hover:opacity-90 transition-opacity"
                        >
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    )}

                    <ConnectButton.Custom>
                        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                            const ready = mounted;
                            const connected = ready && account && chain && !chain.unsupported;

                            if (!ready) return null;

                            if (!connected) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        type="button"
                                        className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors clay"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button" className="rounded-xl border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 clay">
                                        Wrong network
                                    </button>
                                );
                            }

                            return (
                                <WalletBalanceButton
                                    account={account}
                                    chain={chain}
                                    openAccountModal={openAccountModal}
                                    openChainModal={openChainModal}
                                />
                            );
                        }}
                    </ConnectButton.Custom>
                </div>
            </div>
        </nav>
    );
}

function WalletBalanceButton({
    account,
    chain,
    openAccountModal,
    openChainModal,
}: {
    account: { address: string; displayName: string; ensAvatar?: string };
    chain: { id?: number; name?: string; hasIcon?: boolean; iconUrl?: string; iconBackground?: string };
    openAccountModal: () => void;
    openChainModal: () => void;
}) {
    const { data: balance } = useBalance({
        address: account?.address as `0x${string}`,
        chainId: chain?.id,
    });
    const rawEth = balance?.value != null ? parseFloat(formatEther(balance.value)) : 0;
    const balanceFormatted = Number.isFinite(rawEth) ? rawEth.toFixed(4) : "0.0000";

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={openChainModal}
                type="button"
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors clay"
            >
                {chain.hasIcon && chain.iconUrl && (
                    <div className="h-4 w-4 rounded-full overflow-hidden" style={{ background: chain.iconBackground }}>
                        <img alt={chain.name} src={chain.iconUrl} className="h-4 w-4" />
                    </div>
                )}
                <span className="hidden sm:inline">{chain.name}</span>
            </button>
            <button
                onClick={openAccountModal}
                type="button"
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors clay"
            >
                <span className="font-bold">{balanceFormatted} ETH</span>
                <span className="text-muted-foreground">{account.displayName}</span>
            </button>
        </div>
    );
}
