"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const links = [
  { label: "Features", href: "#features" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "GitHub", href: "https://github.com/adharsh277/InfraLens" },
];

export function Navbar() {
  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-cyan-200/12 bg-[#03070f]/82 shadow-[0_1px_16px_rgba(34,211,238,0.06)] backdrop-blur-2xl"
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500 shadow-[0_0_14px_rgba(56,189,248,0.45)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">InfraLens</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-slate-200 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/analyze">
          <Button size="sm" className="h-10 animate-[pulseGlow_3s_ease-in-out_infinite] px-4">
            Try Now
          </Button>
        </Link>
      </nav>
    </motion.header>
  );
}
