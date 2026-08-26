"use client";

import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileText,
  HeartPulse,
  Loader2,
  MessageCircle,
  Microscope,
  Paperclip,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type Source = {
  filename: string;
  page: number;
  score: number;
};

type UploadedDocument = {
  filename: string;
  chunks: number;
};

type Conversation = {
  id: number;
  question: string;
  answer: string;
  sources: Source[];
  createdAt: string;
};

const exampleQuestions = [
  "What methodology did the authors use?",
  "What were the main findings?",
  "What limitations did the study identify?",
];

function formatAnswer(text: string) {
  return text.replace(/\[Source (\d+)\]/g, "**[Source $1]**");
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [message, setMessage] = useState("");
  const [document, setDocument] = useState<UploadedDocument | null>(null);
  const [history, setHistory] = useState<Conversation[]>([]);
  const [copied, setCopied] = useState(false);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Please upload a PDF research paper.");
      return;
    }

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
        throw new Error(data.detail || "Unable to process this document.");
      }

      setDocument({
        filename: data.filename,
        chunks: data.chunks_indexed,
      });

      setMessage("Research paper successfully added to your workspace.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while processing the PDF.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function ask(event?: FormEvent) {
    event?.preventDefault();

    if (!question.trim() || asking) return;

    const submittedQuestion = question.trim();

    setAsking(true);
    setAnswer("");
    setSources([]);
    setCopied(false);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: submittedQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to answer your question.");
      }

      setAnswer(data.answer);
      setSources(data.sources);

      setHistory((current) => [
        {
          id: Date.now(),
          question: submittedQuestion,
          answer: data.answer,
          sources: data.sources,
          createdAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...current,
      ]);
    } catch (error) {
      setAnswer(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setAsking(false);
    }
  }

  function newResearchQuestion() {
    setQuestion("");
    setAnswer("");
    setSources([]);
    setMessage("");
    setCopied(false);
  }

  function selectHistory(item: Conversation) {
    setQuestion(item.question);
    setAnswer(item.answer);
    setSources(item.sources);
    setCopied(false);
  }

  function clearHistory() {
    setHistory([]);
  }

  async function copyAnswer() {
    if (!answer) return;

    await navigator.clipboard.writeText(answer);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="float-slow absolute -left-24 top-28 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

        <div
          className="float-slow absolute -right-24 top-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="absolute left-1/2 top-[55%] h-80 w-80 -translate-x-1/2 rounded-full bg-violet-100/30 blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-pink-400 text-white shadow-lg shadow-sky-200/50">
            <HeartPulse size={22} strokeWidth={2.4} />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-slate-800">
              ResearchMind
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              AI research companion
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Research workspace
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pt-16">
        <div className="fade-up max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-bold text-pink-600">
            <Sparkles size={14} />
            Evidence-backed AI for research
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-800 sm:text-6xl">
            Your research,
            <br />
            <span className="gradient-text">understood.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Explore medical and scientific literature with an AI research
            companion that connects every answer back to the evidence.
          </p>
        </div>

        <div className="fade-up-delay mt-8 flex flex-wrap gap-3">
          {[
            [CheckCircle2, "Grounded answers"],
            [BookOpen, "Paper-aware"],
            [Activity, "Source citations"],
          ].map(([Icon, label]) => {
            const IconComponent = Icon as typeof CheckCircle2;

            return (
              <div
                key={label as string}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm"
              >
                <IconComponent size={15} className="text-sky-500" />
                {label as string}
              </div>
            );
          })}
        </div>
      </section>

      {/* Workspace */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Library */}
            <div className="soft-card gradient-border rounded-3xl p-5">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Research library
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Build your evidence base
                  </p>
                </div>

                <div className="rounded-xl bg-sky-50 p-2 text-sky-500">
                  <Microscope size={18} />
                </div>
              </div>

              <label className="group block cursor-pointer">
                <div className="rounded-2xl border-2 border-dashed border-sky-200 bg-gradient-to-br from-sky-50 to-pink-50 p-7 text-center transition-all group-hover:border-pink-300 group-hover:shadow-md">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-500 shadow-sm transition-transform group-hover:-translate-y-1">
                    {uploading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <Upload size={24} />
                    )}
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-700">
                    {uploading ? "Analyzing paper..." : "Add a research paper"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Upload a PDF to expand your research workspace
                  </p>

                  <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-sky-600 shadow-sm">
                    <Paperclip size={13} />
                    Choose PDF
                  </div>
                </div>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={upload}
                  disabled={uploading}
                />
              </label>

              {document && (
                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5 rounded-lg bg-white p-2 text-emerald-500 shadow-sm">
                      <FileText size={16} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-700">
                        {document.filename}
                      </p>

                      <p className="mt-1 text-[11px] text-emerald-600">
                        {document.chunks} evidence chunks indexed
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                  {message}
                </p>
              )}
            </div>

            {/* History */}
            <div className="soft-card rounded-3xl p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-pink-50 p-2 text-pink-500">
                    <Clock3 size={15} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Recent questions
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Your current session
                    </p>
                  </div>
                </div>

                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    aria-label="Clear question history"
                    className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <MessageCircle
                    size={22}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    No questions yet
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-400">
                    Your research questions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectHistory(item)}
                      className="w-full rounded-xl border border-transparent bg-slate-50 p-3 text-left transition-all hover:border-sky-100 hover:bg-sky-50"
                    >
                      <p className="line-clamp-2 text-xs font-semibold leading-5 text-slate-600">
                        {item.question}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {item.createdAt}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main */}
          <section className="soft-card rounded-3xl p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-pink-50 p-2 text-pink-500">
                    <MessageCircle size={18} />
                  </div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Research workspace
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Ask questions and discover evidence from your uploaded
                  literature.
                </p>
              </div>

              <button
                type="button"
                onClick={newResearchQuestion}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
              >
                <Plus size={14} />
                New question
              </button>
            </div>

            {/* Input */}
            <form onSubmit={ask} className="mt-7">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2 transition-all focus-within:border-sky-300 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-sky-100/50">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask something about your research..."
                  aria-label="Research question"
                  className="min-h-28 w-full resize-none bg-transparent px-4 py-3 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      (event.metaKey || event.ctrlKey)
                    ) {
                      event.preventDefault();
                      ask();
                    }
                  }}
                />

                <div className="flex items-center justify-between border-t border-slate-200/70 px-2 pt-2">
                  <div className="hidden items-center gap-2 text-[11px] text-slate-400 sm:flex">
                    <Search size={13} />
                    ⌘ + Enter to ask
                  </div>

                  <button
                    type="submit"
                    disabled={asking || !question.trim()}
                    className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-pink-400 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-200/50 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {asking ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Researching
                      </>
                    ) : (
                      <>
                        Ask ResearchMind
                        <ArrowUpRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Suggestions */}
            {!answer && !asking && (
              <div className="mt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Try asking
                </p>

                <div className="grid gap-2 sm:grid-cols-3">
                  {exampleQuestions.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setQuestion(example)}
                      className="rounded-xl border border-slate-200 bg-white p-3 text-left text-xs font-medium leading-5 text-slate-500 transition-all hover:border-sky-200 hover:bg-sky-50/50 hover:text-sky-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {asking && (
              <div className="mt-8 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 to-pink-50/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-500 shadow-sm">
                    <Activity size={18} className="animate-pulse" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700">
                      Searching your research
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Retrieving relevant evidence and preparing an answer...
                    </p>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-sky-300 to-pink-300" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Answer */}
            {answer && !asking && (
              <article className="fade-up mt-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-pink-100 text-sky-600">
                        <Sparkles size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          ResearchMind&apos;s answer
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Grounded in your uploaded evidence
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={copyAnswer}
                      aria-label="Copy answer"
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-400 transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                    >
                      {copied ? (
                        <>
                          <Check size={13} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="prose prose-sm mt-6 max-w-none text-slate-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-4 leading-7 last:mb-0">{children}</p>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-800">
                            {children}
                          </strong>
                        ),

                        h1: ({ children }) => (
                          <h1 className="mb-3 mt-6 text-xl font-bold text-slate-800">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="mb-3 mt-6 text-lg font-bold text-slate-800">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="mb-2 mt-5 text-sm font-bold text-slate-800">
                            {children}
                          </h3>
                        ),

                        ul: ({ children }) => (
                          <ul className="mb-4 ml-5 list-disc space-y-2">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="mb-4 ml-5 list-decimal space-y-2">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li className="leading-6">{children}</li>
                        ),

                        blockquote: ({ children }) => (
                          <blockquote className="my-4 rounded-xl border-l-4 border-pink-300 bg-pink-50 px-4 py-3 text-slate-600">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {formatAnswer(answer)}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Evidence */}
                {sources.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Evidence used
                        </p>

                        <p className="text-[11px] text-slate-400">
                          Retrieved passages supporting this answer
                        </p>
                      </div>

                      <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
                        {sources.length} sources
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {sources.map((source, index) => (
                        <div
                          key={`${source.filename}-${source.page}-${index}`}
                          className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/40 hover:shadow-md hover:shadow-sky-100/40"
                        >
                          <div className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-pink-500 shadow-sm">
                              {index + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-xs font-bold text-slate-700">
                                  {source.filename}
                                </p>

                                <FileText
                                  size={14}
                                  className="shrink-0 text-sky-400"
                                />
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-400">
                                  Page {source.page}
                                </span>

                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                                  {Math.round(source.score * 100)}% relevance
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsible AI note */}
                <div className="mt-5 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                  <div className="mt-0.5 shrink-0 text-amber-500">
                    <CheckCircle2 size={16} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-amber-800">
                      Research support, not medical advice
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-amber-700/80">
                      ResearchMind is designed to help explore literature. It
                      should not replace professional medical judgment,
                      diagnosis, or treatment decisions.
                    </p>
                  </div>
                </div>
              </article>
            )}
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-slate-200/70 px-5 py-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2">
          <HeartPulse size={14} className="text-pink-400" />
          <span>ResearchMind</span>
        </div>

        <span>
          AI-assisted research • Evidence first • Responsible exploration
        </span>
      </footer>
    </main>
  );
}
