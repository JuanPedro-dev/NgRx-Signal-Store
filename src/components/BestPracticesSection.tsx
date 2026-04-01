import { Check, X, Zap, Shield, Boxes, Sparkles } from 'lucide-react';

const dos = [
  'Usa store.create() para cada entidad',
  'Extiende con generics <T, Extra> nunca modifiques BaseState',
  'Usa computed() para señales derivadas',
  'Usa effect() con cleanup para side effects',
  'Inyecta stores con inject() en componentes standalone',
  'Usa patchState() en vez de mutación directa',
  'Mantén un default entity por cada tipo',
  'Separa models, store y components por feature',
];

const donts = [
  'No dupliques la estructura base en cada store',
  'No uses Subject/BehaviorSubject — usa Signals',
  'No modifiques el state directamente',
  'No crees stores sin tipado genérico',
  'No mezcles lógica de UI con el store',
  'No olvides resetFlags() después de operaciones',
  'No hagas subscribe manual — usa signal reads',
  'No crees computed signals dentro de templates',
];

const angularTips = [
  {
    icon: Zap,
    title: 'Signals First',
    desc: 'Angular 21 promueve Signals sobre RxJS para estado local. Los signalStore son la opción recomendada.',
    color: 'text-amber-400',
  },
  {
    icon: Shield,
    title: 'Standalone Everything',
    desc: 'Todos los componentes, directivas y pipes deben ser standalone. No uses NgModules.',
    color: 'text-emerald-400',
  },
  {
    icon: Boxes,
    title: 'Input Signals',
    desc: 'Usa input() y output() como signals. model() para two-way binding con PrimeNG.',
    color: 'text-primary-400',
  },
  {
    icon: Sparkles,
    title: 'Zoneless Mode',
    desc: 'Angular 21 soporta zoneless. Los SignalStores son compatibles out-of-the-box.',
    color: 'text-cyan-400',
  },
];

const checklist = [
  '✅ Librería store/ como Nx library',
  '✅ BaseEntity y BaseState genéricos',
  '✅ createInitialState() factory',
  '✅ createEntityStore() factory',
  '✅ store.create() como API pública',
  '✅ withCrudEffects() como feature reutilizable',
  '✅ ~10 líneas por entidad nueva',
  '✅ PrimeNG v21 p-table con lazy loading',
  '✅ Tipado end-to-end con generics',
  '✅ Export como .zip desde el generador',
];

export default function BestPracticesSection() {
  return (
    <section id="practices" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
            Buenas Prácticas
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Do's & <span className="text-rose-400">Don'ts</span>
          </h2>
          <p className="text-surface-400 max-w-xl mx-auto text-lg">
            Mejores prácticas para Angular 21 + Signals + NgRx SignalStore.
          </p>
        </div>

        {/* Do's and Don'ts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Do's */}
          <div className="bg-surface-800/30 rounded-2xl border border-emerald-500/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Check size={20} className="text-emerald-400" />
              </div>
              <h3 className="text-emerald-400 font-bold text-xl">DO</h3>
            </div>
            <div className="space-y-3">
              {dos.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-surface-300 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Don'ts */}
          <div className="bg-surface-800/30 rounded-2xl border border-rose-500/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <X size={20} className="text-rose-400" />
              </div>
              <h3 className="text-rose-400 font-bold text-xl">DON'T</h3>
            </div>
            <div className="space-y-3">
              {donts.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <X size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                  <span className="text-surface-300 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Angular 21 Tips */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            ⚡ Tips Angular 21 + Signals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {angularTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="bg-surface-800/30 rounded-2xl border border-surface-700/50 p-5 hover:border-primary-500/20 transition-all group"
                >
                  <Icon
                    size={24}
                    className={`${tip.color} mb-3 group-hover:scale-110 transition-transform`}
                  />
                  <h4 className="text-white font-bold text-sm mb-2">{tip.title}</h4>
                  <p className="text-surface-400 text-sm leading-relaxed">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scalability Checklist */}
        <div className="bg-gradient-to-br from-primary-500/5 to-emerald-500/5 rounded-2xl border border-primary-500/20 p-8">
          <h3 className="text-white font-bold text-xl mb-6 text-center">
            📋 Checklist de Escalabilidad (20+ Entities)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {checklist.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-900/40 border border-surface-700/30 text-surface-300 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
