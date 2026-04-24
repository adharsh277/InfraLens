"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, GitBranch, LoaderCircle } from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { Button } from "@/components/ui/button";

export default function AnalyzePage() {
  const router = useRouter();
  const [repo, setRepo] = useState("https://github.com/user/repo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call Next.js proxy instead of backend directly
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo_url: repo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API error:", errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Analysis job created:", data);
      
      if (!data.job_id) {
        throw new Error("No job_id returned from backend");
      }

      console.log("🔄 Navigating to result with job_id:", data.job_id);
      
      // Pass job_id to result page
      router.push(`/result?job_id=${data.job_id}`);
      console.log("✅ Navigation requested");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to analyze repository",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-white">Analyze Repo</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Paste your GitHub repository URL to generate a live infrastructure map.
        </p>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8">
          <label htmlFor="repo" className="text-sm text-slate-300">
            GitHub URL
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center rounded-xl border border-white/10 bg-[#0f1830] px-3">
              <GitBranch className="h-4 w-4 text-slate-400" />
              <input
                id="repo"
                className="h-12 w-full bg-transparent px-2 text-slate-100 placeholder:text-slate-500 focus:outline-none"
                value={repo}
                onChange={(event) => setRepo(event.target.value)}
                placeholder="https://github.com/org/repo"
              />
            </div>
            <Button onClick={onAnalyze} disabled={loading} className="sm:min-w-40">
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Scanning
                </>
              ) : (
                <>
                  Analyze Repo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Backend endpoint target: POST /analyze with payload
            {" "}
            <span className="text-slate-300">{`{ "repo_url": "https://github.com/user/repo" }`}</span>
          </p>
          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        </section>

        <div className="mt-8">
          <Link href="/result" className="text-sm text-cyan-300 hover:text-cyan-200">
            See empty-state result page
          </Link>
        </div>
      </main>
    </div>
  );
}
