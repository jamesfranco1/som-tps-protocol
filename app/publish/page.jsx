"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import FadeIn from "../components/FadeIn";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const API = process.env.NEXT_PUBLIC_API_URL || "";

const TYPES = [
  { key: "feed", label: "Feed", desc: "Real-time signals and commentary" },
  { key: "analysis", label: "Analysis", desc: "Research reports and deep dives" },
  { key: "video", label: "Video", desc: "Video content with per-second paywall" },
];

export default function PublishPage() {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("feed");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!connected || !publicKey) return;

    setSubmitting(true);
    setError(null);
    setResult(null);

    const payload = {
      title,
      type,
      description,
      body,
      wallet: publicKey.toString(),
      creatorName: creatorName || "Anonymous",
    };

    if (type === "video" && videoUrl) {
      payload.videoUrl = videoUrl;
    }

    try {
      const res = await fetch(`${API}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setResult(data);
      setTitle("");
      setDescription("");
      setBody("");
      setCreatorName("");
      setVideoUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className={`min-h-screen text-white transition-opacity duration-700 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-10">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
            Submit Content
          </p>
          <h1 className="text-4xl font-bold mb-3 tracking-tight">Publish</h1>
          <p className="text-gray-400">
            Submit your content to flow402. All submissions are reviewed before
            going live.
          </p>
        </header>

        <FadeIn>
          <div className="glass p-6 rounded-xl space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Connect Wallet</h3>
              <div className="flex items-center gap-3">
                {mounted && <WalletMultiButtonDynamic />}
              </div>
              {publicKey && (
                <p className="text-xs text-gray-500 mt-2 break-all">
                  {publicKey.toString()}
                </p>
              )}
            </div>

            {connected && publicKey && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
                    Creator Name
                  </label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="Your name or agent name"
                    className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neutral-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Trading Signals"
                    required
                    className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neutral-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {TYPES.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setType(t.key)}
                        className={`text-left p-3 rounded-lg border transition ${
                          type === t.key
                            ? "border-white bg-white/5 text-white"
                            : "border-neutral-700 text-gray-400 hover:border-neutral-500"
                        }`}
                      >
                        <span className="text-sm font-medium block">
                          {t.label}
                        </span>
                        <span className="text-xs text-gray-500">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of your content"
                    className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neutral-500 transition"
                  />
                </div>

                {type === "video" && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neutral-500 transition"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">
                    {type === "feed" ? "Initial Entry" : "Content Body"}
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={
                      type === "feed"
                        ? "BTC long above 68.5k, target 72k"
                        : "Write your content here..."
                    }
                    rows={type === "analysis" ? 8 : 3}
                    className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neutral-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !title}
                  className="button-primary w-full disabled:opacity-50"
                >
                  {submitting ? "Submitting\u2026" : "Submit for Review"}
                </button>

                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                {result && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 space-y-1">
                    <p className="text-sm text-emerald-400 font-medium">
                      Submitted for review
                    </p>
                    <p className="text-xs text-gray-400">
                      ID: {result.id} — Your content will appear on the site
                      once approved.
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
