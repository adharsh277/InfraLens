"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

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
          <Image
            src="/automationai.png"
            alt="Infrastructure automation visualization"
            width={540}
            height={380}
            className="h-full w-full rounded-2xl object-cover"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}