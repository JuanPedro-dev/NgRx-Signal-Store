import { useState, useCallback } from 'react';
import {
  Plus,
  Trash2,
  Download,
  FileCode,
  ChevronDown,
  ChevronUp,
  Package,
  Layers,
  Eye,
  X,
  Copy,
  Check,
  Settings,
  Sparkles,
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import CodeBlock from './CodeBlock';
import type { EntityConfig, ExtraProperty, GeneratedFile } from '../types/generator';
import {
  generateAllFiles,
  generateEntityFiles,
  generateLibraryFiles,
} from '../utils/codeGenerator';

function createId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createEmptyProperty(): ExtraProperty {
  return {
    id: createId(),
    name: '',
    type: 'string',
    defaultValue: "''",
    isNested: false,
    nestedProperties: [],
  };
}

function createEmptyEntity(): EntityConfig {
  return {
    id: createId(),
    entityName: '',
    hasExtendedState: false,
    extraProperties: [],
    includeEffects: true,
    includeComponent: true,
    apiEndpoint: '/api/',
  };
}

// ─── Property Editor ─────────────────────────────────────────────
function PropertyEditor({
  property,
  onUpdate,
  onRemove,
  depth = 0,
}: {
  property: ExtraProperty;
  onUpdate: (prop: ExtraProperty) => void;
  onRemove: () => void;
  depth?: number;
}) {
  const addNestedProp = () => {
    onUpdate({
      ...property,
      nestedProperties: [...(property.nestedProperties || []), createEmptyProperty()],
    });
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        depth > 0
          ? 'border-surface-600/30 bg-surface-800/30 ml-6'
          : 'border-surface-700/50 bg-surface-800/50'
      } p-4 mb-3`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        {/* Name */}
        <div className="sm:col-span-3">
          <label className="block text-xs text-surface-400 mb-1.5 font-medium">Nombre</label>
          <input
            type="text"
            value={property.name}
            onChange={(e) => onUpdate({ ...property, name: e.target.value })}
            placeholder="filters"
            className="w-full px-3 py-2.5 rounded-lg bg-surface-900/80 border border-surface-600/50 text-white text-sm font-mono placeholder-surface-600 focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Type */}
        <div className="sm:col-span-3">
          <label className="block text-xs text-surface-400 mb-1.5 font-medium">Tipo</label>
          <input
            type="text"
            value={property.type}
            onChange={(e) => onUpdate({ ...property, type: e.target.value })}
            placeholder="string"
            className="w-full px-3 py-2.5 rounded-lg bg-surface-900/80 border border-surface-600/50 text-white text-sm font-mono placeholder-surface-600 focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Default */}
        <div className="sm:col-span-3">
          <label className="block text-xs text-surface-400 mb-1.5 font-medium">Valor Default</label>
          <input
            type="text"
            value={property.defaultValue}
            onChange={(e) => onUpdate({ ...property, defaultValue: e.target.value })}
            placeholder="''"
            className="w-full px-3 py-2.5 rounded-lg bg-surface-900/80 border border-surface-600/50 text-white text-sm font-mono placeholder-surface-600 focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="sm:col-span-3 flex items-center gap-2">
          <button
            onClick={() => onUpdate({ ...property, isNested: !property.isNested })}
            className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              property.isNested
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'bg-surface-700/50 text-surface-400 border border-surface-600/50 hover:border-surface-500/50'
            }`}
            title="Toggle nested object"
          >
            {property.isNested ? '{ } On' : '{ }'}
          </button>
          <button
            onClick={onRemove}
            className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Nested Properties */}
      {property.isNested && (
        <div className="mt-4 pt-4 border-t border-surface-700/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-surface-400 font-medium">Propiedades Anidadas</span>
            <button
              onClick={addNestedProp}
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              <Plus size={12} /> Agregar
            </button>
          </div>
          {property.nestedProperties?.map((np) => (
            <PropertyEditor
              key={np.id}
              property={np}
              onUpdate={(updated) => {
                onUpdate({
                  ...property,
                  nestedProperties: property.nestedProperties?.map((p) =>
                    p.id === updated.id ? updated : p
                  ),
                });
              }}
              onRemove={() => {
                onUpdate({
                  ...property,
                  nestedProperties: property.nestedProperties?.filter((p) => p.id !== np.id),
                });
              }}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Entity Card ─────────────────────────────────────────────────
function EntityCard({
  entity,
  onUpdate,
  onRemove,
  onPreview,
}: {
  entity: EntityConfig;
  onUpdate: (e: EntityConfig) => void;
  onRemove: () => void;
  onPreview: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-surface-800/40 rounded-2xl border border-surface-700/50 overflow-hidden hover:border-primary-500/20 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-surface-800/60 border-b border-surface-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">
              {entity.entityName || 'Nueva Entidad'}
            </h3>
            <p className="text-surface-400 text-xs">
              {entity.hasExtendedState
                ? `${entity.extraProperties.length} propiedades extra`
                : 'Sin estado extendido'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            className="p-2 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
            title="Preview code"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg text-surface-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Remove entity"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700/50 transition-all"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="p-6 space-y-5 animate-fadeIn">
          {/* Entity Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-surface-300 mb-2 font-medium">
                Nombre del Objeto
              </label>
              <input
                type="text"
                value={entity.entityName}
                onChange={(e) => onUpdate({ ...entity, entityName: e.target.value })}
                placeholder="Product, Status, User..."
                className="w-full px-4 py-3 rounded-xl bg-surface-900/80 border border-surface-600/50 text-white text-sm placeholder-surface-600 focus:border-primary-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-surface-300 mb-2 font-medium">
                API Endpoint
              </label>
              <input
                type="text"
                value={entity.apiEndpoint}
                onChange={(e) => onUpdate({ ...entity, apiEndpoint: e.target.value })}
                placeholder="/api/products"
                className="w-full px-4 py-3 rounded-xl bg-surface-900/80 border border-surface-600/50 text-white text-sm font-mono placeholder-surface-600 focus:border-primary-500 transition-colors"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => onUpdate({ ...entity, includeComponent: !entity.includeComponent })}
                className={`toggle-switch ${entity.includeComponent ? 'active' : ''}`}
              />
              <span className="text-sm text-surface-300 group-hover:text-white transition-colors">
                Generar Componente
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => onUpdate({ ...entity, includeEffects: !entity.includeEffects })}
                className={`toggle-switch ${entity.includeEffects ? 'active' : ''}`}
              />
              <span className="text-sm text-surface-300 group-hover:text-white transition-colors">
                Incluir Effects
              </span>
            </label>
          </div>

          {/* Extended State Toggle */}
          <div className="bg-surface-900/50 rounded-xl border border-surface-700/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-primary-400" />
                <div>
                  <h4 className="text-white font-bold text-sm">Estado Extendido</h4>
                  <p className="text-surface-500 text-xs">Agregar propiedades adicionales al BaseState</p>
                </div>
              </div>
              <div
                onClick={() =>
                  onUpdate({ ...entity, hasExtendedState: !entity.hasExtendedState })
                }
                className={`toggle-switch ${entity.hasExtendedState ? 'active' : ''}`}
              />
            </div>

            {entity.hasExtendedState && (
              <div className="animate-fadeIn">
                {entity.extraProperties.map((prop) => (
                  <PropertyEditor
                    key={prop.id}
                    property={prop}
                    onUpdate={(updated) => {
                      onUpdate({
                        ...entity,
                        extraProperties: entity.extraProperties.map((p) =>
                          p.id === updated.id ? updated : p
                        ),
                      });
                    }}
                    onRemove={() => {
                      onUpdate({
                        ...entity,
                        extraProperties: entity.extraProperties.filter((p) => p.id !== prop.id),
                      });
                    }}
                  />
                ))}
                <button
                  onClick={() =>
                    onUpdate({
                      ...entity,
                      extraProperties: [...entity.extraProperties, createEmptyProperty()],
                    })
                  }
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-surface-600/50 text-surface-400 hover:text-primary-400 hover:border-primary-500/30 transition-all text-sm"
                >
                  <Plus size={16} />
                  Agregar Propiedad
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── File Preview Modal ──────────────────────────────────────────
function FilePreviewModal({
  files,
  onClose,
}: {
  files: GeneratedFile[];
  onClose: () => void;
}) {
  const [activeFile, setActiveFile] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (idx: number) => {
    await navigator.clipboard.writeText(files[idx].content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-surface-900 rounded-2xl border border-surface-700/50 shadow-2xl overflow-hidden flex flex-col animate-slideUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-surface-800/60 border-b border-surface-700/50">
          <div className="flex items-center gap-3">
            <FileCode size={20} className="text-primary-400" />
            <h3 className="text-white font-bold text-lg">Archivos Generados</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-xs font-medium">
              {files.length} archivos
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700/50 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* File List Sidebar */}
          <div className="w-64 border-r border-surface-700/50 overflow-y-auto bg-surface-800/30 flex-shrink-0">
            {files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFile(idx)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-surface-700/30 transition-all ${
                  activeFile === idx
                    ? 'bg-primary-500/10 text-primary-300 border-l-2 border-l-primary-500'
                    : 'text-surface-400 hover:bg-surface-700/30 hover:text-surface-200 border-l-2 border-l-transparent'
                }`}
              >
                <FileCode size={14} className="flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-mono truncate">{file.fileName}</div>
                  <div className="text-xs text-surface-500 truncate">{file.path}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Code Preview */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-surface-800/40 border-b border-surface-700/30">
              <span className="text-xs text-surface-400 font-mono">{files[activeFile]?.path}</span>
              <button
                onClick={() => handleCopy(activeFile)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
              >
                {copiedIdx === activeFile ? (
                  <><Check size={12} className="text-emerald-400" /> Copiado</>
                ) : (
                  <><Copy size={12} /> Copiar</>
                )}
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              {files[activeFile] && (
                <CodeBlock
                  code={files[activeFile].content}
                  language={files[activeFile].language}
                  fileName={files[activeFile].fileName}
                  maxHeight="none"
                  showLineNumbers
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Generator Section ──────────────────────────────────────
export default function GeneratorSection() {
  const [entities, setEntities] = useState<EntityConfig[]>([
    {
      ...createEmptyEntity(),
      entityName: 'Status',
      apiEndpoint: '/api/statuses',
    },
  ]);
  const [previewFiles, setPreviewFiles] = useState<GeneratedFile[] | null>(null);
  const [, setShowAllPreview] = useState(false);

  const addEntity = () => {
    setEntities([...entities, createEmptyEntity()]);
  };

  const updateEntity = useCallback(
    (id: string, updated: EntityConfig) => {
      setEntities((prev) => prev.map((e) => (e.id === id ? updated : e)));
    },
    []
  );

  const removeEntity = (id: string) => {
    setEntities(entities.filter((e) => e.id !== id));
  };

  const previewEntity = (entity: EntityConfig) => {
    if (!entity.entityName.trim()) return;
    const files = generateEntityFiles(entity);
    setPreviewFiles(files);
  };

  const previewAll = () => {
    const validEntities = entities.filter((e) => e.entityName.trim());
    if (validEntities.length === 0) return;
    const files = generateAllFiles(validEntities);
    setPreviewFiles(files);
    setShowAllPreview(true);
  };

  const downloadAll = async () => {
    const validEntities = entities.filter((e) => e.entityName.trim());
    if (validEntities.length === 0) return;

    const files = generateAllFiles(validEntities);
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'ngrx-signalstore-factory.zip');
  };

  const downloadLibraryOnly = async () => {
    const files = generateLibraryFiles();
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'ngrx-signalstore-library.zip');
  };

  const validCount = entities.filter((e) => e.entityName.trim()).length;

  return (
    <section id="generator" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Generador Interactivo
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Genera tus <span className="text-cyan-400">Stores</span>
          </h2>
          <p className="text-surface-400 max-w-2xl mx-auto text-lg">
            Define tus entidades, extiende propiedades y exporta los archivos <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">.ts</code> listos para usar en tu proyecto Angular 21.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-surface-800/30 rounded-2xl border border-surface-700/50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-surface-400" />
              <span className="text-surface-300 font-medium text-sm">
                {validCount} entidad{validCount !== 1 ? 'es' : ''} configurada{validCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={downloadLibraryOnly}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-700/50 text-surface-300 hover:text-white border border-surface-600/50 hover:border-surface-500/50 text-sm font-medium transition-all"
            >
              <Download size={15} />
              Solo Librería
            </button>
            <button
              onClick={previewAll}
              disabled={validCount === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500/20 text-primary-300 border border-primary-500/30 hover:bg-primary-500/30 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Eye size={15} />
              Preview Todos
            </button>
            <button
              onClick={downloadAll}
              disabled={validCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={15} />
              Exportar Todo (.zip)
            </button>
          </div>
        </div>

        {/* Entity Cards */}
        <div className="space-y-6 mb-8">
          {entities.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              onUpdate={(updated) => updateEntity(entity.id, updated)}
              onRemove={() => removeEntity(entity.id)}
              onPreview={() => previewEntity(entity)}
            />
          ))}
        </div>

        {/* Add Entity Button */}
        <button
          onClick={addEntity}
          className="flex items-center gap-3 w-full px-6 py-5 rounded-2xl border-2 border-dashed border-surface-600/50 text-surface-400 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-800/80 border border-surface-700/50 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:border-primary-500/30 transition-all">
            <Plus size={20} />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm">Agregar Nueva Entidad</div>
            <div className="text-xs text-surface-500">Click para configurar otro store</div>
          </div>
        </button>

        {/* Quick Templates */}
        <div className="mt-8 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 rounded-2xl border border-primary-500/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary-400" />
            <h3 className="text-white font-bold">Templates Rápidos</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'User', endpoint: '/api/users', extra: [{ name: 'roles', type: 'string[]', def: '[]' }] },
              { name: 'Product', endpoint: '/api/products', extra: [
                { name: 'filters', type: '{ category: string; minPrice: number }', def: "{ category: '', minPrice: 0 }" },
                { name: 'favorites', type: 'number[]', def: '[]' },
              ]},
              { name: 'Order', endpoint: '/api/orders', extra: [{ name: 'statusFilter', type: 'string', def: "'all'" }] },
              { name: 'Customer', endpoint: '/api/customers', extra: [] },
              { name: 'Invoice', endpoint: '/api/invoices', extra: [{ name: 'dateRange', type: '{ start: string; end: string }', def: "{ start: '', end: '' }" }] },
            ].map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => {
                  const newEntity: EntityConfig = {
                    ...createEmptyEntity(),
                    entityName: tpl.name,
                    apiEndpoint: tpl.endpoint,
                    hasExtendedState: tpl.extra.length > 0,
                    extraProperties: tpl.extra.map((e) => ({
                      id: createId(),
                      name: e.name,
                      type: e.type,
                      defaultValue: e.def,
                      isNested: e.type.startsWith('{'),
                      nestedProperties: [],
                    })),
                  };
                  setEntities((prev) => [...prev, newEntity]);
                }}
                className="px-4 py-2 rounded-xl bg-surface-800/60 text-surface-300 border border-surface-700/50 hover:border-primary-500/30 hover:text-primary-300 text-sm font-medium transition-all hover:scale-105"
              >
                + {tpl.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewFiles && (
        <FilePreviewModal
          files={previewFiles}
          onClose={() => {
            setPreviewFiles(null);
            setShowAllPreview(false);
          }}
        />
      )}
    </section>
  );
}
