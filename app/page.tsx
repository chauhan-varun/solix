"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ShieldCheck, Globe, ArrowRight, BarChart3, Radio } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 blur-[120px] pointer-events-none">
            <div className="absolute top-20 left-10 w-96 h-96 bg-orange-600 rounded-full animate-pulse" />
            <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-yellow-600/50 rounded-full animate-pulse delay-700" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/40 rounded-full animate-pulse delay-1000" />
          </div>

          <div className="container relative mx-auto px-4 text-center">
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 px-4 text-sm font-medium text-orange-400 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              Live on Sepolia Testnet
            </div>

            <h1 className="mx-auto mb-8 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
              The Peer-to-Peer <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                Energy Commons
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 sm:text-xl">
              A decentralized energy grid where smart households feed surplus solar
              power directly to their neighbors. Transparent, trustless, and IoT-driven.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full bg-white px-8 text-lg font-bold text-black hover:bg-white/90">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Launch Dashboard <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 rounded-full border-white/20 px-8 text-lg font-bold backdrop-blur-md hover:bg-white/5">
                View the Grid
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-white/10 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { label: "Total Energy Traded", value: "1,280 kWh", icon: Zap },
                { label: "Active Producers", value: "42 Nodes", icon: Radio },
                { label: "CO2 Saved", value: "850 kg", icon: Globe },
              ].map((stat, i) => (
                <Card key={i} className="border-white/10 bg-black/40 backdrop-blur-xl">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="mb-4 rounded-2xl bg-white/5 p-4">
                      <stat.icon className="h-8 w-8 text-orange-400" />
                    </div>
                    <div className="text-4xl font-black">{stat.value}</div>
                    <div className="text-sm font-medium text-white/50">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-16 text-3xl font-bold sm:text-5xl">Built for the Energy Transition</h2>
            <div className="grid gap-12 md:grid-cols-3">
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
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-red-600 text-white shadow-xl shadow-orange-500/20">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 lg:py-32">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-600 to-red-900 px-8 py-20 text-center shadow-2xl">
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-6xl">Ready to join the grid?</h2>
              <p className="mb-10 text-xl text-white/80">
                Start selling your surplus solar or buy green energy directly from your community.
                The future is decentralized.
              </p>
              <Button asChild size="lg" className="h-16 rounded-full bg-white px-10 text-xl font-bold text-black hover:bg-white/90">
                <Link href="/dashboard">Connect Wallet Now</Link>
              </Button>
            </div>
            {/* Background Blur Elements */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-400 opacity-20 blur-3xl" />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 text-center text-white/40">
        <p>© 2024 Solix Core. Built with ❤️ for the future of energy.</p>
      </footer>
    </div>
  );
}
