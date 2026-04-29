import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const CANOPY_RPC = process.env.NEXT_PUBLIC_CANOPY_RPC_URL || "http://172.31.208.242:50002/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verdictId, question, optionA, optionB, votesA, votesB } = body;

    const total = votesA + votesB;
    const pctA = total > 0 ? Math.round((votesA / total) * 100) : 0;
    const pctB = total > 0 ? Math.round((votesB / total) * 100) : 0;
    const winner =
      votesA > votesB ? optionA : votesB > votesA ? optionB : "tied";

    // Build JURIS summary
    const summary = `JURIS VERDICT: After analysing ${total} community votes on "${question}", the community chose "${winner}" with ${Math.max(pctA, pctB)}% support (${optionA}: ${pctA}%, ${optionB}: ${pctB}%). ${
      winner === "tied"
        ? "The community is evenly divided — no clear consensus reached."
        : `The verdict is clear: "${winner}" represents the community consensus.`
    }`;

    // Hash the summary — this gets stored onchain
    const hash = createHash("sha256").update(summary).digest("hex");

    // Commit the JURIS hash to Canopy chain
    const txRes = await fetch(`${CANOPY_RPC}/tx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "FinaliseVerdict",
        msg: { verdictId, jurisHash: hash, summary },
      }),
    });
    const txData = await txRes.json();

    return NextResponse.json({
      success: true,
      summary,
      hash,
      canopyResponse: txData,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}