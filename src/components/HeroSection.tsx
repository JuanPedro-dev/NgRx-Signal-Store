import { Zap, Shield, Boxes, Sparkles, ArrowDown } from 'lucide-react';

const features = [
  { icon: Zap, label: 'Signals', color: 'text-amber-400' },
  { icon: Shield, label: 'Type-Safe', color: 'text-emerald-400' },
  { icon: Boxes, label: 'Factory Pattern', color: 'text-primary-400' },
  { icon: Sparkles, label: '20+ Entities', color: 'text-cyan-400' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center animate-slideUp">
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
          <span className="bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
            Factory Architecture store.create()
          </span>
          <br />
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Librería reutilizable para manejo de estado con{" "}
          <span className="text-primary-400 font-semibold">Signals</span>,{" "}
          <span className="text-emerald-400 font-semibold">
            genéricos type-safe
          </span>{" "}
          y <span className="text-cyan-400 font-semibold">factory pattern</span>
          . Escala a 20+ entidades sin duplicar código.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700/50 hover:border-primary-500/30 transition-all hover:scale-105"
              >
                <Icon size={16} className={f.color} />
                <span className="text-sm text-surface-200 font-medium">
                  {f.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Code Preview */}
        <div className="max-w-lg mx-auto animate-pulse-glow rounded-2xl">
          <div className="bg-surface-900/90 rounded-2xl border border-surface-700/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-800/60 border-b border-surface-700/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <span className="text-xs text-surface-500 font-mono ml-2">
                store.create.ts
              </span>
            </div>
            <div className="p-5 text-left font-mono text-sm leading-relaxed">
              <div className="text-surface-500">
                {"// Create stores in 1 line"}
              </div>
              <div>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-cyan-300">StatusStore</span>{" "}
                <span className="text-surface-400">=</span>{" "}
                <span className="text-amber-300">store</span>
                <span className="text-surface-400">.</span>
                <span className="text-emerald-400">create</span>
                <span className="text-surface-400">(</span>
                <span className="text-amber-200">{"{"}</span>
              </div>
              <div className="pl-4">
                <span className="text-surface-300">name:</span>{" "}
                <span className="text-emerald-300">'Status'</span>
                <span className="text-surface-400">,</span>
              </div>
              <div className="pl-4">
                <span className="text-surface-300">defaultEntity:</span>{" "}
                <span className="text-cyan-300">defaultStatus</span>
              </div>
              <div>
                <span className="text-amber-200">{"}"}</span>
                <span className="text-surface-400">);</span>
              </div>
              <div className="mt-3 text-surface-500">{"// Extended state"}</div>
              <div>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-cyan-300">ProductStore</span>{" "}
                <span className="text-surface-400">=</span>{" "}
                <span className="text-amber-300">store</span>
                <span className="text-surface-400">.</span>
                <span className="text-emerald-400">create</span>
                <span className="text-surface-400">{"<"}</span>
                <span className="text-amber-200">Product</span>
                <span className="text-surface-400">,</span>{" "}
                <span className="text-amber-200">Extra</span>
                <span className="text-surface-400">{">"}</span>
                <span className="text-surface-400">(</span>
                <span className="text-amber-200">{"{"}</span>
              </div>
              <div className="pl-4">
                <span className="text-surface-300">name:</span>{" "}
                <span className="text-emerald-300">'Product'</span>
                <span className="text-surface-400">,</span>
              </div>
              <div className="pl-4">
                <span className="text-surface-300">defaultEntity</span>
                <span className="text-surface-400">,</span>{" "}
                <span className="text-surface-300">extra</span>
              </div>
              <div>
                <span className="text-amber-200">{"}"}</span>
                <span className="text-surface-400">);</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() =>
            document
              .getElementById("architecture")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-12 inline-flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors animate-bounce"
        >
          <ArrowDown size={20} />
        </button>
      </div>
    </section>
  );
}
