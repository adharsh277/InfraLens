"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 16 }).map((_, index) => ({
  id: index,
  top: `${10 + (index % 8) * 11}%`,
  left: `${5 + (index * 13) % 90}%`,
  delay: index * 0.22,
}));

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#000000]" />
    </div>
  );
}