import { DashboardClient } from "./dashboard-client";
import { WalletAddressSync } from "@/components/wallet-sync";

/**
 * Dashboard page - no direct database access.
 * All data is fetched via /api/readings (Prisma used only in API routes).
 */
export default function DashboardPage() {
    return (
        <>
            <WalletAddressSync />
            <DashboardClient />
        </>
    );
}
