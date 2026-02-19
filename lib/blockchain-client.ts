import { createPublicClient, http, getContract } from "viem";
import { sepolia } from "viem/chains";
import EnergyTradingABI from "../blockchain/out/EnergyTrading.sol/EnergyTrading.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
});

export const getEnergyContract = () => {
    return getContract({
        address: contractAddress,
        abi: EnergyTradingABI.abi,
        client: publicClient,
    });
};
