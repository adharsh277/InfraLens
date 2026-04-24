import { Suspense } from "react";
import { Navbar } from "@/components/site/navbar";
import { ResultContent } from "./result-content";

interface JobStatus {
  job_id: string;
  status: "processing" | "completed" | "failed";
  repo_url: string;
  path?: string;
  error?: string;
  created_at: string;
  completed_at?: string;
}

function ResultSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-white">InfraLens Results</h1>
        <p className="mt-3 text-slate-300">Loading...</p>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Suspense fallback={<ResultSkeleton />}>
          <ResultContent />
        </Suspense>
      </main>
    </div>
  );
}
