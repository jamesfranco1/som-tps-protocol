"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Player from "../../components/Player";
import FeedViewer from "../../components/FeedViewer";
import TextViewer from "../../components/TextViewer";
import WalletPanel from "../../components/WalletPanel";
import TxLog from "../../components/TxLog";

const API = process.env.NEXT_PUBLIC_API_URL || "";

function ContentViewer({ content, isPlaying }) {
  if (content.type === "feed") {
    return <FeedViewer isPlaying={isPlaying} entries={content.entries} />;
  }
  if (content.type === "analysis") {
    return <TextViewer isPlaying={isPlaying} body={content.body} />;
  }
  return <Player isPlaying={isPlaying} videoUrl={content.videoUrl} />;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function WatchPage() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [mode, setMode] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const pollingRef = useRef(null);
  const statusRef = useRef(null);
  const countdownRef = useRef(null);

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
    if (countdownRef.current) clearInterval(countdownRef.current);
    pollingRef.current = null;
    statusRef.current = null;
    countdownRef.current = null;
  }, []);

  const handleApprovalSuccess = useCallback(({ mode: payMode, durationSeconds } = {}) => {
    setTransactions([]);
    setMode(payMode);

    if (payMode === "upfront") {
      setIsPlaying(true);
      setRemaining(durationSeconds);

      countdownRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
            setIsPlaying(false);
            setMode(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
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
    }
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setTransactions([]);
    setMode(null);
    setRemaining(0);
    stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    if (!isPlaying || mode !== "streaming") return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${API}/logs`);
        const logs = await res.json();
        setTransactions(logs);
      } catch (_) {}
    }, 2000);
    pollingRef.current = poll;
    return () => clearInterval(poll);
  }, [isPlaying, mode]);

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

  const typeLabel =
    content.type === "feed"
      ? "Live Feed"
      : content.type === "analysis"
      ? "Analysis"
      : "Video";

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
              <ContentViewer content={content} isPlaying={isPlaying} />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold">{content.title}</h1>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-neutral-700 px-1.5 py-0.5 rounded">
                  {typeLabel}
                </span>
                {content.isAgent && (
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-neutral-700 px-1.5 py-0.5 rounded">
                    Agent
                  </span>
                )}
              </div>
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

              {mode === "upfront" && isPlaying && remaining > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <div className="text-xs text-gray-500 mb-1">Time remaining</div>
                  <div className="text-2xl font-mono text-white tabular-nums">
                    {formatTime(remaining)}
                  </div>
                  <div className="mt-2 w-full h-[2px] bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-1000 ease-linear"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {mode === "streaming" && (
              <div className="glass p-6">
                <TxLog transactions={transactions} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
