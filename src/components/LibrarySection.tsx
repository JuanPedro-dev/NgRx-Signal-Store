import { useState } from 'react';
import CodeBlock from './CodeBlock';
import {
  generateBaseTypes,
  generateInitialStateFactory,
  generateStoreFactory,
  generatePublicApi,
  generateCrudFeature,
  generateLibraryIndex,
} from '../utils/codeGenerator';
import { Code2, Database, Cog, Box, Plug, BookOpen } from 'lucide-react';

const tabs = [
  { id: 'types', label: 'Tipos Base', icon: Database, gen: generateBaseTypes },
  { id: 'initial', label: 'Initial State', icon: Cog, gen: generateInitialStateFactory },
  { id: 'factory', label: 'Store Factory', icon: Box, gen: generateStoreFactory },
  { id: 'crud', label: 'CRUD Feature', icon: Plug, gen: generateCrudFeature },
  { id: 'api', label: 'store.create()', icon: Code2, gen: generatePublicApi },
  { id: 'index', label: 'Public API', icon: BookOpen, gen: generateLibraryIndex },
];

export default function LibrarySection() {
  const [activeTab, setActiveTab] = useState('types');

  const activeTabData = tabs.find((t) => t.id === activeTab);
  const file = activeTabData ? activeTabData.gen() : generateBaseTypes();

  return (
    <section id="library" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
            Implementación
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Código de la <span className="text-amber-400">Librería</span>
          </h2>
          <p className="text-surface-400 max-w-xl mx-auto text-lg">
            Implementación completa de cada archivo del core library.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                    : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:border-surface-600/50 hover:text-surface-300'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Code */}
        <div className="animate-fadeIn" key={activeTab}>
          <CodeBlock
            code={file.content}
            language={file.language}
            fileName={file.path}
            maxHeight="600px"
          />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-surface-800/30 rounded-xl border border-surface-700/50 p-5">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="text-white font-bold text-sm mb-2">Type-Safe Generics</h4>
            <p className="text-surface-400 text-sm">
              <code className="text-primary-300">{'<T extends BaseEntity, Extra>'}</code> garantiza tipado completo en toda la cadena.
            </p>
          </div>
          <div className="bg-surface-800/30 rounded-xl border border-surface-700/50 p-5">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="text-white font-bold text-sm mb-2">Pre-built Methods</h4>
            <p className="text-surface-400 text-sm">
              15+ métodos incluidos: <code className="text-emerald-300">setLoading</code>, <code className="text-emerald-300">markCreated</code>, <code className="text-emerald-300">resetFlags</code>...
            </p>
          </div>
          <div className="bg-surface-800/30 rounded-xl border border-surface-700/50 p-5">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="text-white font-bold text-sm mb-2">Computed Signals</h4>
            <p className="text-surface-400 text-sm">
              10+ computed signals auto-generados: <code className="text-cyan-300">entityList</code>, <code className="text-cyan-300">totalPages</code>, <code className="text-cyan-300">hasActiveOperation</code>...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
