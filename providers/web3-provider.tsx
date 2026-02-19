"use client";

import * as React from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";

import "@rainbow-me/rainbowkit/styles.css";

const config = createConfig({
    chains: [sepolia],
    connectors: [injected()],
    ssr: true,
    transports: {
        [sepolia.id]: http(
            `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
        ),
    },
});

const queryClient = new QueryClient();

function RainbowKitWithTheme({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const theme = resolvedTheme === "dark" ? darkTheme() : lightTheme({ accentColor: "#6366f1" });
    return <RainbowKitProvider theme={theme}>{children}</RainbowKitProvider>;
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitWithTheme>{children}</RainbowKitWithTheme>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
