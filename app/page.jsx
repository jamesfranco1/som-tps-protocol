"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function Landing() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch(`${API}/content`)
      .then((r) => r.json())
      .then((data) => setFeatured(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  return (
    <main className="relative min-h-screen text-white">
      {/* Hero */}
      <section className="min-h-screen grid place-items-center text-center px-6">
        <div>
          <h1 className="text-5xl sm:text-6xl font-semibold mb-4 tracking-tight">
            Flow402x
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            An open protocol for{" "}
            <span className="text-white">streaming-native payments</span>.
            Per-second, frictionless settlement for digital content — powered
            by Solana.
          </p>

          <div className="flex gap-4 justify-center">
            <a href="/browse" className="button-primary">
              Browse Content
            </a>
            <a href="#overview" className="button-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section
        id="overview"
        className="max-w-5xl mx-auto px-6 py-24 space-y-16"
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-100">
            Pay only for what you watch
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-3xl">
            Flow402x enables continuous, per-second billing for video and
            digital content. No subscriptions, no accounts, no intermediaries.
            Payments flow in real time and stop instantly when you do.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <Feature
            title="Per-Second Billing"
            text="Granular, transparent payments. You pay exactly for the time you consume."
          />
          <Feature
            title="Instant Settlement"
            text="Payments settle on Solana in real time. No waiting, no holds."
          />
          <Feature
            title="Creator Revenue"
            text="50% of every payment goes directly to the content creator."
          />
          <Feature
            title="Deflationary"
            text="The other 50% buys back FLOW tokens and burns them permanently."
          />
          <Feature
            title="No Accounts"
            text="Connect a Solana wallet. That's it. No registration, no profiles."
          />
          <Feature
            title="Open Protocol"
            text="Built on HTTP 402 and standard Solana primitives. Fully composable."
          />
        </div>
      </section>

      {/* Architecture */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12 space-y-16">
        <div className="glass p-6 rounded-xl space-y-6">
          <h2 className="text-2xl font-semibold text-gray-100">How it works</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              <b>Connect:</b> Viewer connects their Solana wallet and wraps a
              small amount of SOL.
            </li>
            <li>
              <b>Approve:</b> A single transaction wraps SOL into wSOL and
              grants a capped allowance to the gateway.
            </li>
            <li>
              <b>Stream:</b> The server transfers wSOL each second — 50% to the
              creator, 50% to the agent wallet.
            </li>
            <li>
              <b>Burn:</b> The agent wallet automatically buys FLOW tokens and
              burns them via PumpFun.
            </li>
          </ul>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-24 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-100">
              Featured Content
            </h2>
            <a
              href="/browse"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              View all &rarr;
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featured.map((item) => (
              <a
                key={item.id}
                href={`/watch/${item.id}`}
                className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-800">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                      {item.title}
                    </div>
                  )}
                </div>
                <div className="p-5 text-left">
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-16 border-t border-neutral-800">
        &copy; 2026 Flow402x — open-source protocol built on Solana.
      </footer>
    </main>
  );
}

function Feature({ title, text }) {
  return (
    <div className="glass p-6 rounded-xl space-y-2">
      <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
      <p className="text-gray-400">{text}</p>
    </div>
  );
}
