export type RiskLevel = "GREEN" | "AMBER" | "RED";

const FLAGGED_PACKAGES = [
  "0xscam123",
  "0xexploit456",
];

const VERIFIED_PACKAGES = [
  "0xdefi1",
  "0xdefi2",
];

export function scoreWallet(data: {
  walletAgeDays: number;
  totalTx: number;
  txLastHour: number;
  touchedPackages: string[];
}) {
  //  RED CHEC
  const touchedFlagged = data.touchedPackages.some(p =>
    FLAGGED_PACKAGES.includes(p)
  );

  if (touchedFlagged) {
    return {
      level: "RED",
      reason: "Interacted with flagged package",
    };
  }

  //  AMBER CHECK
  if (
    data.walletAgeDays < 7 ||
    data.txLastHour > 20 ||
    data.touchedPackages.some(p => !VERIFIED_PACKAGES.includes(p))
  ) {
    return {
      level: "AMBER",
      reason: "New wallet or unusual activity",
    };
  }

  //  GREEN
  return {
    level: "GREEN",
    reason: "Normal activity and trusted protocols",
  };
}


/*Devon message
Hey Carlos – nice to meet you, and SUIGuard sounds like a really solid idea. 
If you’re aiming for a simple traffic-light MVP, I’d honestly keep the first version very lightweight and rule-based. 
A few signals go a long way. The best ones to start with (from what we’ve seen building BlockSight): 
First, whether the wallet has interacted with any contracts or packages that are already known to be risky (exploited, community-flagged, or clearly unverified / throwaway deployments). 
That’s usually your strongest red flag. Second, basic wallet history. 
How old is the wallet, and how much real activity does it have? Very new wallets doing complex DeFi flows tend to be higher risk than long-lived ones. 
Third, simple movement patterns. Things like bridge in → swap → bridge out, or funds moving very quickly through multiple steps. 
You don’t need anything fancy here – just spotting these patterns is useful. Fourth, burst behaviour. 
If a wallet suddenly fires off lots of transactions in a short window, that often lines up with bots, scripts or exploit activity. 
Fifth, what I’d call the “protocol profile”. Normal users usually stick to a small set of well-known apps. 
Wallets touching lots of tiny or brand-new contracts are often riskier. One Sui-specific thing I’d really lean on: package / module reputation. 
Keeping a small list of well-known, verified Move packages versus brand-new or unverified ones maps very cleanly to a traffic-light model. 
For scoring, I’d keep it dead simple for a hackathon: 
Red → touched a flagged package or clearly suspicious movement 
Amber → very new wallet with unusual patterns 
Green → older wallet mostly using known protocols I’d avoid ML at the start. 
Simple, explainable rules will be much easier for users to trust – and much easier for you to ship fast.
*/