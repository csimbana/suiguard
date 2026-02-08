import { SuiClient } from "@mysten/sui.js/client";

// Conexión al nodo público de Sui (Mainnet)
export const suiClient = new SuiClient({
  url: "https://fullnode.mainnet.sui.io:443",
});