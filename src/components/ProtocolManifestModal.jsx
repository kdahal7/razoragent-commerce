import React from 'react';
import { X, FileCode, Check, Copy } from 'lucide-react';
import { getACPProtocolManifest } from '../services/acpProtocol';

export default function ProtocolManifestModal({ isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);
  if (!isOpen) return null;

  const manifest = getACPProtocolManifest();
  const jsonString = JSON.stringify(manifest, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center">
              <FileCode className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 font-mono">
                /.well-known/agentic-commerce.json
              </h2>
              <p className="text-xs text-slate-500">
                Standard ACP / UAP Agentic Commerce Manifest Endpoint
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
              <span>{copied ? "Copied" : "Copy JSON"}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <pre className="p-4 rounded-2xl bg-slate-900 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
            {jsonString}
          </pre>
        </div>

      </div>
    </div>
  );
}
