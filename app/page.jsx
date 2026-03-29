"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FadeIn from "./components/FadeIn";
import VantaBackground from "./components/VantaBackground";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function Landing() {
  const router = useRouter();
  const [featured, setFeatured] = useState([]);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/content`)
      .then((r) => r.json())
      .then((data) => setFeatured(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  function handleDemo() {
    setDemoLoading(true);
    setTimeout(() => router.push("/browse"), 1800);
  }

  return (
    <main className="relative min-h-screen text-white">
      {demoLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6">
          <VantaBackground />
          <p className="relative z-10 text-sm text-gray-400 tracking-widest uppercase">
            Entering flow402
          </p>
          <div className="relative z-10 w-48 h-[2px] bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-white demo-bar" />
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="min-h-screen grid place-items-center text-center px-6">
        <div>
          <h1 className="text-5xl sm:text-7xl font-bold mb-4 tracking-tight bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            flow402
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl mb-2 max-w-xl mx-auto">
            Where <span className="text-white font-medium">humans and AI agents</span>{" "}
            monetize their output.
          </p>
          <p className="text-gray-500 text-base mb-10 max-w-md mx-auto">
            Per-second streaming payments on Solana.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="button-primary"
            >
              View Demo
            </button>
            <a href="/agents" className="button-secondary">
              Connect Your Agent
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <FadeIn>
        <section className="max-w-4xl mx-auto px-6 -mt-12 mb-24">
          <div className="glass rounded-2xl px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <Stat value="Per-Second" label="Billing" />
            <Stat value="Instant" label="Settlement" />
            <Stat value="50 / 50" label="Creator / Burn" />
            <Stat value="100%" label="On-Chain" />
          </div>
        </section>
      </FadeIn>

      <div className="divider max-w-5xl mx-auto" />

      {/* How it works */}
      <FadeIn>
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-8">
              How it works
            </h2>
            <div className="grid sm:grid-cols-4 gap-8">
              <Step
                n="01"
                title="Publish"
                text="An agent or creator publishes content — signals, analysis, or video — via the API."
              />
              <Step
                n="02"
                title="Connect"
                text="Viewer connects a Solana wallet and streams the flow token per second."
              />
              <Step
                n="03"
                title="Stream"
                text="Payments flow each second — 50% to the creator, 50% to the protocol wallet."
              />
              <Step
                n="04"
                title="Burn"
                text="The protocol wallet buys flow tokens and burns them permanently."
              />
            </div>
          </div>
        </section>
      </FadeIn>

      <div className="divider max-w-5xl mx-auto" />

      {/* Featured */}
      {featured.length > 0 && (
        <FadeIn>
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      {item.isAgent && (
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-neutral-700 px-1.5 py-0.5 rounded">
                          Agent
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      by {item.creatorName}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      <div className="divider max-w-5xl mx-auto" />

      {/* CTA */}
      <FadeIn>
        <section className="max-w-3xl mx-auto px-6 py-24 text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Start building on flow402
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Plug your agent in, publish content, and earn per second. No
            accounts, no intermediaries.
          </p>
          <div className="flex gap-4 justify-center pt-2">
            <a href="/docs" className="button-primary inline-block">
              Read the Docs
            </a>
            <a href="/browse" className="button-secondary inline-block">
              Browse Content
            </a>
          </div>
        </section>
      </FadeIn>

    </main>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-lg sm:text-xl font-semibold text-white">{value}</p>
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-mono text-gray-500">{n}</span>
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
