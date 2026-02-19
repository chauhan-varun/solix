# ⚡ Peer-to-Peer Energy Trading Platform

A **decentralized energy grid** built on **Ethereum Sepolia** where a single producer feeds surplus solar energy into the grid, and consumers purchase it — with the producer getting paid directly via smart contracts.

> **Stack:** Next.js 14 · Solidity/Foundry · ESP32 IoT · MongoDB · RainbowKit/Wagmi

---

## System Architecture

```mermaid
graph LR
    subgraph ClientLayer ["Frontend (Next.js)"]
        UI["Web Dashboard"]
        Wagmi["Wagmi / RainbowKit"]
    end

    subgraph LogicLayer ["Backend & Storage"]
        API["Next.js API Routes"]
        DB[(MongoDB / Prisma)]
    end

    subgraph HardwareLayer ["IoT Device"]
        ESP["ESP32 Smart Meter"]
    end

    subgraph NetworkLayer ["Blockchain (Sepolia)"]
        SC["EnergyTrading Smart Contract"]
    end

    ESP -- "Push Readings" --> API
    API -- "CRUD" --> DB
    UI -- "Fetch Data" --> API
    UI -- "Sign & Transact" --> Wagmi
    Wagmi -- "Execute Tx" --> SC
```

---

## End-to-End Flow

```mermaid
flowchart TD
    subgraph IoT["🔌 ESP32 Smart Meter"]
        A["Solar Panel Readings\n(production, consumption, surplus)"]
    end

    subgraph Server["🖥️ Next.js Server (Off-Chain)"]
        B["/api/meter\n(receives ESP32 data)"]
        C[("MongoDB\n(meter readings, profiles, analytics)")]
    end

    subgraph Frontend["🌐 Web App (Browser)"]
        D["Producer Dashboard\n(live ESP32 data, surplus view)"]
        E["Grid Dashboard\n(available energy, dynamic price)"]
        F["Consumer View\n(buy energy from grid)"]
        G["Trade History & Analytics"]
    end

    subgraph Blockchain["⛓️ Ethereum Sepolia (On-Chain)"]
        H["EnergyTrading.sol"]
        I["registerUser()"]
        J["feedGrid()\n(producer pushes surplus to grid)"]
        K["buyFromGrid()\n(consumer pays, ETH goes to producer)"]
        L["getDynamicPrice()\n(supply vs demand pricing)"]
        M[("Immutable Trade Records\n(viewable on Etherscan)")]
    end

    %% ESP32 to Server
    A -- "HTTP POST every 5s\n(WiFi, same network)" --> B
    B -- "Store readings" --> C
    C -- "Fetch latest data" --> D

    %% Producer flow
    D -- "Producer clicks\n'Feed Grid'" --> J
    I -- "Register as\nProducer / Consumer" --> H
    J -- "Surplus energy\nadded to grid" --> H

    %% Consumer flow
    E -- "View grid supply\n& dynamic price" --> L
    L --> H
    F -- "Consumer clicks\n'Buy from Grid'" --> K
    K -- "ETH payment\nProducer ← Consumer" --> H
    H -- "Trade recorded" --> M

    %% Display
    M -- "Tx hash link to\nEtherscan" --> G
    C -- "Charts & stats" --> G

    %% Styling
    style IoT fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style Server fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style Frontend fill:#f3e8ff,stroke:#8b5cf6,stroke-width:2px
    style Blockchain fill:#dcfce7,stroke:#22c55e,stroke-width:2px
```

### Flow Summary

| Step | Action | Where |
|------|--------|-------|
| 1 | ESP32 smart meter sends solar readings every 5s | Off-chain (MongoDB) |
| 2 | **Producer** connects wallet & registers | On-chain (Sepolia) |
| 3 | Producer clicks **"Feed Grid"** → surplus enters the grid | On-chain (Sepolia) |
| 4 | **Consumer** connects wallet & registers | On-chain (Sepolia) |
| 5 | Consumer views grid supply & dynamic price | On-chain read |
| 6 | Consumer clicks **"Buy from Grid"** → pays ETH | On-chain (Sepolia) |
| 7 | **Producer gets paid** automatically via smart contract | On-chain (Sepolia) |
| 8 | Trade recorded permanently → viewable on Etherscan | On-chain (Sepolia) |

---

## Technical Approach (Sequence)

```mermaid
sequenceDiagram
    participant P as Producer
    participant ESP as ESP32 Meter
    participant S as Next.js Server
    participant C as Consumer
    participant SC as Smart Contract

    Note over ESP, S: Automatic Monitoring
    ESP->>S: POST /api/meter (Surplus: 5.0 kWh)
    S->>S: Update MongoDB
    
    Note over P, SC: Production Flow
    P->>SC: registerUser("Producer")
    P->>SC: feedGrid(5.0 kWh)
    Note right of SC: Grid Supply: 5.0 kWh

    Note over C, SC: Consumption Flow
    C->>SC: registerUser("Consumer")
    C->>SC: buyFromGrid(2.0 kWh) + ETH
    SC->>SC: Deduct Grid Supply: -2.0 kWh
    SC->>P: Transfer ETH Payment
    Note right of SC: Grid Supply: 3.0 kWh
```

---

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Fullstack | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Wallet | RainbowKit + Wagmi |
| Database | MongoDB (Prisma) |
| Blockchain | Solidity + Foundry |
| Network | Ethereum Sepolia Testnet |
| IoT | ESP32 (Arduino C++) |
| Charts | Recharts |
