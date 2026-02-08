import { NextResponse } from "next/server";
import { suiClient } from "@/lib/suiClient";

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

    return NextResponse.json({
      address,
      total: txs.data.length,
      transactions: txs.data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch wallet data", details: String(err) },
      { status: 500 }
    );
  }
}
