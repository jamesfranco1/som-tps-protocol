"use client";

export default function TxLog({ transactions = [] }) {
  const safeTxs = Array.isArray(transactions) ? transactions : [];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Transaction Log</h3>
      <div className="space-y-2 text-sm font-mono max-h-80 overflow-y-auto">
        {safeTxs.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          [...safeTxs].reverse().map((log, i) => (
            <div key={i} className="text-gray-300">
              {log.txId ? (
                <>
                  {log.text.split("\u2192")[0]}&rarr;{" "}
                  <a
                    href={`https://solscan.io/tx/${log.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    {log.text.split("\u2192")[1]?.trim() || log.txId.slice(0, 8)}
                  </a>
                </>
              ) : (
                <span className="text-gray-500">
                  {log.text || String(log)}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
