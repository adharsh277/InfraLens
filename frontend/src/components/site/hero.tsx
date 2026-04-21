"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";

const systemNodes = [
  { label: "EC2", x: 16, y: 22 },
  { label: "S3", x: 80, y: 18 },
  { label: "RDS", x: 20, y: 76 },
  { label: "Kubernetes", x: 50, y: 52 },
  { label: "Load Balancer", x: 82, y: 74 },
];

const links = [
  { from: "EC2", to: "Kubernetes", path: "M75 84 C125 120, 165 148, 206 170" },
  { from: "S3", to: "Kubernetes", path: "M290 76 C258 110, 233 135, 206 170" },
  { from: "Kubernetes", to: "RDS", path: "M206 170 C164 204, 124 226, 88 252" },
  {
    from: "Kubernetes",
    to: "Load Balancer",
    path: "M206 170 C246 192, 270 214, 294 244",
  },
];

export function Hero() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const activeLinks = useMemo(() => {
    if (!hoveredNode) {
      return links;
    }

    return links.filter((link) => link.from === hoveredNode || link.to === hoveredNode);
  }, [hoveredNode]);

  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          className="space-y-7"
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
          className="relative h-[390px] rounded-3xl border border-white/15 bg-[#0a1222]/86 p-6 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.18 }}
        >
          <div className="absolute inset-4 rounded-2xl border border-white/8 bg-[#080f1e]/95" />
          <div className="relative h-full w-full">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 300">
              <defs>
                <linearGradient id="dataLine" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="55%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>

              {activeLinks.map((link) => (
                <g key={link.path}>
                  <path
                    d={link.path}
                    stroke="url(#dataLine)"
                    strokeWidth="2"
                    opacity="0.32"
                    fill="none"
                  />
                  <path
                    d={link.path}
                    stroke="url(#dataLine)"
                    strokeWidth="2.6"
                    opacity="0.9"
                    fill="none"
                    strokeDasharray="8 12"
                    className="animate-[flow_4s_linear_infinite]"
                  />
                  <circle r="3.1" fill="#67e8f9" opacity="0.92">
                    <animateMotion dur="3.4s" repeatCount="indefinite" path={link.path} />
                  </circle>
                </g>
              ))}
            </svg>

            {systemNodes.map((node, index) => (
              <motion.button
                key={node.label}
                type="button"
                onHoverStart={() => setHoveredNode(node.label)}
                onHoverEnd={() => setHoveredNode(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/50"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: 1,
                  y: [0, -4, 0],
                }}
                transition={{
                  opacity: { duration: 0.38, delay: index * 0.07 },
                  y: { duration: 3.2 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                {node.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
