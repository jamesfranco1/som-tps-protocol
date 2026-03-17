"use client";

import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  createApproveCheckedInstruction,
} from "@solana/spl-token";

const WSOL_DECIMALS = 9;

/**
 * Wraps SOL into wSOL and approves the gateway as a delegate — all in one tx.
 *
 * Steps inside the transaction:
 * 1. Create the user's wSOL ATA if it doesn't exist
 * 2. Transfer SOL into the ATA (wrapping)
 * 3. Sync the native account balance
 * 4. Approve the gateway to spend up to `amountLamports` of wSOL
 */
export async function wrapAndApprove({
  userPublicKey,
  sendTransaction,
  connection,
  gatewayPubkey,
  amountLamports = LAMPORTS_PER_SOL,
}) {
  if (!gatewayPubkey) {
    throw new Error("Missing NEXT_PUBLIC_GATEWAY_PUBKEY");
  }

  const user = new PublicKey(userPublicKey);
  const gateway = new PublicKey(gatewayPubkey);
  const userAta = await getAssociatedTokenAddress(NATIVE_MINT, user);

  const tx = new Transaction();

  const ataInfo = await connection.getAccountInfo(userAta);
  if (!ataInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(user, userAta, user, NATIVE_MINT)
    );
  }

  tx.add(
    SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: userAta,
      lamports: amountLamports,
    })
  );

  tx.add(createSyncNativeInstruction(userAta));

  tx.add(
    createApproveCheckedInstruction(
      userAta,
      NATIVE_MINT,
      gateway,
      user,
      amountLamports,
      WSOL_DECIMALS
    )
  );

  const sig = await sendTransaction(tx, connection, { skipPreflight: false });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}
