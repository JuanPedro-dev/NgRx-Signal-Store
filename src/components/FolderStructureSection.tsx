import { Folder, FileCode, ChevronRight } from 'lucide-react';

interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  highlight?: boolean;
  children?: TreeNode[];
}

const tree: TreeNode[] = [
  {
    name: 'libs/',
    type: 'folder',
    children: [
      {
        name: 'store/',
        type: 'folder',
        highlight: true,
        children: [
          {
            name: 'src/',
            type: 'folder',
            children: [
              {
                name: 'lib/',
                type: 'folder',
                children: [
                  {
                    name: 'models/',
                    type: 'folder',
                    children: [{ name: 'base.models.ts', type: 'file', highlight: true }],
                  },
                  {
                    name: 'factories/',
                    type: 'folder',
                    children: [
                      { name: 'initial-state.factory.ts', type: 'file', highlight: true },
                      { name: 'store.factory.ts', type: 'file', highlight: true },
                    ],
                  },
                  {
                    name: 'features/',
                    type: 'folder',
                    children: [
                      { name: 'with-crud-effects.feature.ts', type: 'file', highlight: true },
                    ],
                  },
                  { name: 'store.create.ts', type: 'file', highlight: true },
                ],
              },
              { name: 'index.ts', type: 'file', highlight: true },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'features/',
    type: 'folder',
    children: [
      {
        name: 'status/',
        type: 'folder',
        children: [
          {
            name: 'models/',
            type: 'folder',
            children: [{ name: 'status.models.ts', type: 'file' }],
          },
          {
            name: 'store/',
            type: 'folder',
            children: [{ name: 'status.store.ts', type: 'file' }],
          },
          {
            name: 'components/',
            type: 'folder',
            children: [{ name: 'status-list.component.ts', type: 'file' }],
          },
        ],
      },
      {
        name: 'product/',
        type: 'folder',
        children: [
          {
            name: 'models/',
            type: 'folder',
            children: [{ name: 'product.models.ts', type: 'file' }],
          },
          {
            name: 'store/',
            type: 'folder',
            children: [{ name: 'product.store.ts', type: 'file' }],
          },
          {
            name: 'components/',
            type: 'folder',
            children: [{ name: 'product-list.component.ts', type: 'file' }],
          },
        ],
      },
      {
        name: '... (20+ entities)',
        type: 'folder',
      },
    ],
  },
];

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const isFolder = node.type === 'folder';
  return (
    <div style={{ paddingLeft: `${depth * 20}px` }}>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${
          node.highlight
            ? 'bg-primary-500/10 text-primary-300'
            : 'text-surface-300 hover:bg-surface-700/30'
        }`}
      >
        {isFolder ? (
          <>
            <ChevronRight size={14} className="text-surface-500" />
            <Folder size={15} className={node.highlight ? 'text-primary-400' : 'text-amber-400'} />
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <FileCode size={15} className={node.highlight ? 'text-primary-400' : 'text-emerald-400'} />
          </>
        )}
        <span className="text-sm font-mono">{node.name}</span>
      </div>
      {node.children?.map((child, i) => (
        <TreeItem key={`${child.name}-${i}`} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function FolderStructureSection() {
  return (
    <section id="structure" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
            Estructura
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Estructura de <span className="text-emerald-400">Carpetas</span>
          </h2>
          <p className="text-surface-400 max-w-xl mx-auto text-lg">
            Organización Nx monorepo con librería compartida y features por entidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tree */}
          <div className="bg-surface-800/30 rounded-2xl border border-surface-700/50 p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-surface-700/50">
              <Folder size={18} className="text-amber-400" />
              <span className="text-white font-bold">Project Structure</span>
            </div>
            <div className="space-y-0.5">
              {tree.map((node, i) => (
                <TreeItem key={`${node.name}-${i}`} node={node} />
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-4">
            <div className="bg-surface-800/30 rounded-2xl border border-surface-700/50 p-6 hover:border-primary-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <span className="text-primary-400 font-bold text-sm">📦</span>
                </div>
                <h3 className="text-white font-bold">libs/store/</h3>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed">
                La librería central reutilizable. Contiene los tipos base, factories, features y el entry point <code className="text-primary-300 bg-primary-500/10 px-1.5 py-0.5 rounded">store.create()</code>.
              </p>
            </div>

            <div className="bg-surface-800/30 rounded-2xl border border-surface-700/50 p-6 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-sm">🧩</span>
                </div>
                <h3 className="text-white font-bold">features/&lt;entity&gt;/</h3>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed">
                Cada entidad tiene su propia carpeta con <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">models</code>, <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">store</code> y <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">components</code>. Solo 3 archivos por entidad.
              </p>
            </div>

            <div className="bg-surface-800/30 rounded-2xl border border-surface-700/50 p-6 hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-sm">⚡</span>
                </div>
                <h3 className="text-white font-bold">Escalabilidad</h3>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed">
                Agregar una nueva entidad = copiar la carpeta feature, cambiar el modelo y el nombre del store. <span className="text-amber-300 font-semibold">~10 líneas de código</span> por entidad nueva.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-500/10 to-cyan-500/10 rounded-2xl border border-primary-500/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">💡</span>
                <h3 className="text-primary-300 font-bold text-sm">Nx Generator (opcional)</h3>
              </div>
              <pre className="text-xs text-surface-300 font-mono bg-surface-900/60 rounded-lg p-3 overflow-x-auto">
                <code>{`nx generate @myorg/store:entity --name=product
# Genera automáticamente:
#   features/product/models/product.models.ts
#   features/product/store/product.store.ts
#   features/product/components/product-list.component.ts`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
