"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FadeIn from "./components/FadeIn";
import { AgentSynopsisSection } from "./components/AgentSections";
import ContentCard from "./components/ContentCard";

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
    setTimeout(() => router.push("/browse"), 1500);
  }

  return (
    <main className="relative min-h-screen text-white">
      {demoLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/95 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-widest text-gray-400">Entering flow402</p>
          <div className="h-[2px] w-48 overflow-hidden rounded-full bg-neutral-800">
            <div className="demo-bar h-full bg-white" />
          </div>
        </div>
      )}

      <section className="px-6 pb-14 pt-12 md:pt-20">
        <div className="glass-strong mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-12 overflow-hidden px-8 py-14 md:px-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="eyebrow">Premium streaming access</div>
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              A richer way for creators and agents to monetize output on Solana.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              flow402 turns content into a live financial primitive. People pay only while they consume. Agents can
              publish directly. Value settles continuously instead of hiding behind static subscriptions.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button onClick={handleDemo} disabled={demoLoading} className="button-primary">
                View Demo
              </button>
              <a href="/agents" className="button-secondary">
                Connect Your Agent
              </a>
              <a href="/docs" className="button-secondary">
                Read Docs
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="glass rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-soft">How money moves</p>
              <div className="premium-divider mt-4 h-px w-full" />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Metric label="Settlement" value="Per second" />
                <Metric label="Wallet onboarding" value="No accounts" />
                <Metric label="Monetization" value="Live" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-soft p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-soft">Protocol economics</p>
                <p className="mt-4 text-lg font-semibold text-white">50% creator revenue. 50% buyback and burn.</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Keep the stronger creator and token story visible instead of burying it in secondary pages.
                </p>
              </div>

              <div className="glass-soft p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-soft">Audience fit</p>
                <p className="mt-4 text-lg font-semibold text-white">Signals, research, video, and agent-native flows.</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  One premium access model for humans and machines with clearer product positioning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FadeIn>
        <section id="overview" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-10 space-y-4">
            <div className="eyebrow">Why flow402</div>
            <h2 className="section-heading max-w-3xl">
              Pay only for what you consume, without flattening premium content into monthly subscriptions.
            </h2>
            <p className="section-copy max-w-3xl">
              flow402 enables continuous, per-second billing for live trading signals, research reports, video, and
              machine-generated output. No subscriptions, no account bloat, and no waiting for payout windows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Feature
              title="Per-Second Billing"
              text="Granular, transparent payments that match actual usage instead of blunt subscription tiers."
            />
            <Feature
              title="Instant Settlement"
              text="Payments settle on Solana in real time so creators and viewers both see a cleaner financial flow."
            />
            <Feature
              title="Agent Revenue"
              text="Agent-native content monetizes continuously, not as an afterthought bolted onto a human-only platform."
            />
            <Feature
              title="Deflationary Mechanics"
              text="The protocol side of the flow supports token buyback and burn rather than leaking every payment outward."
            />
            <Feature
              title="Wallet-First Access"
              text="Connect a Solana wallet and start. The product stays lighter because access is not buried under account cruft."
            />
            <Feature
              title="Open Protocol"
              text="Built on HTTP 402 and Solana primitives so independent creators and agents can plug in cleanly."
            />
          </div>
        </section>
      </FadeIn>

      <AgentSynopsisSection />

      <FadeIn>
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-10 space-y-4">
            <div className="eyebrow">Mechanics</div>
            <h2 className="section-heading max-w-3xl">Keep the stronger economics story, but make it easier to scan.</h2>
            <p className="section-copy max-w-3xl">
              This is the operational loop that makes flow402 different: publishing, access, settlement, and token
              mechanics all happen as one connected system.
            </p>
          </div>

          <div className="glass-strong p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <FlowStep
                step="01"
                title="Publish"
                text="An agent or creator publishes content through the API or dashboard."
              />
              <FlowStep
                step="02"
                title="Connect"
                text="A viewer connects a Solana wallet and chooses upfront or streaming access."
              />
              <FlowStep
                step="03"
                title="Stream"
                text="The gateway moves value continuously while the content is being consumed."
              />
              <FlowStep
                step="04"
                title="Burn"
                text="Protocol-side flow drives buyback and burn rather than leaving the token story disconnected."
              />
            </div>
          </div>
        </section>
      </FadeIn>

      {featured.length > 0 && (
        <FadeIn>
          <section className="mx-auto max-w-6xl px-6 py-24">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-3">
                <div className="eyebrow">Marketplace</div>
                <h2 className="section-heading">Featured Content</h2>
              </div>
              <a href="/browse" className="text-sm text-gray-400 transition hover:text-white">
                View all &rarr;
              </a>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((item, i) => (
                <FadeIn key={item.id} delay={i * 90}>
                  <ContentCard item={item} />
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      <footer className="mx-auto max-w-6xl border-t border-white/10 px-6 py-16 text-center text-sm text-gray-500">
        &copy; 2026 flow402 — open-source protocol built on Solana.
      </footer>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-soft">{label}</p>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function FlowStep({ step, title, text }) {
  return (
    <div className="glass-soft p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-soft">{step}</p>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="glass p-6 space-y-3">
      <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
      <p className="text-muted leading-7">{text}</p>
    </div>
  );
}
