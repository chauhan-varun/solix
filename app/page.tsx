"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ShieldCheck, Globe, ArrowRight, BarChart3, Radio, Wallet, ShoppingCart, BarChart } from "lucide-react";
import Link from "next/link";

type FlowStep =
  | { step: number; title: string; desc: string; icon: typeof Globe; route: string; routeLabel: string }
  | { step: number; title: string; desc: string; icon: typeof Zap; routes: { label: string; href: string }[] };

const FLOW_STEPS: FlowStep[] = [
  {
    step: 1,
    title: "Land on Solix",
    desc: "Discover the P2P energy commons. Read the value proposition and explore.",
    icon: Globe,
    route: "/dashboard",
    routeLabel: "Get Started",
  },
  {
    step: 2,
    title: "Connect Wallet",
    desc: "Connect MetaMask or any Web3 wallet. Switch to Sepolia testnet.",
    icon: Wallet,
    route: "/dashboard",
    routeLabel: "Connect",
  },
  {
    step: 3,
    title: "Produce or Consume",
    desc: "Feed surplus solar to the grid or buy energy from neighbors. Register as Producer or Consumer.",
    icon: Zap,
    routes: [
      { label: "Feed Grid", href: "/feed-grid" },
      { label: "Buy Energy", href: "/grid" },
    ],
  },
  {
    step: 4,
    title: "Monitor & Analyze",
    desc: "Track your dashboard, energy flow, and grid analytics.",
    icon: BarChart,
    routes: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Analytics", href: "/analytics" },
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid pointer-events-none -z-10" aria-hidden />

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-36 pb-24 lg:pt-56 lg:pb-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 blur-[120px] pointer-events-none">
            <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/30 rounded-full animate-pulse" />
            <div className="absolute top-40 right-10 w-[600px] h-[600px] bg-primary/25 rounded-full animate-pulse delay-700" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/20 rounded-full animate-pulse delay-1000" />
          </div>

          <div className="container relative mx-auto px-4 text-center">
            <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-2xl border border-border bg-card/80 py-3 px-6 text-base font-semibold text-primary clay">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
              Live on Sepolia Testnet
            </div>

            <h1 className="mx-auto mb-10 max-w-5xl text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl leading-[1.05]">
              Peer-to-Peer <br />
              <span className="text-primary">Energy Trading Platform</span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground sm:text-2xl leading-relaxed">
              Solix is a decentralized energy marketplace where smart meters stream real-time
              renewable energy data and blockchain smart contracts automate transparent peer-to-peer trading.
            </p>

            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
              <Button asChild size="lg" className="h-16 rounded-2xl px-10 text-lg font-bold">
                <Link href="/dashboard" className="flex items-center gap-3">
                  Launch Dashboard <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 rounded-2xl px-10 text-lg font-bold">
                <Link href="/grid" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> View the Grid
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* User Flow Section */}
        <section className="py-24 lg:py-32 border-y border-border bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-5xl lg:text-6xl text-foreground mb-4">How it works</h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Your journey from discovery to trading energy on the grid
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {FLOW_STEPS.map((item, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-black text-primary/10">{item.step}</div>
                  <CardContent className="relative p-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 clay">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{item.desc}</p>
                    {"routes" in item && item.routes ? (
                      <div className="flex flex-wrap gap-2">
                        {item.routes.map((r) => (
                          <Button key={r.href} asChild size="sm" variant="secondary" className="rounded-xl">
                            <Link href={r.href}>{r.label}</Link>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Button asChild size="sm" variant="secondary" className="rounded-xl">
                        <Link href={"route" in item ? item.route : "/"}>{("routeLabel" in item ? item.routeLabel : "Go")}</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { label: "Total Energy Traded", value: "1,280 kWh", icon: Zap },
                { label: "Active Producers", value: "42 Nodes", icon: Radio },
                { label: "CO2 Saved", value: "850 kg", icon: Globe },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardContent className="flex flex-col items-center p-10 text-center">
                    <div className="mb-6 rounded-2xl bg-primary/10 p-5 clay">
                      <stat.icon className="h-10 w-10 text-primary" />
                    </div>
                    <div className="text-4xl lg:text-5xl font-black text-foreground mb-2">{stat.value}</div>
                    <div className="text-base font-medium text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 lg:py-32 border-y border-border bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-16 text-3xl font-bold sm:text-5xl lg:text-6xl text-foreground">Built for the Energy Transition</h2>
            <div className="grid gap-12 lg:gap-16 md:grid-cols-3">
              {[
                {
                  title: "IoT Smart Meter",
                  desc: "ESP32 sensors track your solar production and home usage in real-time, pushing data to our secure dashboard.",
                  icon: Radio,
                },
                {
                  title: "Smart Contracts",
                  desc: "Energy is fed into the grid and purchased via verified Ethereum Sepolia contracts. No middlemen, just code.",
                  icon: ShieldCheck,
                },
                {
                  title: "Dynamic Pricing",
                  desc: "Prices adjust automatically based on grid supply and demand, ensuring fair rates for both producers and consumers.",
                  icon: BarChart3,
                },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground clay">
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 lg:py-40">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-24 lg:py-32 text-center text-primary-foreground clay">
            <div className="relative z-10 mx-auto max-w-4xl">
              <h2 className="mb-8 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">Ready to join the grid?</h2>
              <p className="mb-12 text-xl lg:text-2xl opacity-90 leading-relaxed">
                Start selling your surplus solar or buy green energy directly from your community.
                The future is decentralized.
              </p>
              <Button asChild size="lg" className="h-16 rounded-2xl bg-primary-foreground text-primary px-12 text-xl font-bold shadow-xl hover:bg-primary-foreground/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-0">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Connect Wallet Now <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </div>
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-foreground opacity-10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary-foreground opacity-10 blur-3xl" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-16 text-center text-muted-foreground">
        <p className="text-base">© 2025 Solix Core. Built with ❤️ for the future of energy.</p>
      </footer>
    </div>
  );
}
