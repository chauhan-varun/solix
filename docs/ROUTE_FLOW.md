# Solix Route Flow

## Default Route (`/`)

The landing page at `/` is the entry point for new users. Here's the intended flow:

### 1. **Land on Solix** (You are here)
- User arrives at the homepage
- Sees value proposition: "The Peer-to-Peer Energy Commons"
- Learns about decentralized energy trading
- **Primary CTA:** Launch Dashboard → `/dashboard`
- **Secondary CTA:** View the Grid → `/grid`

### 2. **Connect Wallet**
- User clicks "Launch Dashboard" or "Connect Wallet Now"
- Redirected to `/dashboard`
- Connects MetaMask or Web3 wallet
- Must switch to **Sepolia testnet**

### 3. **Produce or Consume**
- **Producers:** Link ESP32 meter → Register as Producer → Feed surplus solar
  - Route: `/feed-grid`
- **Consumers:** Browse grid → Register as Consumer → Buy energy
  - Route: `/grid`

### 4. **Monitor & Analyze**
- **Dashboard** (`/dashboard`): Live production, usage, surplus, earnings, chart, grid activity
- **Analytics** (`/analytics`): Network-wide stats, supply vs demand, price discovery

## Route Map

| Route | Purpose |
|-------|---------|
| `/` | Landing page, value prop, CTAs |
| `/dashboard` | Personal energy dashboard (requires wallet) |
| `/grid` | Buy energy from the grid |
| `/feed-grid` | Feed surplus solar to the grid |
| `/analytics` | Grid-wide analytics and charts |
| `/history` | Transaction history |
| `/profile` | User profile |
