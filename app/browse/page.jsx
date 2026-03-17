"use client";

import { useEffect, useState } from "react";
import ContentCard from "../components/ContentCard";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/content`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <header>
          <h1 className="text-3xl font-bold mb-2">Browse</h1>
          <p className="text-gray-400">
            Select a stream below to start a pay-per-second session.
          </p>
        </header>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="glass animate-pulse aspect-[4/3] rounded-xl"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center py-24">
            No content available yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
