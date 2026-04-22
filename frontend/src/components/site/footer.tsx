import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#02050d] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <p className="max-w-md text-sm text-slate-300">
              InfraLens. AI infrastructure understanding for modern DevOps teams.
            </p>
            <p className="text-xs text-slate-500">
              Instantly visualize, analyze, and optimize your infrastructure with AI.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
                Product
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-slate-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#docs" className="text-slate-400 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/analyze" className="text-slate-400 hover:text-white transition-colors">
                    Analyze
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
                Resources
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 py-8" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © 2024 InfraLens. All rights reserved. | AI infrastructure intelligence platform.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-5">
            <Link
              href="https://github.com/adharsh277/InfraLens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              title="GitHub"
            >
              GitHub
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              title="Twitter"
            >
              Twitter
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              title="LinkedIn"
            >
              LinkedIn
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              title="Instagram"
            >
              Instagram
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="mailto:contact@infralens.com"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              title="Email"
            >
              Email
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
