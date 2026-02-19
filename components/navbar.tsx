"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
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
                                        className="rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button" className="rounded-full border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10">
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
    chain: { name?: string; hasIcon?: boolean; iconUrl?: string; iconBackground?: string };
    openAccountModal: () => void;
    openChainModal: () => void;
}) {
    const { data: balance } = useBalance({ address: account.address as `0x${string}` });
    const balanceFormatted = balance?.value !== undefined
        ? parseFloat(formatEther(balance.value)).toFixed(4)
        : "0.0000";

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={openChainModal}
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/90 hover:bg-white/5 transition-colors"
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
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
                <span className="font-bold">{balanceFormatted} ETH</span>
                <span className="text-white/70">{account.displayName}</span>
            </button>
        </div>
    );
}
