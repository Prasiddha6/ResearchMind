"use client";

import { ChangeEvent, FormEvent, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type Source = {
  filename: string;
  page: number;
  score: number;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setMessage("");

    const form = new FormData();
    form.append("file", file);

    try {
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }

      setMessage(
        `${data.filename} indexed successfully — ${data.chunks_indexed} chunks.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function ask(event: FormEvent) {
    event.preventDefault();

    if (!question.trim()) return;

    setAsking(true);
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Request failed");
      }

      setAnswer(data.answer);
      setSources(data.sources);
    } catch (error) {
      setAnswer(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setAsking(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12">
          <div className="mb-4 inline-flex rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">
            AI Research Assistant
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            ResearchMind
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Upload research papers, retrieve relevant evidence, and ask
            grounded questions with citation-backed answers.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">Documents</h2>

            <p className="mt-2 text-sm text-slate-400">
              Upload a PDF to add it to the research knowledge base.
            </p>

            <label className="mt-6 block cursor-pointer rounded-xl border border-dashed border-slate-700 p-6 text-center hover:border-slate-500">
              <span className="text-sm">
                {uploading ? "Indexing..." : "Choose PDF"}
              </span>

              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={upload}
                disabled={uploading}
              />
            </label>

            {message && (
              <p className="mt-4 text-sm text-slate-400">{message}</p>
            )}
          </aside>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">Ask ResearchMind</h2>

            <form onSubmit={ask} className="mt-6">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What methodology did the authors use?"
                className="min-h-32 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-slate-500"
              />

              <button
                type="submit"
                disabled={asking}
                className="mt-4 rounded-xl bg-white px-5 py-3 font-medium text-slate-950 disabled:opacity-50"
              >
                {asking ? "Researching..." : "Ask question"}
              </button>
            </form>

            {answer && (
              <article className="mt-10 border-t border-slate-800 pt-8">
                <h3 className="font-semibold">Answer</h3>

                <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
                  {answer}
                </p>

                {sources.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold">Sources</h3>

                    <div className="mt-3 space-y-2">
                      {sources.map((source, index) => (
                        <div
                          key={`${source.filename}-${source.page}-${index}`}
                          className="rounded-lg border border-slate-800 p-3 text-sm text-slate-400"
                        >
                          [{index + 1}] {source.filename} · page{" "}
                          {source.page} · relevance {source.score}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
