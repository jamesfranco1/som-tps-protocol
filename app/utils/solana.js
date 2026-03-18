"use client";

import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createApproveCheckedInstruction,
} from "@solana/spl-token";

export function isNativeMint(mintStr) {
  return !mintStr || mintStr === "" || mintStr === "WSOL" || mintStr === NATIVE_MINT.toString();
}

export async function payUpfrontSOL({
  userPublicKey,
  sendTransaction,
  connection,
  creatorWallet,
  agentWallet,
  amountLamports,
}) {
  const user = new PublicKey(userPublicKey);
  const creator = new PublicKey(creatorWallet);

  const creatorAmount = Math.floor(amountLamports / 2);
  const agentAmount = amountLamports - creatorAmount;

  const tx = new Transaction();

  tx.add(
    SystemProgram.transfer({ fromPubkey: user, toPubkey: creator, lamports: creatorAmount })
  );

  if (agentWallet) {
    const agent = new PublicKey(agentWallet);
    tx.add(
      SystemProgram.transfer({ fromPubkey: user, toPubkey: agent, lamports: agentAmount })
    );
  } else {
    tx.add(
      SystemProgram.transfer({ fromPubkey: user, toPubkey: creator, lamports: agentAmount })
    );
  }

  tx.add(
    new TransactionInstruction({
      keys: [],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from(`flow402x-upfront-${Date.now()}`),
    })
  );

  const sig = await sendTransaction(tx, connection, { skipPreflight: false });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

export async function approveToken({
  userPublicKey,
  sendTransaction,
  connection,
  gatewayPubkey,
  tokenMint,
  tokenDecimals,
  amount,
}) {
  if (!gatewayPubkey) throw new Error("Missing NEXT_PUBLIC_GATEWAY_PUBKEY");
  if (!tokenMint) throw new Error("Missing token mint");

  const user = new PublicKey(userPublicKey);
  const gateway = new PublicKey(gatewayPubkey);
  const mint = new PublicKey(tokenMint);
  const userAta = await getAssociatedTokenAddress(mint, user);

  const tx = new Transaction();

  const ataInfo = await connection.getAccountInfo(userAta);
  if (!ataInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(user, userAta, user, mint)
    );
  }

  tx.add(
    createApproveCheckedInstruction(
      userAta,
      mint,
      gateway,
      user,
      amount,
      tokenDecimals
    )
  );

  const sig = await sendTransaction(tx, connection, { skipPreflight: false });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

export async function getTokenBalance(connection, userPublicKey, tokenMint) {
  try {
    const mint = new PublicKey(tokenMint);
    const user = new PublicKey(userPublicKey);
    const ata = await getAssociatedTokenAddress(mint, user);
    const info = await connection.getTokenAccountBalance(ata);
    return Number(info.value.uiAmount || 0);
  } catch {
    return 0;
  }
}
