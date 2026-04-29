import { NextRequest, NextResponse } from "next/server";

const CANOPY_RPC = process.env.NEXT_PUBLIC_CANOPY_RPC_URL || "http://172.31.208.242:50002/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, optionA, optionB } = body;

    if (!question || !optionA || !optionB) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Step 1: Get current block height from Canopy
    const heightRes = await fetch(`${CANOPY_RPC}/query/height`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const heightData = await heightRes.json();
    const blockHeight = heightData.height;

    // Step 2: Submit verdict transaction to Canopy
    const txRes = await fetch(`${CANOPY_RPC}/tx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "PostVerdict",
        msg: {
          question,
          optionA,
          optionB,
          submittedAt: blockHeight,
        },
      }),
    });
    const txData = await txRes.json();

    return NextResponse.json({
      success: true,
      message: "Verdict submitted to Canopy",
      blockHeight,
      canopyResponse: txData,
    });

  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}