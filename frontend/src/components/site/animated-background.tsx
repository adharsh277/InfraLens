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
      <div className="absolute inset-0 bg-[#000000]/70" />
      <motion.div
        className="absolute -top-40 left-[-8%] h-[420px] w-[420px] rounded-full bg-sky-400/12 blur-[140px]"
        animate={{ x: [0, 40, 0], y: [0, 26, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-[-12%] h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-[130px]"
        animate={{ x: [0, -35, 0], y: [0, 22, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.div
        className="absolute bottom-[-18%] left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[150px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.34, 0.5, 0.34] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-cyan-300/55 shadow-[0_0_12px_rgba(34,211,238,0.45)]"
          style={{ top: particle.top, left: particle.left }}
          animate={{ y: [-6, 14, -6], opacity: [0.24, 0.8, 0.24] }}
          transition={{
            duration: 6 + (particle.id % 5),
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}