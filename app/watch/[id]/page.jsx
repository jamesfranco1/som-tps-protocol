"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Player from "../../components/Player";
import WalletPanel from "../../components/WalletPanel";
import TxLog from "../../components/TxLog";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function WatchPage() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const pollingRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/content/${id}`)
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (statusRef.current) clearTimeout(statusRef.current);
    pollingRef.current = null;
    statusRef.current = null;
  }, []);

  const handleApprovalSuccess = useCallback(() => {
    setTransactions([]);
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API}/status`);
        const data = await res.json();
        if (data.firstTransferConfirmed) {
          setIsPlaying(true);
          return;
        }
      } catch (_) {}
      statusRef.current = setTimeout(checkStatus, 1000);
    };
    checkStatus();
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setTransactions([]);
    stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    if (!isPlaying) return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${API}/logs`);
        const logs = await res.json();
        setTransactions(logs);
      } catch (_) {}
    }, 2000);
    pollingRef.current = poll;
    return () => clearInterval(poll);
  }, [isPlaying]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="glass animate-pulse w-full max-w-4xl aspect-video rounded-xl" />
      </main>
    );
  }

  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Content not found</h1>
          <a
            href="/browse"
            className="text-gray-400 hover:text-white transition text-sm"
          >
            &larr; Back to browse
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <a
          href="/browse"
          className="text-sm text-gray-500 hover:text-white transition mb-6 inline-block"
        >
          &larr; Back to browse
        </a>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass p-2 rounded-xl">
              <Player isPlaying={isPlaying} videoUrl={content.videoUrl} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold mb-1">{content.title}</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                {content.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                by {content.creatorName}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6">
              <WalletPanel
                content={content}
                onApprovalSuccess={handleApprovalSuccess}
                onStop={handleStop}
                isStreaming={isPlaying}
              />
            </div>
            <div className="glass p-6">
              <TxLog transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
