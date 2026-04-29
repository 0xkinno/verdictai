"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreatePage() {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!question || !optionA || !optionB) {
      setStatus("error");
      setMessage("Please fill in all fields.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, optionA, optionB }),
      });
      const data = await res.json();
      if (data.success) {
        const newVerdict = {
          id: `verdict_${Date.now()}`,
          question, optionA, optionB,
          votesA: 0, votesB: 0,
          blockHeight: data.blockHeight,
        };
        const existing = JSON.parse(localStorage.getItem("verdicts") || "[]");
        localStorage.setItem("verdicts", JSON.stringify([newVerdict, ...existing]));
        setStatus("success");
        setMessage("Verdict submitted! Redirecting...");
        setQuestion(""); setOptionA(""); setOptionB("");
        setTimeout(() => { window.location.href = "/verdicts"; }, 1500);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#050508", color: "white", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #ec4899, #f59e0b)" }} />

      {/* Nav */}
      <nav style={{ maxWidth: "680px", margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #7c3aed, #ec4899)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "14px" }}>V</div>
          <span style={{ fontWeight: "800", fontSize: "18px", color: "white", letterSpacing: "-0.5px" }}>Verdict<span style={{ color: "#a78bfa" }}>AI</span></span>
        </Link>
        <Link href="/verdicts" style={{ color: "#666", fontSize: "13px", textDecoration: "none" }}>← Back</Link>
      </nav>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "999px", padding: "4px 12px", fontSize: "11px", color: "#a78bfa", fontFamily: "monospace", marginBottom: "16px" }}>
            <div style={{ width: "5px", height: "5px", background: "#a78bfa", borderRadius: "50%" }} />
            SUBMIT TO CANOPY CHAIN
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "900", letterSpacing: "-1px", marginBottom: "8px" }}>Create a Verdict</h1>
          <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.6" }}>Post your question onchain. The community decides. JURIS makes it permanent.</p>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Question */}
          <div>
            <label style={{ display: "block", fontSize: "11px", color: "#666", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              Question
            </label>
            <input
              type="text"
              placeholder="What should the community decide?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", background: "#0e0e14", border: "1px solid #1a1a2e", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = "#6d28d9"}
              onBlur={(e) => e.target.style.borderColor = "#1a1a2e"}
            />
          </div>

          {/* Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#a78bfa", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Option A
              </label>
              <input
                type="text"
                placeholder="First option"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", background: "#0e0e14", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => e.target.style.borderColor = "#7c3aed"}
                onBlur={(e) => e.target.style.borderColor = "rgba(124,58,237,0.2)"}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#f472b6", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                Option B
              </label>
              <input
                type="text"
                placeholder="Second option"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", background: "#0e0e14", border: "1px solid rgba(236,72,153,0.2)", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => e.target.style.borderColor = "#ec4899"}
                onBlur={(e) => e.target.style.borderColor = "rgba(236,72,153,0.2)"}
              />
            </div>
          </div>

          {/* Preview */}
          {(question || optionA || optionB) && (
            <div style={{ background: "#0a0a14", border: "1px solid #1a1a2e", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#444", fontFamily: "monospace", marginBottom: "8px" }}>PREVIEW</div>
              <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: question ? "white" : "#333" }}>
                {question || "Your question..."}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#a78bfa", background: "rgba(124,58,237,0.1)", padding: "3px 10px", borderRadius: "999px" }}>{optionA || "Option A"}</span>
                <span style={{ fontSize: "12px", color: "#f472b6", background: "rgba(236,72,153,0.1)", padding: "3px 10px", borderRadius: "999px" }}>{optionB || "Option B"}</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{ padding: "16px", background: status === "loading" ? "rgba(109,40,217,0.4)" : "linear-gradient(135deg, #6d28d9, #be185d)", color: "white", border: "none", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: status === "loading" ? "not-allowed" : "pointer", marginTop: "8px" }}
          >
            {status === "loading" ? "Submitting to Canopy..." : "Submit Verdict →"}
          </button>

          {status === "success" && (
            <div style={{ background: "rgba(20,83,45,0.5)", border: "1px solid rgba(22,163,74,0.4)", borderRadius: "12px", padding: "14px", textAlign: "center", color: "#86efac", fontWeight: "600" }}>
              ✓ {message}
            </div>
          )}
          {status === "error" && (
            <div style={{ background: "rgba(127,29,29,0.5)", border: "1px solid rgba(185,28,28,0.4)", borderRadius: "12px", padding: "14px", textAlign: "center", color: "#fca5a5" }}>
              ✗ {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}