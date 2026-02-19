"use client";

import { useAccount } from "wagmi";
import { useEffect } from "react";

/**
 * Syncs the connected wallet address to a cookie so the server can use it for SSR data fetching.
 */
export function WalletAddressSync() {
    const { address } = useAccount();

    useEffect(() => {
        if (address) {
            document.cookie = `wallet_address=${address}; path=/; max-age=86400; SameSite=Lax`;
        } else {
            document.cookie = `wallet_address=; path=/; max-age=0`;
        }
    }, [address]);

    return null;
}
