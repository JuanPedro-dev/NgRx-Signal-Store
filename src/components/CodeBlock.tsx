import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Download } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
  onDownload?: () => void;
}

export default function CodeBlock({
  code,
  language = 'typescript',
  fileName,
  showLineNumbers = true,
  maxHeight = '500px',
  onDownload,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-surface-700/50 bg-surface-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-800/80 border-b border-surface-700/50">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          {fileName && (
            <span className="text-xs text-surface-400 font-mono">{fileName}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-700/50 transition-all"
              title="Download file"
            >
              <Download size={14} />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-surface-700/50 transition-all"
            title="Copy code"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Code */}
      <div style={{ maxHeight }} className="overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          wrapLongLines
          customStyle={{
            margin: 0,
            padding: '16px',
            background: 'transparent',
            fontSize: '13px',
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
