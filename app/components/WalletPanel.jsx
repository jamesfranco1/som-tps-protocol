"use client";

import { useEffect, useState, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { wrapAndApprove } from "../utils/solana";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function WalletPanel({
  content,
  onApprovalSuccess,
  onStop,
  isStreaming,
}) {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState(null);
  const [mounted, setMounted] = useState(false);

  const gatewayPubkey = useMemo(
    () => process.env.NEXT_PUBLIC_GATEWAY_PUBKEY || "",
    []
  );
  const ratePerSecond = content?.ratePerSecond || 1000;
  const rateSol = (ratePerSecond / 1e9).toFixed(6);
  const creatorShare = (ratePerSecond / 2 / 1e9).toFixed(6);
  const burnShare = creatorShare;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!connected || !publicKey || !connection) return;
    let cancelled = false;

    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey);
        if (!cancelled) setBalance(lamports / 1e9);
      } catch (_) {}
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [connected, publicKey, connection]);

  async function handleApprove() {
    if (!connected || !publicKey) return;
    setBusy(true);
    try {
      await wrapAndApprove({
        userPublicKey: publicKey,
        sendTransaction,
        connection,
        gatewayPubkey,
        amountLamports: ratePerSecond * 600,
      });

      await fetch(`${API}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPubkey: publicKey.toString(),
          creatorWallet: content.creatorWallet,
        }),
      });

      if (onApprovalSuccess) onApprovalSuccess();
    } catch (e) {
      console.error(e);
      alert("Approval failed: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleStop() {
    try {
      await fetch(`${API}/stop`, { method: "POST" });
    } catch (_) {}
    if (onStop) onStop();
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Wallet & Session</h3>
      <div className="flex items-center gap-3 mb-4">
        {mounted && <WalletMultiButtonDynamic />}
      </div>

      {publicKey && (
        <div className="text-xs text-gray-400 mb-4 break-all">
          {publicKey.toString()}
        </div>
      )}

      {connected && publicKey && (
        <>
          {balance !== null && (
            <div className="text-sm text-gray-300 mb-4">
              Balance: <b>{balance.toFixed(4)} SOL</b>
            </div>
          )}

          <div className="text-sm text-gray-300 mb-2">
            Rate: <b>{rateSol} SOL/s</b>
          </div>
          <div className="text-xs text-gray-500 mb-4 space-y-1">
            <div>
              Creator: {creatorShare} SOL/s &middot; Burn: {burnShare} SOL/s
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="button-primary disabled:opacity-50"
              disabled={!connected || isStreaming || busy}
              onClick={handleApprove}
            >
              {busy
                ? "Approving\u2026"
                : isStreaming
                ? "Streaming Active"
                : "Approve & Start"}
            </button>

            <button
              className="button-stop disabled:opacity-50"
              disabled={!isStreaming}
              onClick={handleStop}
            >
              Stop
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            {isStreaming
              ? "Streaming payments active \u2014 paying per second."
              : "Grant permission to start streaming token payments."}
          </p>
        </>
      )}
    </div>
  );
}
