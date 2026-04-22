"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const infraNodes = [
  { name: "EC2", x: 15, y: 18 },
  { name: "S3", x: 82, y: 20 },
  { name: "K8s Pod", x: 46, y: 52 },
  { name: "Postgres", x: 24, y: 82 },
  { name: "Redis", x: 76, y: 80 },
];

export function LivePreview() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" id="preview">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200/90">
              Live Preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              AI Intelligence Visualization
            </h2>
          </div>
          <span className="px-3 py-1 text-xs text-sky-200">
            Streaming
          </span>
        </div>

        <motion.div
          className="relative h-[380px] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <Image
            src="/ai.png"
            alt="AI Intelligence Visualization"
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
