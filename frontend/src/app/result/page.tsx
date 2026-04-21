import Link from "next/link";

import { Navbar } from "@/components/site/navbar";
import { Button } from "@/components/ui/button";

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
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
      </main>
    </div>
  );
}
