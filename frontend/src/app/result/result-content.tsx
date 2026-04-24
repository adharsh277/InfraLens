"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface JobStatus {
  job_id: string;
  status: "processing" | "completed" | "failed";
  repo_url: string;
  path?: string;
  error?: string;
  created_at: string;
  completed_at?: string;
  analysis?: {
    success: boolean;
    main_language?: string;
    languages?: Record<string, number>;
    file_count?: number;
    directory_count?: number;
    important_files?: Array<{
      name: string;
      path: string;
      description: string;
    }>;
    readme_preview?: string;
    architecture_insights?: string[];
  };
}

export function ResultContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job_id");
  
  // Debug logging
  console.log("📄 Result page loaded");
  console.log("🔍 Search params:", Object.fromEntries(searchParams));
  console.log("📌 Job ID:", jobId);
  
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(!!jobId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("⚙️ useEffect triggered, jobId:", jobId);
    if (!jobId) {
      console.log("⚠️ No jobId, skipping polling");
      return;
    }

    const pollStatus = async () => {
      try {
        console.log("🔄 Polling status for job:", jobId);
        
        const res = await fetch(`/api/status/${jobId}`);
        
        if (!res.ok) {
          console.error("❌ Status API error:", res.status);
          throw new Error("Failed to fetch job status");
        }

        const data = await res.json();
        console.log("📊 Job status response:", data);
        
        setJobStatus(data);
        setLoading(false);

        // Keep polling if still processing
        if (data.status === "processing") {
          console.log("⏳ Still processing, will poll again in 2s");
          setTimeout(pollStatus, 2000); // Poll every 2 seconds
        }
      } catch (err) {
        console.error("❌ Status fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    console.log("🚀 Starting first poll for jobId:", jobId);
    pollStatus();
  }, [jobId]);

  if (!jobId) {
    return (
      <>
        <h1 className="text-4xl font-semibold text-white">InfraLens Results</h1>
        <p className="mt-3 text-slate-300">No repo analyzed yet.</p>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="grid h-[380px] place-items-center rounded-2xl border border-dashed border-cyan-300/25 bg-[#0d1630]">
              <div className="text-center">
                <p className="text-lg font-medium text-white">No repo analyzed yet</p>
                <p className="mt-2 text-sm text-slate-400">
                  Your infrastructure graph will appear here after analysis.
                </p>
              </div>
            </div>
          </div>
          <aside className="rounded-3xl border border-white/10 bg-[#0f1730] p-6">
            <h2 className="text-lg font-semibold text-white">Start your first scan</h2>
            <p className="mt-3 text-sm text-slate-300">
              Paste a GitHub URL and let InfraLens generate architecture visuals and AI insights.
            </p>
            <Link href="/analyze" className="mt-5 inline-block">
              <Button>Analyze your first repo</Button>
            </Link>
          </aside>
        </section>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <h1 className="text-4xl font-semibold text-white">InfraLens Results</h1>
        <p className="mt-3 text-slate-300">Analyzing repository...</p>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="grid h-[380px] place-items-center rounded-2xl border border-dashed border-cyan-300/25 bg-[#0d1630]">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
                <p className="mt-4 text-lg font-medium text-white">Processing</p>
                <p className="mt-2 text-sm text-slate-400">Job ID: {jobId}</p>
              </div>
            </div>
          </div>
          <aside className="rounded-3xl border border-white/10 bg-[#0f1730] p-6">
            <h2 className="text-lg font-semibold text-white">Analysis in progress</h2>
            <p className="mt-3 text-sm text-slate-300">
              InfraLens is analyzing the repository. This may take a minute or two.
            </p>
          </aside>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className="text-4xl font-semibold text-white">InfraLens Results</h1>
        <p className="mt-3 text-slate-300">Error analyzing repository</p>

        <section className="mt-10">
          <div className="rounded-3xl border border-red-500/30 border-white/10 bg-red-500/10 p-6 backdrop-blur-xl">
            <p className="text-red-400">Error: {error}</p>
            <Link href="/analyze" className="mt-4 inline-block">
              <Button>Try another repository</Button>
            </Link>
          </div>
        </section>
      </>
    );
  }

  if (!jobStatus) {
    return (
      <>
        <h1 className="text-4xl font-semibold text-white">InfraLens Results</h1>
        <p className="mt-3 text-slate-300">Fetching analysis results...</p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-semibold text-white">InfraLens Results</h1>
      <p className="mt-3 text-slate-300">Repository analysis for {jobStatus.repo_url}</p>

      <section className="mt-10 grid gap-6">
        {/* Repository Overview */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">📊 Repository Overview</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-cyan-400 text-sm font-semibold">Primary Language</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {jobStatus.analysis?.main_language || "Unknown"}
              </p>
            </div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-cyan-400 text-sm font-semibold">Total Files</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {jobStatus.analysis?.file_count || 0}
              </p>
            </div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-cyan-400 text-sm font-semibold">Directories</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {jobStatus.analysis?.directory_count || 0}
              </p>
            </div>
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
              <p className="text-cyan-400 text-sm font-semibold">Languages</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {Object.keys(jobStatus.analysis?.languages || {}).length}
              </p>
            </div>
          </div>
        </div>

        {/* Programming Languages */}
        {jobStatus.analysis?.languages && Object.keys(jobStatus.analysis.languages).length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">💻 Programming Languages</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(jobStatus.analysis.languages)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([lang, count]) => {
                  const maxCount = Math.max(
                    ...(Object.values(jobStatus.analysis?.languages || {}) as number[])
                  );
                  return (
                    <div key={lang} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-3">
                      <span className="font-semibold text-cyan-300 capitalize">{lang}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex h-2 w-32 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-400 to-cyan-600"
                            style={{
                              width: `${Math.min(100, ((count as number) / maxCount) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-300 font-mono w-20 text-right">
                          {count as number} files
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Architecture Insights */}
        {jobStatus.analysis?.architecture_insights &&
          jobStatus.analysis.architecture_insights.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white">⚙️ Architecture & Insights</h2>
              <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                {jobStatus.analysis.architecture_insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-3"
                  >
                    <span className="text-lg">📌</span>
                    <p className="text-sm text-slate-200">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Important Files */}
        {jobStatus.analysis?.important_files &&
          jobStatus.analysis.important_files.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white">📁 Important Files Detected</h2>
              <div className="mt-4 space-y-2">
                {jobStatus.analysis.important_files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-3"
                  >
                    <div>
                      <p className="font-mono text-cyan-300 text-sm">{file.name}</p>
                      <p className="text-xs text-slate-400 mt-1">Path: {file.path}</p>
                    </div>
                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                      {file.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* README Preview */}
        {jobStatus.analysis?.readme_preview && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">📖 README Preview</h2>
            <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 p-4">
              <pre className="text-xs text-slate-300 overflow-auto max-h-48 font-mono whitespace-pre-wrap break-words">
                {jobStatus.analysis.readme_preview}
                {(jobStatus.analysis.readme_preview?.length || 0) > 500 && "...\n[truncated]"}
              </pre>
            </div>
          </div>
        )}

        {/* Job Metadata */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">🏷️ Job Metadata</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
              <p className="text-slate-400 text-xs uppercase font-semibold">Job ID</p>
              <p className="mt-2 font-mono text-cyan-300 text-sm break-all">{jobStatus.job_id}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
              <p className="text-slate-400 text-xs uppercase font-semibold">Status</p>
              <p className="mt-2 text-green-400 font-semibold">{jobStatus.status.toUpperCase()}</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
              <p className="text-slate-400 text-xs uppercase font-semibold">Analysis Started</p>
              <p className="mt-2 text-slate-300 text-sm">
                {new Date(jobStatus.created_at).toLocaleString()}
              </p>
            </div>
            {jobStatus.completed_at && (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
                <p className="text-slate-400 text-xs uppercase font-semibold">Analysis Completed</p>
                <p className="mt-2 text-slate-300 text-sm">
                  {new Date(jobStatus.completed_at).toLocaleString()}
                </p>
              </div>
            )}
            {jobStatus.path && (
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 md:col-span-2">
                <p className="text-slate-400 text-xs uppercase font-semibold">Repository Path</p>
                <p className="mt-2 font-mono text-slate-300 text-sm break-all">{jobStatus.path}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-10 flex gap-4">
        <Link href="/analyze">
          <Button className="bg-cyan-600 hover:bg-cyan-700">Analyze another repo</Button>
        </Link>
      </div>
    </>
  );
}
