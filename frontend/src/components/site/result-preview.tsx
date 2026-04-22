"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function ResultPreview() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" id="pricing">
      <div className="mx-auto grid w-full max-w-7xl gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-3xl font-semibold text-white">Result Dashboard Preview</h2>
          <p className="mt-3 text-slate-300">
            Empty state optimized for first-run activation and onboarding.
          </p>
          <div className="mt-6 h-64 rounded-2xl border border-dashed border-white/20 bg-[#0a0a0a] p-6">
            <motion.div
              className="relative grid h-full place-items-center overflow-hidden rounded-xl border border-white/10 bg-[#000000]"
              animate={{ boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 34px rgba(0,0,0,0.16)", "0 0 0 rgba(0,0,0,0)"] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="absolute inset-y-0 -left-16 w-16 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: [0, 420] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
              />
              <div className="text-center">
                <p className="text-base font-medium text-white">No repo analyzed yet</p>
                <p className="mt-2 text-sm text-slate-400">
                  Add a repository to generate a full architecture map.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <aside className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
          <h3 className="text-lg font-semibold text-white">Ready to analyze?</h3>
          <p className="mt-2 text-sm text-slate-300">
            Start with your Terraform or Kubernetes repo and get an instant system blueprint.
          </p>
          <Link href="/analyze" className="mt-5 inline-block">
            <Button>Analyze your first repo</Button>
          </Link>
        </aside>
      </div>
    </section>
  );
}
