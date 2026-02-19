"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Globe, ArrowRight, Radio } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 blur-[100px] pointer-events-none">
            <div className="absolute top-20 left-10 w-80 h-80 bg-primary rounded-full" />
            <div className="absolute top-40 right-10 w-96 h-96 bg-accent rounded-full" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-secondary rounded-full" />
          </div>

          <div className="container relative mx-auto px-4 text-center">
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 py-1 px-4 text-sm font-medium text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Live on Sepolia Testnet
            </div>

            <h1 className="mx-auto mb-8 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
              Peer-to-Peer{" "}
              <span className="text-primary">Energy Trading Platform</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Solix is a decentralized energy marketplace where smart meters stream real-time renewable energy data and blockchain smart contracts automate transparent peer-to-peer trading.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full bg-primary hover:bg-primary/90 px-8 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Enter Energy Marketplace <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-lg font-semibold">
                Explore Live Grid Status
              </Button>
            </div>
          </div>
        </section>

        {/* Why Solix */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold sm:text-5xl">
              Why Solix?{" "}
              <span className="text-primary">Built for the Future of Energy</span>
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { emoji: "🔌", title: "Real-Time Energy Monitoring", desc: "Smart meters stream live production & consumption data for accurate trading." },
                { emoji: "🔗", title: "Blockchain-Secured Transactions", desc: "Smart contracts ensure trustless, transparent and automated energy payments." },
                { emoji: "⚖️", title: "Dynamic Market Pricing", desc: "Buy and sell energy at prices driven by supply and demand — fair and efficient." },
              ].map((item, i) => (
                <div key={i} className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                  <div className="mb-5 text-4xl">{item.emoji}</div>
                  <h3 className="mb-3 text-lg font-bold text-card-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 border-y border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { label: "Total Energy Traded", value: "1,280 kWh", icon: Zap },
                { label: "Active Producers", value: "42 Nodes", icon: Radio },
                { label: "CO2 Saved", value: "850 kg", icon: Globe },
              ].map((stat, i) => (
                <Card key={i} className="border-border shadow-sm">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-4 rounded-2xl bg-primary/10 p-4">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-black">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-3xl font-bold sm:text-5xl">
              How It <span className="text-primary">Works</span>
            </h2>
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-[2rem] top-10 bottom-10 w-px bg-border hidden md:block" />
              <div className="flex flex-col gap-8">
                {[
                  { step: "01", title: "Register & Connect Wallet", desc: "Sign up, connect your wallet, and choose your role (Producer or Consumer)." },
                  { step: "02", title: "Feed or List Energy", desc: "Producers list surplus generation from smart meters." },
                  { step: "03", title: "Trade in Real-Time", desc: "Consumers buy energy using blockchain-secured payments." },
                  { step: "04", title: "Track & Analytics", desc: "View past trades and performance on your dashboard." },
                ].map((item, i) => (
                  <div key={i} className="group flex items-start gap-6 md:gap-10">
                    <div className="relative flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary font-black text-lg text-primary-foreground shadow-md shadow-primary/20">
                      {item.step}
                    </div>
                    <div className="flex-1 rounded-2xl border border-border bg-card px-7 py-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                      <h3 className="mb-1.5 text-lg font-bold">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20 lg:py-32">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-20 text-center shadow-xl shadow-primary/20">
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="mb-6 text-4xl font-black tracking-tight text-primary-foreground sm:text-6xl">Ready to join the grid?</h2>
              <p className="mb-10 text-xl text-primary-foreground/80">
                Start selling your surplus solar or buy green energy directly from your community.
              </p>
              <Button asChild size="lg" className="h-14 rounded-full bg-background px-10 text-xl font-bold text-primary hover:bg-background/90">
                <Link href="/dashboard">Connect Wallet Now</Link>
              </Button>
            </div>
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/30 py-10 text-center text-muted-foreground text-sm">
        <p>© 2024 Solix Core. Built with ❤️ for the future of energy.</p>
      </footer>
    </div>
  );
}
