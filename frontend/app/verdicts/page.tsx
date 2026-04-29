"use client";

import { useState, useEffect } from "react";
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
}

export default function VerdictsPage() {
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("verdicts");
    if (stored) setVerdicts(JSON.parse(stored));
  }, []);

  if (verdicts.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">All Verdicts</h1>
        <p className="text-gray-500">No verdicts yet.</p>
        <Link href="/create" className="mt-6 text-violet-400 underline">
          Create the first one →
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Verdicts</h1>
          <Link
            href="/create"
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-500"
          >
            + New Verdict
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {verdicts.map((v) => {
            const total = v.votesA + v.votesB;
            const pctA = total > 0 ? Math.round((v.votesA / total) * 100) : 0;
            const pctB = total > 0 ? Math.round((v.votesB / total) * 100) : 0;

            return (
              <Link href={`/verdicts/${v.id}`} key={v.id}>
                <div className="border border-gray-800 rounded-xl p-5 hover:border-violet-500 transition-all cursor-pointer bg-gray-950">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 font-mono">
                      Block #{v.blockHeight}
                    </span>
                    <span className="text-xs text-violet-400 font-mono">
                      {total} votes
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold mb-4">{v.question}</h2>

                  {/* Vote bar */}
                  <div className="flex h-2 rounded-full overflow-hidden bg-gray-800 mb-3">
                    <div
                      className="bg-violet-500 transition-all"
                      style={{ width: `${pctA}%` }}
                    />
                    <div
                      className="bg-pink-500 transition-all"
                      style={{ width: `${pctB}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-violet-400">
                      {v.optionA} — {pctA}%
                    </span>
                    <span className="text-pink-400">
                      {v.optionB} — {pctB}%
                    </span>
                  </div>

                  {v.jurisSummary && (
                    <div className="mt-3 text-xs text-gray-400 border-t border-gray-800 pt-3">
                      🤖 JURIS: {v.jurisSummary.slice(0, 100)}...
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}