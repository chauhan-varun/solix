import { cookies } from "next/headers";
import { getRecentReadings, getLiveStats } from "@/lib/readings";
import { DashboardClient } from "./dashboard-client";
import { WalletAddressSync } from "@/components/wallet-sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const address = cookieStore.get("wallet_address")?.value;

    let initialData = {
        history: [] as { time: string; production: number; consumption: number }[],
        live: null as { production: number; consumption: number; surplus: number } | null,
    };

    if (address) {
        const [history, live] = await Promise.all([
            getRecentReadings(address, 30),
            getLiveStats(address),
        ]);
        initialData = { history, live };
    }

    return (
        <>
            <WalletAddressSync />
            <DashboardClient initialData={initialData} />
        </>
    );
}
