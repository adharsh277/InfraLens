import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#02050d] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>InfraLens. AI infrastructure understanding for modern DevOps teams.</p>
        <div className="flex items-center gap-5">
          <Link href="#features" className="hover:text-cyan-300">
            Features
          </Link>
          <Link href="#docs" className="hover:text-cyan-300">
            Docs
          </Link>
          <Link href="https://github.com/adharsh277/InfraLens" className="hover:text-cyan-300">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
