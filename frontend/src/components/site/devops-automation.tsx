"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const capabilities = [
  {
    title: "Infrastructure Graph Intelligence",
    description:
      "Convert Terraform and Kubernetes repositories into a living map of services, dependencies, and environments.",
  },
  {
    title: "Automated Context for Teams",
    description:
      "Generate deployment-ready explanations for platform, SRE, and security teams without manual diagram upkeep.",
  },
  {
    title: "Risk and Blast Radius Insights",
    description:
      "Detect fragile paths and high-impact resource changes before production incidents.",
  },
];

export function DevopsAutomation() {
  return (
    <section className="px-4 py-18 sm:px-6 lg:px-8" id="devops-automation">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 rounded-3xl border border-white/15 bg-[#040b1a]/90 p-6 backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300/90">
            AI for DevOps and Automation
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Unleash delivery speed with InfraLens intelligence
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            InfraLens helps engineering teams move faster by understanding their full
            infrastructure system in seconds. From IaC to Kubernetes runtime topology,
            every relation is visual, explainable, and ready for action.
          </p>

          <div className="mt-7 space-y-4">
            {capabilities.map((capability, index) => (
              <motion.article
                key={capability.title}
                className="rounded-2xl border border-sky-200/15 bg-sky-500/[0.06] p-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <h3 className="text-base font-semibold text-white">{capability.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {capability.description}
                </p>
              </motion.article>
            ))}
          </div>

          <Button className="mt-6">
            Learn more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#060f23] p-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <svg viewBox="0 0 540 380" className="relative h-full w-full" fill="none">
            <defs>
              <linearGradient id="laneA" x1="80" y1="90" x2="460" y2="280">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="laneB" x1="70" y1="300" x2="470" y2="90">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.45" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              </filter>
            </defs>

            <path
              d="M60 74 C120 130, 194 146, 280 160 C346 170, 420 218, 492 294"
              stroke="url(#laneA)"
              strokeWidth="20"
              strokeLinecap="round"
              filter="url(#glow)"
              opacity="0.75"
            />
            <path
              d="M72 310 C132 252, 212 226, 292 198 C356 176, 420 122, 478 74"
              stroke="url(#laneB)"
              strokeWidth="15"
              strokeLinecap="round"
              filter="url(#glow)"
              opacity="0.8"
            />

            <circle cx="274" cy="176" r="14" fill="#7dd3fc" opacity="0.9">
              <animate attributeName="r" values="14;19;14" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="382" cy="226" r="8" fill="#22d3ee" opacity="0.95">
              <animate attributeName="cy" values="226;220;226" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="186" cy="246" r="8" fill="#38bdf8" opacity="0.95">
              <animate attributeName="cy" values="246;240;246" dur="2.1s" repeatCount="indefinite" />
            </circle>
          </svg>
          <p className="relative mt-3 text-sm text-sky-100/90">
            AI-generated visual concept: infrastructure flow lanes and dependency energy map.
          </p>
        </motion.div>
      </div>
    </section>
  );
}