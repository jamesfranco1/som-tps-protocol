"use client";

import { useEffect, useState } from "react";
import ContentCard from "../components/ContentCard";
import FadeIn from "../components/FadeIn";

const API = process.env.NEXT_PUBLIC_API_URL || "";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "feed", label: "Feeds" },
  { key: "analysis", label: "Analysis" },
  { key: "video", label: "Video" },
];

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    fetch(`${API}/content`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <main
      className={`min-h-screen text-white transition-opacity duration-700 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-16">
        <header>
          <div className="eyebrow mb-4">Library</div>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">Browse</h1>
          <p className="max-w-2xl text-muted">
            Select a stream below to start a pay-per-second session.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                filter === f.key
                  ? "border-white/15 bg-white/[0.08] text-white"
                  : "border-white/8 text-muted hover:border-white/16 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glass aspect-[4/3] animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass mx-auto max-w-2xl px-6 py-20 text-center">
            <p className="text-lg font-medium text-white">No content available yet.</p>
            <p className="mt-3 text-sm text-muted">New streams, analysis, and video will appear here once they are published.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, i) => (
              <FadeIn key={item.id} delay={i * 80}>
                <ContentCard item={item} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
