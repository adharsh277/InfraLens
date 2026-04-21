"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Sparkles, Workflow } from "lucide-react";

const cards = [
  {
    title: "Visualization",
    description:
      "Map Terraform, Kubernetes, and cloud resources into a graph your team can reason about instantly.",
    icon: Workflow,
  },
  {
    title: "AI Explanation",
    description:
      "Ask InfraLens anything about your infra and get architecture-aware explanations with dependency context.",
    icon: Sparkles,
  },
  {
    title: "Risk Detection",
    description:
      "Catch blast-radius hotspots, missing guardrails, and fragile paths before they hit production.",
    icon: ShieldAlert,
  },
];

export function Features() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" id="features">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-3xl font-semibold text-white">Built for DevOps Teams</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          InfraLens removes guesswork from complex systems with visual intelligence.
        </p>
        <motion.div
          className="mt-8 grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.22)]"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                whileHover={{ y: -7 }}
              >
                <motion.span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200/30 bg-cyan-300/10 text-cyan-200"
                  animate={{ boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 20px rgba(34,211,238,0.26)", "0 0 0 rgba(34,211,238,0)"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </motion.span>
                <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
