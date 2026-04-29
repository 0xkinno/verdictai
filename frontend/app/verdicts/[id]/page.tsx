"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Verdict {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
  blockHeight: number;
  jurisSummary?: string;
  jurisHash?: string;
}

export default function VerdictDetailPage() {
  const { id } = useParams();
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState<"A" | "B" | null>(null);
  const [jurisLoading, setJurisLoading] = useState(false);
  const [jurisResult, setJurisResult] = useState<string | null>(null);
  const [jurisHash, setJurisHash] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("verdicts");
    if (stored) {
      const all: Verdict[] = JSON.parse(stored);
      const found = all.find((v) => v.id === id);
      if (found) {
        setVerdict(found);
        if (found.jurisSummary) setJurisResult(found.jurisSummary);
        if (found.jurisHash) setJurisHash(found.jurisHash);
      }
    }
    if (localStorage.getItem(`voted_${id}`)) setVoted(true);
  }, [id]);

  async function castVote(choice: "A" | "B") {
    if (!verdict || voted) return;
    setVoting(choice);
    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verdictId: verdict.id, choice }),
    });
    const data = await res.json();
    if (data.success) {
      const updated = {
        ...verdict,
        votesA: choice === "A" ? verdict.votesA + 1 : verdict.votesA,
        votesB: choice === "B" ? verdict.votesB + 1 : verdict.votesB,
      };
      const stored = localStorage.getItem("verdicts");
      if (stored) {
        const all: Verdict[] = JSON.parse(stored);
        localStorage.setItem("verdicts", JSON.stringify(all.map((v) => v.id === verdict.id ? updated : v)));
      }
      setVerdict(updated);
      setVoted(true);
      localStorage.setItem(`voted_${id}`, "true");
    }
    setVoting(null);
  }

  async function runJuris() {
    if (!verdict) return;
    setJurisLoading(true);
    const res = await fetch("/api/juris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verdictId: verdict.id,
        question: verdict.question,
        optionA: verdict.optionA,
        optionB: verdict.optionB,
        votesA: verdict.votesA,
        votesB: verdict.votesB,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setJurisResult(data.summary);
      setJurisHash(data.hash);
      const stored = localStorage.getItem("verdicts");
      if (stored) {
        const all: Verdict[] = JSON.parse(stored);
        localStorage.setItem("verdicts", JSON.stringify(all.map((v) => v.id === verdict.id ? { ...v, jurisSummary: data.summary, jurisHash: data.hash } : v)));
      }
    }
    setJurisLoading(false);
  }

  if (!verdict) return (
    <main style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#555" }}>Loading verdict...</p>
    </main>
  );

  const total = verdict.votesA + verdict.votesB;
  const pctA = total > 0 ? Math.round((verdict.votesA / total) * 100) : 50;
  const pctB = total > 0 ? Math.round((verdict.votesB / total) * 100) : 50;
  const leading = verdict.votesA > verdict.votesB ? verdict.optionA : verdict.votesB > verdict.votesA ? verdict.optionB : "Tied";
  const leadingColor = verdict.votesA > verdict.votesB ? "#a78bfa" : verdict.votesB > verdict.votesA ? "#f472b6" : "#facc15";

  return (
    <main style={{ minHeight: "100vh", background: "#050508", color: "white", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top gradient bar */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #ec4899, #f59e0b)" }} />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 20px" }}>

        {/* Back link */}
        <Link href="/verdicts" style={{ color: "#555", fontSize: "13px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
          ← All verdicts
        </Link>

        {/* Chain badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "999px", padding: "4px 12px", fontSize: "11px", color: "#a78bfa", fontFamily: "monospace", marginBottom: "20px" }}>
          <div style={{ width: "6px", height: "6px", background: "#a78bfa", borderRadius: "50%", animation: "pulse 2s infinite" }} />
          CANOPY CHAIN · BLOCK #{verdict.blockHeight}
        </div>

        {/* Question */}
        <h1 style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1.3", marginBottom: "8px", letterSpacing: "-0.5px" }}>
          {verdict.question}
        </h1>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "32px" }}>
          Leading: <span style={{ color: leadingColor, fontWeight: "600" }}>{leading}</span>
          <span style={{ color: "#333", margin: "0 8px" }}>·</span>
          <span style={{ color: "#555" }}>{total} vote{total !== 1 ? "s" : ""} cast</span>
        </p>

        {/* VS Card */}
        <div style={{ background: "#0e0e14", border: "1px solid #1a1a2e", borderRadius: "20px", padding: "28px", marginBottom: "16px", position: "relative", overflow: "hidden" }}>
          {/* Background glow */}
          <div style={{ position: "absolute", top: 0, left: 0, width: `${pctA}%`, height: "100%", background: "rgba(124,58,237,0.04)", transition: "width 0.8s ease" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: `${pctB}%`, height: "100%", background: "rgba(236,72,153,0.04)", transition: "width 0.8s ease" }} />

          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "11px", color: "#555", fontFamily: "monospace", marginBottom: "4px" }}>OPTION A</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#a78bfa" }}>{verdict.optionA}</div>
              <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>{pctA}% · {verdict.votesA} votes</div>
            </div>
            <div style={{ fontSize: "18px", color: "#333", fontWeight: "800", alignSelf: "center" }}>VS</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#555", fontFamily: "monospace", marginBottom: "4px" }}>OPTION B</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#f472b6" }}>{verdict.optionB}</div>
              <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>{pctB}% · {verdict.votesB} votes</div>
            </div>
          </div>

          {/* Vote bar */}
          <div style={{ height: "8px", borderRadius: "999px", background: "#1a1a2e", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctA}%`, background: "linear-gradient(90deg, #6d28d9, #a78bfa)", borderRadius: "999px", transition: "width 0.8s ease" }} />
          </div>
        </div>

        {/* Vote buttons or voted state */}
        {!voted ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <button onClick={() => castVote("A")} disabled={voting !== null}
              style={{ padding: "18px", borderRadius: "14px", background: voting === "A" ? "#5b21b6" : "linear-gradient(135deg, #4c1d95, #6d28d9)", color: "white", fontWeight: "700", fontSize: "15px", border: "1px solid rgba(167,139,250,0.3)", cursor: "pointer", transition: "all 0.2s", opacity: voting !== null && voting !== "A" ? 0.5 : 1 }}>
              {voting === "A" ? "Voting..." : `✓ ${verdict.optionA}`}
            </button>
            <button onClick={() => castVote("B")} disabled={voting !== null}
              style={{ padding: "18px", borderRadius: "14px", background: voting === "B" ? "#9d174d" : "linear-gradient(135deg, #831843, #be185d)", color: "white", fontWeight: "700", fontSize: "15px", border: "1px solid rgba(244,114,182,0.3)", cursor: "pointer", transition: "all 0.2s", opacity: voting !== null && voting !== "B" ? 0.5 : 1 }}>
              {voting === "B" ? "Voting..." : `✓ ${verdict.optionB}`}
            </button>
          </div>
        ) : (
          <div style={{ background: "rgba(20,83,45,0.5)", border: "1px solid rgba(22,163,74,0.4)", borderRadius: "14px", padding: "16px", marginBottom: "16px", textAlign: "center", color: "#86efac", fontWeight: "600", fontSize: "15px" }}>
            ✓ Your vote has been recorded on Canopy
          </div>
        )}

        {/* JURIS Panel */}
        <div style={{ background: "#0a0a14", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "20px", overflow: "hidden", marginBottom: "16px" }}>
          {/* Header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(124,58,237,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", background: "#a78bfa", borderRadius: "50%" }} />
              <span style={{ fontWeight: "700", color: "#c4b5fd", fontSize: "14px", letterSpacing: "0.5px" }}>JURIS AI</span>
              <span style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>Judicial Reasoning System</span>
            </div>
          </div>

          <div style={{ padding: "24px" }}>
            {jurisResult ? (
              <div>
                <p style={{ color: "#d1d5db", lineHeight: "1.8", fontSize: "15px", marginBottom: "20px" }}>
                  {jurisResult}
                </p>
                {jurisHash && (
                  <div style={{ background: "#050508", border: "1px solid #1a1a2e", borderRadius: "10px", padding: "14px" }}>
                    <div style={{ fontSize: "10px", color: "#444", fontFamily: "monospace", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      Verdict hash — stored permanently on Canopy
                    </div>
                    <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#7c3aed", wordBreak: "break-all", lineHeight: "1.6" }}>
                      {jurisHash}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px", lineHeight: "1.6" }}>
                  JURIS will analyse all votes, determine community consensus, and permanently store the verdict hash on the Canopy blockchain.
                </p>
                <button onClick={runJuris} disabled={jurisLoading}
                  style={{ width: "100%", padding: "16px", background: jurisLoading ? "rgba(109,40,217,0.3)" : "linear-gradient(135deg, #4c1d95, #6d28d9)", color: jurisLoading ? "#7c3aed" : "white", fontWeight: "700", fontSize: "15px", borderRadius: "12px", border: "1px solid rgba(124,58,237,0.4)", cursor: jurisLoading ? "not-allowed" : "pointer", letterSpacing: "0.3px" }}>
                  {jurisLoading ? "⚖ JURIS is analysing..." : "⚖ Run JURIS Analysis →"}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}