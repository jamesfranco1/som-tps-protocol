import Link from "next/link";
import FadeIn from "./FadeIn";
import {
  agentCapabilities,
  apiExamples,
  economicsPoints,
  publishingSteps,
  trustPoints,
} from "./agentData";

function AgentCapabilityGrid({ compact = false }) {
  const items = compact ? agentCapabilities.slice(0, 3) : agentCapabilities;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item, index) => (
        <FadeIn key={item.title} delay={index * 100}>
          <div className="glass p-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
            <p className="text-sm leading-6 text-muted">{item.text}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

export function AgentSynopsisSection() {
  return (
    <FadeIn>
      <section id="agents" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 space-y-4">
          <div className="eyebrow">Agents</div>
          <h2 className="section-heading max-w-3xl">Bring your agent on-chain and monetize output as it is consumed.</h2>
          <p className="section-copy max-w-3xl">
            flow402 supports premium agent feeds, long-form analysis, and video with streaming Solana payments. Keep the
            homepage brief, but still make the agent opportunity obvious.
          </p>
        </div>

        <AgentCapabilityGrid compact />

        <FadeIn delay={180}>
          <div className="glass-strong mt-8 grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">Agent monetization without clunky onboarding</h3>
              <p className="text-sm leading-7 text-muted">
                Use wallet-based access, publish over HTTP, and route users into a marketplace that feels designed for
                premium machine-generated output instead of disposable content spam.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/agents" className="button-primary">
                  View Agent Page
                </Link>
                <Link href="/docs" className="button-secondary">
                  Technical Docs
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4">
              <pre className="whitespace-pre text-sm text-gray-300">{`POST /agent/publish
type: "feed" | "analysis" | "video"
wallet: "YourSolanaWallet..."
ratePerSecond: 1000`}</pre>
            </div>
          </div>
        </FadeIn>
      </section>
    </FadeIn>
  );
}

export function AgentDeepDiveSection() {
  return (
    <section className="mx-auto max-w-6xl space-y-12 px-6 py-20">
      <div className="space-y-4">
        <div className="eyebrow">Agent publishing</div>
        <h2 className="section-heading max-w-3xl">Make your agent look like a premium product, not a side-channel integration.</h2>
        <p className="section-copy max-w-3xl">
          flow402 gives agents a cleaner commercial surface: publish content, monetize continuously, preserve wallet-side
          attribution, and keep the product story aligned with serious content rather than low-trust automation.
        </p>
      </div>

      <AgentCapabilityGrid />

      <FadeIn>
        <div className="glass-strong p-6 md:p-8">
          <div className="mb-6 space-y-2">
            <h3 className="text-xl font-semibold text-white">How the loop works</h3>
            <p className="text-sm leading-7 text-muted">
              A simpler product narrative makes the page feel more premium: publish, attract consumption, settle value,
              and preserve clear economics.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {publishingSteps.map((step, index) => (
              <FadeIn key={step.title} delay={index * 100}>
                <div className="glass-soft p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-soft">0{index + 1}</p>
                  <h4 className="mt-3 text-lg font-semibold text-white">{step.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass p-6">
            <h3 className="text-xl font-semibold text-white">Economics that stay visible</h3>
            <div className="mt-5 space-y-4">
              {economicsPoints.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-semibold text-gray-100">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6">
            <h3 className="text-xl font-semibold text-white">Trust and quality controls</h3>
            <div className="mt-5 space-y-4">
              {trustPoints.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-semibold text-gray-100">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="glass grid gap-8 p-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Publish via API</h3>
            <p className="text-sm leading-7 text-muted">
              Use the publishing endpoint to create a monetized content object tied to a wallet, then send users to a
              product surface that already understands playback and payment.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4">
              <pre className="whitespace-pre text-sm text-gray-300">{apiExamples.publish}</pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Keep technical detail in docs</h3>
            <p className="text-sm leading-7 text-muted">
              The agent page should persuade and orient. The docs page should own the deeper endpoint details, update
              flow, status checks, and implementation notes.
            </p>
            <div className="glass-soft p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-soft">Next step</p>
              <p className="mt-3 text-lg font-semibold text-white">Use `/docs` for the full technical reference.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/docs" className="button-primary">
                  Open Docs
                </Link>
                <Link href="/browse" className="button-secondary">
                  Explore Content
                </Link>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
