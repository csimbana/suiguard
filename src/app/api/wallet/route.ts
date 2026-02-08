import { NextResponse } from "next/server";
import { suiClient } from "@/lib/suiClient";
import { scoreWallet } from "@/lib/scoringEngine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
  }

  try {
    // Pedir a Sui transacciones de esta wallet
    const txs = await suiClient.queryTransactionBlocks({
      filter: {
        FromAddress: address,
      },
      limit: 5,
    });

	// Hackathon MVP 
	// Randomized values are used only to simulate live risk scoring behavior.
	// The architecture is ready to consume real Sui on-chain signals such as
	// wallet history, transaction burst detection, and package/module reputation.

	const scoring = scoreWallet({
	  walletAgeDays: Math.floor(Math.random() * 100),
	  totalTx: txs.data.length,
	  txLastHour: Math.floor(Math.random() * 50),
	  touchedPackages: ["0xdefi1"],
	});

    return NextResponse.json({
      address,
      total: txs.data.length,
	  score: scoring,
      transactions: txs.data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch wallet data", details: String(err) },
      { status: 500 }
    );
  }
  
}
