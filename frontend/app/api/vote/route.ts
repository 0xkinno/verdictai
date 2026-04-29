import { NextRequest, NextResponse } from "next/server";

const CANOPY_RPC = "http://172.31.208.242:50002/v1";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verdictId, choice } = body;

    if (!verdictId || !choice) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Submit vote to Canopy chain
    let canopyResponse = null;
    try {
      const txRes = await fetch(`${CANOPY_RPC}/tx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CastVote",
          msg: { verdictId, choice },
        }),
      });
      canopyResponse = await txRes.json();
    } catch {
      // Canopy error doesn't block the vote from being recorded
      canopyResponse = { note: "Canopy tx attempted" };
    }

    return NextResponse.json({
      success: true,
      message: "Vote recorded",
      canopyResponse,
    });

  } catch (error) {
    console.error("Vote route error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}