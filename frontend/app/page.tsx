"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [verdictCount, setVerdictCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("verdicts");
    if (stored) setVerdictCount(JSON.parse(stored).length);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#050508", color: "white", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>
      {/* Top gradient bar */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #ec4899, #f59e0b)" }} />

      {/* Nav */}
      <nav style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #7c3aed, #ec4899)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px" }}>V</div>
          <span style={{ fontWeight: "800", fontSize: "18px", letterSpacing: "-0.5px" }}>Verdict<span style={{ color: "#a78bfa" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/verdicts" style={{ color: "#888", fontSize: "14px", textDecoration: "none", padding: "8px 16px", borderRadius: "8px", border: "1px solid #1a1a2e" }}>
            Browse
          </Link>
          <Link href="/create" style={{ color: "white", fontSize: "14px", textDecoration: "none", padding: "8px 20px", borderRadius: "8px", background: "linear-gradient(135deg, #6d28d9, #be185d)", fontWeight: "600" }}>
            + New Verdict
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        {/* Live badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "999px", padding: "6px 16px", fontSize: "12px", color: "#a78bfa", fontFamily: "monospace", marginBottom: "32px" }}>
          <div style={{ width: "6px", height: "6px", background: "#a78bfa", borderRadius: "50%" }} />
          LIVE ON CANOPY NETWORK
        </div>

        <h1 style={{ fontSize: "56px", fontWeight: "900", lineHeight: "1.1", letterSpacing: "-2px", marginBottom: "24px" }}>
          Turn community
          <br />
          <span style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            consensus
          </span>
          <br />
          into onchain truth.
        </h1>

        <p style={{ fontSize: "18px", color: "#666", lineHeight: "1.7", maxWidth: "520px", margin: "0 auto 40px" }}>
          Post disputes and questions. Community votes. JURIS AI summarises the debate. Final verdict stored permanently on Canopy blockchain.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/create" style={{ padding: "16px 32px", background: "linear-gradient(135deg, #6d28d9, #be185d)", color: "white", textDecoration: "none", borderRadius: "12px", fontWeight: "700", fontSize: "16px", letterSpacing: "-0.3px" }}>
            Submit a Case →
          </Link>
          <Link href="/verdicts" style={{ padding: "16px 32px", background: "rgba(255,255,255,0.05)", color: "white", textDecoration: "none", borderRadius: "12px", fontWeight: "600", fontSize: "16px", border: "1px solid #1a1a2e" }}>
            Browse Verdicts
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { label: "Verdicts Posted", value: verdictCount.toString(), color: "#a78bfa" },
            { label: "Powered By", value: "Canopy", color: "#f472b6" },
            { label: "AI Agent", value: "JURIS", color: "#facc15" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0e0e14", border: "1px solid #1a1a2e", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: s.color, marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#555", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: "13px", color: "#555", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center", marginBottom: "32px" }}>
          How it works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {[
            { step: "01", title: "Post a Case", desc: "Submit your question with context", color: "#7c3aed" },
            { step: "02", title: "Community Votes", desc: "Token holders vote on the outcome", color: "#be185d" },
            { step: "03", title: "JURIS Analyses", desc: "AI summarises the community decision", color: "#d97706" },
            { step: "04", title: "Truth Onchain", desc: "Verdict hash stored on Canopy forever", color: "#16a34a" },
          ].map((s) => (
            <div key={s.step} style={{ background: "#0e0e14", border: "1px solid #1a1a2e", borderRadius: "16px", padding: "20px" }}>
              <div style={{ fontSize: "11px", fontFamily: "monospace", color: s.color, marginBottom: "8px" }}>{s.step}</div>
              <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "6px" }}>{s.title}</div>
              <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.5" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}