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
      <div className="mx-auto w-full max-w-7xl rounded-3xl border border-sky-200/18 bg-[#050d1a]/90 p-6 shadow-[0_24px_70px_rgba(56,189,248,0.18)] backdrop-blur-2xl sm:p-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200/90">
              Live Preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Real-time Infra Graph
            </h2>
          </div>
          <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs text-sky-200">
            Streaming
          </span>
        </div>

        <div className="relative h-[380px] overflow-hidden rounded-2xl border border-sky-200/18 bg-[#030913]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="flow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="55%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
            <path d="M15 18 L46 52" stroke="url(#flow)" strokeWidth="0.5" fill="none" />
            <path d="M82 20 L46 52" stroke="url(#flow)" strokeWidth="0.5" fill="none" />
            <path d="M46 52 L24 82" stroke="url(#flow)" strokeWidth="0.5" fill="none" />
            <path d="M46 52 L76 80" stroke="url(#flow)" strokeWidth="0.5" fill="none" />
            <circle cx="46" cy="52" r="1.7" fill="#22d3ee">
              <animate attributeName="r" values="1.7;2.4;1.7" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </svg>

          {infraNodes.map((node) => (
            <div
              key={node.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-200/35 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.35)] backdrop-blur-md"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                animation: "float 5s ease-in-out infinite",
              }}
            >
              {node.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
