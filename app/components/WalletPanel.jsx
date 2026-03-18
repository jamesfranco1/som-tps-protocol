"use client";

import { useEffect, useState, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import {
  payUpfrontSOL,
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

const DURATIONS = [
  { label: "1 min", seconds: 60 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
];

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
  const [duration, setDuration] = useState(DURATIONS[0]);

  const gatewayPubkey = useMemo(
    () => process.env.NEXT_PUBLIC_GATEWAY_PUBKEY || "",
    []
  );

  const ratePerSecond = content?.ratePerSecond || 1000;
  const hasToken = config && !isNativeMint(config.tokenMint);

  const solCostLamports = ratePerSecond * duration.seconds;
  const solCostDisplay = (solCostLamports / 1e9).toFixed(6);
  const solCreatorShare = (Math.floor(solCostLamports / 2) / 1e9).toFixed(6);
  const solBurnShare = ((solCostLamports - Math.floor(solCostLamports / 2)) / 1e9).toFixed(6);

  const tokenDecimals = config?.tokenDecimals || 9;
  const tokenDivisor = Math.pow(10, tokenDecimals);
  const tokenRateDisplay = (ratePerSecond / tokenDivisor).toFixed(6);
  const tokenCreatorShare = (ratePerSecond / 2 / tokenDivisor).toFixed(6);

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

  async function handlePaySOL() {
    if (!connected || !publicKey) return;
    setBusy(true);
    try {
      await payUpfrontSOL({
        userPublicKey: publicKey,
        sendTransaction,
        connection,
        creatorWallet: content.creatorWallet,
        agentWallet: config?.agentWallet || null,
        amountLamports: solCostLamports,
      });

      if (onApprovalSuccess) onApprovalSuccess({ mode: "upfront", durationSeconds: duration.seconds });
    } catch (e) {
      console.error(e);
      alert("Payment failed: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleApproveToken() {
    if (!connected || !publicKey) return;
    setBusy(true);
    try {
      await approveToken({
        userPublicKey: publicKey,
        sendTransaction,
        connection,
        gatewayPubkey,
        tokenMint: config.tokenMint,
        tokenDecimals: config.tokenDecimals,
        amount: ratePerSecond * 600,
      });

      await fetch(`${API}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPubkey: publicKey.toString(),
          creatorWallet: content.creatorWallet,
          paymentMint: config.tokenMint,
        }),
      });

      if (onApprovalSuccess) onApprovalSuccess({ mode: "streaming" });
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

          {payWith === "sol" ? (
            <>
              <div className="text-xs text-gray-500 mb-2">Select duration</div>
              <div className="flex gap-2 mb-4">
                {DURATIONS.map((d) => (
                  <button
                    key={d.seconds}
                    onClick={() => setDuration(d)}
                    className={`text-xs px-3 py-1.5 rounded border transition ${
                      duration.seconds === d.seconds
                        ? "border-white text-white bg-white/5"
                        : "border-neutral-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="text-sm text-gray-300 mb-2">
                Total: <b>{solCostDisplay} SOL</b>
                <span className="text-gray-500 text-xs ml-2">for {duration.label}</span>
              </div>
              <div className="text-xs text-gray-500 mb-4 space-y-1">
                <div>
                  Creator: {solCreatorShare} SOL &middot; Burn: {solBurnShare} SOL
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="button-primary disabled:opacity-50"
                  disabled={!connected || isStreaming || busy}
                  onClick={handlePaySOL}
                >
                  {busy ? "Paying\u2026" : isStreaming ? "Access Active" : `Pay ${solCostDisplay} SOL`}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                {isStreaming
                  ? "Content unlocked."
                  : "One-time payment. Content unlocks for the selected duration."}
              </p>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-300 mb-2">
                Rate: <b>{tokenRateDisplay} flow/s</b>
              </div>
              <div className="text-xs text-gray-500 mb-4 space-y-1">
                <div>
                  Creator: {tokenCreatorShare} flow/s &middot; Burn: {tokenCreatorShare} flow/s
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="button-primary disabled:opacity-50"
                  disabled={!connected || isStreaming || busy}
                  onClick={handleApproveToken}
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
                  : "Grant permission to start streaming flow token payments."}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}
