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
      limit: 50,
    });

	// --- Real signal: wallet age (days) ---
	let walletAgeDays = 0;

	if (txs.data.length > 0) {
	  // Toma la transacción más antigua dentro del lote
	  const sorted = [...txs.data].sort(
		(a: any, b: any) =>
		  Number(a.timestampMs ?? 0) - Number(b.timestampMs ?? 0)
	  );

	  const firstTx = sorted[0];
	  const firstMs = Number(firstTx?.timestampMs ?? 0);

	  if (firstMs > 0) {
		const now = Date.now();
		walletAgeDays = Math.floor((now - firstMs) / (1000 * 60 * 60 * 24)); //Calcula los días
	  }
	}
	
	// --- Extract touched packages ---
	const touchedPackages = new Set<string>();

	for (const tx of txs.data) {
	  try {
		const changes = (tx as any)?.objectChanges || [];

		for (const change of changes) {
		  if (change.packageId) {
			touchedPackages.add(change.packageId);
		  }
		}
	  } catch {}
	}

	const touchedPackagesArray = Array.from(touchedPackages);
	
	//Simulation
	const scoring = scoreWallet({
	  walletAgeDays, //: Math.floor(Math.random() * 100),
	  totalTx: txs.data.length,
	  txLastHour: Math.floor(Math.random() * 50),
	  touchedPackages: touchedPackagesArray, //: ["0xdefi1"],
	});

    return NextResponse.json({
      address,
      total: txs.data.length,
	  walletAgeDays,
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
