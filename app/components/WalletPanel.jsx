"use client";

import { useEffect, useState, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import {
  wrapAndApprove,
  approveToken,
  isNativeMint,
  getTokenBalance,
} from "../utils/solana";

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
  const [solBalance, setSolBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [payWith, setPayWith] = useState("sol");
  const [config, setConfig] = useState(null);

  const gatewayPubkey = useMemo(
    () => process.env.NEXT_PUBLIC_GATEWAY_PUBKEY || "",
    []
  );

  const ratePerSecond = content?.ratePerSecond || 1000;
  const decimals = config?.tokenDecimals || 9;
  const divisor = Math.pow(10, decimals);
  const rateDisplay = (ratePerSecond / divisor).toFixed(6);
  const creatorShare = (ratePerSecond / 2 / divisor).toFixed(6);
  const burnShare = creatorShare;

  const hasToken = config && !isNativeMint(config.tokenMint);
  const payLabel = payWith === "sol" ? "SOL" : "flow";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch(`${API}/config`)
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!connected || !publicKey || !connection) return;
    let cancelled = false;

    const fetchBalances = async () => {
      try {
        const lamports = await connection.getBalance(publicKey);
        if (!cancelled) setSolBalance(lamports / 1e9);
      } catch (_) {}

      if (hasToken && config.tokenMint) {
        const tb = await getTokenBalance(
          connection,
          publicKey.toString(),
          config.tokenMint
        );
        if (!cancelled) setTokenBalance(tb);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [connected, publicKey, connection, hasToken, config]);

  async function handleApprove() {
    if (!connected || !publicKey) return;
    setBusy(true);
    try {
      if (payWith === "token" && hasToken) {
        await approveToken({
          userPublicKey: publicKey,
          sendTransaction,
          connection,
          gatewayPubkey,
          tokenMint: config.tokenMint,
          tokenDecimals: config.tokenDecimals,
          amount: ratePerSecond * 600,
        });
      } else {
        await wrapAndApprove({
          userPublicKey: publicKey,
          sendTransaction,
          connection,
          gatewayPubkey,
          amountLamports: ratePerSecond * 600,
        });
      }

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
          <div className="text-sm text-gray-300 mb-2 space-y-1">
            {solBalance !== null && (
              <div>
                SOL: <b>{solBalance.toFixed(4)}</b>
              </div>
            )}
            {hasToken && tokenBalance !== null && (
              <div>
                flow: <b>{tokenBalance.toFixed(4)}</b>
              </div>
            )}
          </div>

          {hasToken && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPayWith("sol")}
                className={`text-xs px-3 py-1 rounded border transition ${
                  payWith === "sol"
                    ? "border-white text-white bg-white/5"
                    : "border-neutral-700 text-gray-400 hover:text-white"
                }`}
              >
                Pay with SOL
              </button>
              <button
                onClick={() => setPayWith("token")}
                className={`text-xs px-3 py-1 rounded border transition ${
                  payWith === "token"
                    ? "border-white text-white bg-white/5"
                    : "border-neutral-700 text-gray-400 hover:text-white"
                }`}
              >
                Pay with flow
              </button>
            </div>
          )}

          <div className="text-sm text-gray-300 mb-2">
            Rate: <b>{rateDisplay} {payLabel}/s</b>
          </div>
          <div className="text-xs text-gray-500 mb-4 space-y-1">
            <div>
              Creator: {creatorShare} {payLabel}/s &middot; Burn: {burnShare}{" "}
              {payLabel}/s
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
