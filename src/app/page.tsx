"use client";

import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);

  async function checkWallet() {
    const res = await fetch(`/api/wallet?address=${address}`);
    const data = await res.json();
    setResult(data);
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>SUIGuard 🚦</h1>

      <p>Paste a Sui wallet address:</p>

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: "400px", padding: "8px" }}
      />

      <button onClick={checkWallet} style={{ marginLeft: "10px" }}>
        Check
      </button>

		{result?.score && (
		  <h2>
			Risk: {result.score.level} — {result.score.reason}
		  </h2>
		)}	  


      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
	  
	  
    </main>
  );
}
