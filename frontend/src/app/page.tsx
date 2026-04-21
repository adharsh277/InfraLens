import { AnimatedBackground } from "@/components/site/animated-background";
import { DevopsAutomation } from "@/components/site/devops-automation";
import { Features } from "@/components/site/features";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { LivePreview } from "@/components/site/live-preview";
import { Navbar } from "@/components/site/navbar";
import { ResultPreview } from "@/components/site/result-preview";
import { Workflow } from "@/components/site/workflow";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#000000]">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <DevopsAutomation />
          <LivePreview />
          <Features />
          <Workflow />
          <ResultPreview />
        </main>
        <Footer />
      </div>
    </div>
  );
}
