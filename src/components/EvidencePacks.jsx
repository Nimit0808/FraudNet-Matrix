import React from 'react';
import { Search, Filter, Briefcase, FileText, Download, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

const mockReports = [
  { id: 'STR-IND-2026-089', entity: 'Global Corp Shell', typology: 'Rapid Layering', date: '22 Mar 2026', status: 'Submitted', severity: 'Critical', analyst: 'AI System' },
  { id: 'STR-IND-2026-088', entity: 'Vertex Holdings', typology: 'Structuring (Smurfing)', date: '21 Mar 2026', status: 'Pending Review', severity: 'Elevated', analyst: 'S. Patel' },
  { id: 'STR-IND-2026-087', entity: 'Omega Logistics', typology: 'Circular Transactions', date: '20 Mar 2026', status: 'Submitted', severity: 'Critical', analyst: 'M. Zhang' },
  { id: 'STR-IND-2026-086', entity: 'Alexandrov LLC', typology: 'Sanctions Evasion', date: '18 Mar 2026', status: 'Generated', severity: 'High', analyst: 'AI System' },
  { id: 'STR-IND-2026-085', entity: 'Retail Chain 04', typology: 'Dormant Account', date: '15 Mar 2026', status: 'Draft', severity: 'Elevated', analyst: 'A. Davis' },
  { id: 'STR-IND-2026-084', entity: 'Offshore Trust BVI', typology: 'Rapid Layering', date: '14 Mar 2026', status: 'Submitted', severity: 'Critical', analyst: 'M. Zhang' },
];

export default function EvidencePacks() {
  return (
    <div className="p-6 lg:p-10 max-w-[1800px] mx-auto w-full h-full flex flex-col relative z-0">
      
      {/* Header Context */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 bg-emerald-500 rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.3)]"></div>
            <h2 className="text-emerald-600 text-sm font-bold tracking-[0.2em] uppercase">Document Vault</h2>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">Evidence Packs</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium max-w-xl leading-relaxed">
            Manage, review, and download generated Suspicious Transaction Reports (STR) prepared for the Financial Intelligence Unit.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200 text-sm font-bold rounded-xl transition-all">
            <Filter size={18} /> Filters
          </button>
          <div className="relative group">
            <div className="relative flex items-center shadow-sm rounded-xl border border-slate-200 bg-white">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search report IDs..."
                className="bg-transparent text-slate-800 text-[15px] font-medium rounded-xl pl-11 pr-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 w-72"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Reports</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">1,048</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Review</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">24</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Successfully Submitted</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">892</div>
          </div>
        </div>
      </div>

      <div className="flex-1 bento-card p-0 flex flex-col bg-white shadow-xl shadow-slate-200/40 border border-slate-100 roundex-3xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white relative z-10 rounded-t-3xl">
          <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <Briefcase size={18} className="text-slate-600" />
            </div>
             Generated STR Ledger
          </h2>
        </div>
        
        <div className="overflow-x-auto flex-1 h-0 p-2 relative z-10 bg-white rounded-b-3xl">
          <table className="w-full text-sm text-left border-separate border-spacing-y-1">
            <thead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] px-4 sticky top-0 bg-white z-20 shadow-sm">
              <tr>
                <th className="px-6 py-4 pl-8">Document ID</th>
                <th className="px-6 py-4">Primary Target</th>
                <th className="px-6 py-4">Typology Context</th>
                <th className="px-6 py-4">Preparation</th>
                <th className="px-6 py-4">Filing Status</th>
                <th className="px-6 py-4 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((report) => (
                <tr 
                  key={report.id} 
                  className="group relative hover:bg-slate-50/80 transition-colors duration-300"
                >
                  <td className="px-6 py-4 pl-8 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors rounded-l-xl">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-300" />
                      <span className="font-mono text-xs font-bold text-slate-800 tracking-widest">{report.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
                    <div className="font-bold text-slate-800 text-[14px]">{report.entity}</div>
                  </td>
                  <td className="px-6 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[9px] font-black uppercase tracking-[0.15em] shadow-sm">
                      {report.typology}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{report.analyst}</span>
                      <span className="text-[10px] font-medium text-slate-400">{report.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
                    <div className="flex items-center gap-2">
                       <span className={`px-2.5 py-1 rounded border shadow-sm text-[10px] font-black uppercase tracking-widest ${
                         report.status === 'Submitted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                         report.status === 'Pending Review' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                         report.status === 'Draft' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                         'bg-indigo-50 text-indigo-600 border-indigo-200'
                       }`}>
                         {report.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 pr-8 text-[13px] font-bold text-slate-500 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors text-right rounded-r-xl">
                    <button className="p-2 rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-100 hover:text-indigo-600 transition-colors text-slate-400 flex items-center justify-center ml-auto">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
