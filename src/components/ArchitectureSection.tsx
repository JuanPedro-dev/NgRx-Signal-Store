import { ArrowRight, Database, Cog, Layout, Box } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: 'BaseEntity + BaseState<T>',
    desc: 'Tipos genéricos compartidos entre todas las entidades',
    color: 'from-primary-500 to-primary-700',
    shadow: 'shadow-primary-500/20',
  },
  {
    icon: Cog,
    title: 'createInitialState<T, Extra>',
    desc: 'Factory que genera el estado inicial con extensiones opcionales',
    color: 'from-emerald-500 to-emerald-700',
    shadow: 'shadow-emerald-500/20',
  },
  {
    icon: Box,
    title: 'createEntityStore<T, Extra>',
    desc: 'signalStore con computed, methods y state tipado',
    color: 'from-amber-500 to-amber-700',
    shadow: 'shadow-amber-500/20',
  },
  {
    icon: Layout,
    title: 'Component inject(Store)',
    desc: 'Inyección en componentes con PrimeNG v21',
    color: 'from-cyan-500 to-cyan-700',
    shadow: 'shadow-cyan-500/20',
  },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-400 mb-3">
            Arquitectura
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Flujo del <span className="text-primary-400">Factory Pattern</span>
          </h2>
          <p className="text-surface-400 max-w-xl mx-auto text-lg">
            Desde los tipos base hasta el componente, todo fluye a través del factory pattern.
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="flex flex-wrap gap-4 md:gap-2 mb-16 items-stretch">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex items-center gap-4 flex-basis-full justify-around"
              >
                <div className="flex-1 max-w-[250px]  h-full bg-surface-800/50 rounded-2xl border border-surface-700/50 p-6 hover:border-primary-500/30 transition-all group overflow-hidden">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-lg ${step.shadow} group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2 font-mono">
                    {step.title}
                  </h3>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight
                    size={20}
                    className="text-surface-600 hidden md:block flex-shrink-0"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Steps */}
        <div className="bg-surface-800/30 rounded-2xl border border-surface-700/50 p-8">
          <h3 className="text-white font-bold text-xl mb-6">⚡ Quick Start — 3 Pasos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Define tu Entity',
                code: 'interface ProductEntity extends BaseEntity {\n  price: number;\n  category: string;\n}',
              },
              {
                step: '2',
                title: 'Crea el Store',
                code: "const ProductStore = store.create<\n  ProductEntity, ProductExtra\n>({\n  name: 'Product',\n  defaultEntity,\n  extra\n});",
              },
              {
                step: '3',
                title: 'Inyecta y usa',
                code: 'readonly store = inject(ProductStore);\n\n// Signal reads\nstore.entityList();\nstore.isLoading();\nstore.totalElements();',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="absolute -top-3 -left-2 w-8 h-8 rounded-lg bg-primary-500 flex items-stretch justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/30 z-10">
                  {item.step}
                </div>
                <div className="bg-surface-900/80 rounded-xl border border-surface-700/50 p-5 pt-7 h-full">
                  <h4 className="text-white font-semibold text-sm mb-3">{item.title}</h4>
                  <pre className="text-xs text-surface-300 font-mono leading-relaxed overflow-x-auto">
                    <code>{item.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
