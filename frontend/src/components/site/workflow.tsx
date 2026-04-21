"use client";

import { motion } from "framer-motion";

const steps = [
  "Paste GitHub Repo",
  "InfraLens scans code",
  "Visual graph generated",
  "AI explains system",
];

export function Workflow() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" id="docs">
      <div className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-[#070e1c]/88 p-8">
        <h2 className="text-3xl font-semibold text-white">Workflow in Seconds</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              className="relative rounded-xl border border-white/10 bg-[#0f172f]/80 p-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -5 }}
            >
              <span className="text-xs text-cyan-300">Step {index + 1}</span>
              <p className="mt-2 text-sm font-medium text-white">{step}</p>
              {index < steps.length - 1 ? (
                <motion.span
                  className="absolute top-1/2 -right-3 hidden h-0.5 w-6 bg-gradient-to-r from-cyan-300 to-transparent lg:block"
                  animate={{ opacity: [0.35, 1, 0.35], scaleX: [0.8, 1.15, 0.8] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
