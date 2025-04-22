"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [perspectives, setPerspectives] = useState<any[] | null>(null);
  const [history, setHistory] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setHistory(null);
    setPerspectives(null);

    try {
      /* --- 1) 視点抽出 --- */
      const metaRes = await fetch("/api/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { perspectives } = await metaRes.json();
      setPerspectives(perspectives);

      /* --- 2) 動的ディベート --- */
      const discussRes = await fetch("/api/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          perspectives,          // 重要: 動的に渡す
          rounds: 3,             // 1人 × 3 ラウンド = 発言 3N 回
        }),
      });
      const { history } = await discussRes.json();
      setHistory(history);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">PhiloRoom - 議論開始</h1>

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="テーマを入力してください"
          className="border border-gray-300 p-2 mr-2 rounded w-80"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          送信
        </button>
      </form>

      {/* ローディング */}
      {loading && <p>読み込み中...</p>}

      {/* 視点一覧 */}
      {perspectives && (
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">抽出された視点</h2>
          <ul className="list-disc pl-5">
            {perspectives.map((p: any, i) => (
              <li key={i}>
                <span className="font-bold">{p.name}:</span> {p.stance}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ディベート履歴 */}
      {history && (
        <section>
          <h2 className="text-2xl font-semibold mb-2">ディベート</h2>
          <ul className="list-disc pl-5 space-y-1">
            {history.map((h: any, i) => (
              <li key={i}>
                <span className="font-bold">{h.speaker}:</span> {h.message}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}