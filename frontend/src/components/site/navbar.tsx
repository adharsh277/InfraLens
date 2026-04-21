"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
      className="sticky top-0 z-40 border-b border-white/10 bg-[#000000]"
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <Image src="/logo.svg" alt="InfraLens Logo" width={32} height={32} className="h-8 w-8" priority />
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
          <Button size="sm" className="h-10 px-4">
            Try Now
          </Button>
        </Link>
      </nav>
    </motion.header>
  );
}
