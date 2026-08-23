import React, { useState, useEffect } from 'react';
import { X, Activity, ShieldCheck, AlertTriangle, CheckCircle2, Info, FileCode, Download, Trash2, Search, Filter } from 'lucide-react';
import { auditLogger } from '../services/auditLogger';

export default function AuditTrailPanel({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    setLogs(auditLogger.getLogs());
    const unsubscribe = auditLogger.subscribe((newLogs) => {
      setLogs([...newLogs]);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const eventTypes = ['ALL', 'DISCOVERY', 'POLICY_CHECK', 'SAFETY_GATE', 'RAZORPAY_API', 'FAILURE_RECOVERY', 'UPSALE'];

  const filteredLogs = logs.filter(log => {
    const matchesFilter = activeFilter === 'ALL' || log.type === activeFilter;
    const matchesSearch = searchQuery === '' || 
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.agentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">SUCCESS</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">GATED / WARN</span>;
      case 'error':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">INTERCEPTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">INFO</span>;
    }
  };

  const exportAuditJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `razoragent_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>Real-Time Audit Telemetry & Explainability Log</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {logs.length} Events Logged
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Track 01 Compliance Bar: Every money action explainable, bounded, and gated.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportAuditJSON}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export JSON</span>
            </button>
            <button 
              onClick={() => auditLogger.clear()}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center space-x-1 overflow-x-auto pb-1">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
            {eventTypes.map(type => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-2.5 py-1 font-semibold rounded-lg transition whitespace-nowrap ${
                  activeFilter === type
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit events..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        {/* Logs List & Inspector */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Events List */}
          <div className="md:col-span-7 p-4 overflow-y-auto space-y-2 border-r border-slate-200">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No audit telemetry events match criteria.
              </div>
            ) : (
              filteredLogs.map(log => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    selectedLog?.id === log.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{log.displayTime}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-bold">
                        {log.agentId}
                      </span>
                      {getStatusBadge(log.status)}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{log.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{log.details}</p>
                </div>
              ))
            )}
          </div>

          {/* Detailed Payload Inspector */}
          <div className="md:col-span-5 p-4 bg-slate-50 overflow-y-auto space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-blue-600" />
              <span>Audit Inspector</span>
            </h3>

            {selectedLog ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <p className="text-slate-500 text-[10px]">Event ID:</p>
                  <p className="font-mono text-slate-900 text-[11px]">{selectedLog.id}</p>
                  <p className="text-slate-500 text-[10px] mt-2">Title:</p>
                  <p className="font-semibold text-slate-900">{selectedLog.title}</p>
                </div>

                {selectedLog.explainability && (
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1 text-indigo-900">
                    <p className="text-[10px] font-bold uppercase text-indigo-700">
                      Explainable Reasoning:
                    </p>
                    <p className="text-[11px] leading-relaxed">{selectedLog.explainability}</p>
                  </div>
                )}

                {selectedLog.payload && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-600">JSON Payload Telemetry:</p>
                    <pre className="p-3 rounded-xl bg-slate-900 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                      {JSON.stringify(selectedLog.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-500">
                Click any audit event on the left to inspect explainable trace and JSON payload.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
