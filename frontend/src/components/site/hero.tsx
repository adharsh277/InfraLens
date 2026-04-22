"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pt-6 lg:pb-20">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-2">
        <motion.div
          className="space-y-7 lg:pt-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-xl"
          >
            AI-Powered DevOps Clarity
          </motion.div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Understand Your <span className="text-sky-400">Infrastructure Instantly</span>
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Turn complex Terraform and Kubernetes repos into clear visual systems
            powered by AI.
          </p>
          <div className="rounded-2xl border border-white/15 bg-[#0a1121]/80 p-3 backdrop-blur-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="group flex flex-1 items-center gap-2 rounded-xl border border-white/8 bg-[#050b18] px-3 transition-all duration-300 focus-within:border-white/30">
                <GitBranch className="h-4 w-4 text-slate-400" />
                <input
                  aria-label="GitHub repository URL"
                  className="h-11 w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  placeholder="https://github.com/user/repo"
                  defaultValue="https://github.com/acme/terraform-platform"
                />
              </div>
              <Link href="/analyze">
                <Button className="w-full sm:w-auto">
                  Analyze Repo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative h-[420px] overflow-hidden lg:-mr-28 lg:h-[580px]"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.18 }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="/infra.png"
              alt="Infrastructure architecture preview"
              fill
              priority
              className="object-cover object-center opacity-100"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/18 via-black/8 to-black/75" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/65 via-black/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
