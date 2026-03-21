import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShieldAlert } from 'lucide-react';

const mockAlerts = [
  { id: 'ALT-88291', entity: 'Global Corp Shell', type: 'Rapid Layering', score: 95, date: '10 mins ago' },
  { id: 'ALT-88290', entity: 'Alexandrov LLC', type: 'Circular Transactions (Round-Tripping)', score: 92, date: '1 hr ago' },
  { id: 'ALT-88289', entity: 'Crypto Swap XYZ', type: 'Structuring Below Thresholds', score: 85, date: '3 hrs ago' },
  { id: 'ALT-88288', entity: 'Offshore Trust BVI', type: 'Rapid Layering', score: 81, date: '5 hrs ago' },
  { id: 'ALT-88287', entity: 'Retail Chain 04', type: 'Dormant Account Reactivation', score: 76, date: '1 day ago' },
  { id: 'ALT-88286', entity: 'Vertex Holdings', type: 'Structuring Below Thresholds', score: 65, date: '1 day ago' },
  { id: 'ALT-88285', entity: 'Omega Logistics', type: 'Circular Transactions (Round-Tripping)', score: 94, date: '2 days ago' },
  { id: 'ALT-88284', entity: 'John D. Smith (Personal)', type: 'Dormant Account Reactivation', score: 71, date: '2 days ago' }
];

export default function AlertsList() {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-10 max-w-[1800px] mx-auto w-full h-full flex flex-col relative z-0">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 bg-rose-600 rounded-full shadow-[0_2px_8px_rgba(225,29,72,0.3)]"></div>
            <h2 className="text-rose-600 text-sm font-bold tracking-[0.2em] uppercase">Threat Matrix</h2>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">Active Alerts</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium max-w-xl leading-relaxed">Investigate flagged suspicious activities, review triggered typologies, and action pending cases.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200 text-sm font-bold rounded-xl transition-all">
            <Filter size={18} /> Filters
          </button>
          <div className="relative group">
            <div className="relative flex items-center shadow-sm rounded-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by ID or Entity..."
                className="bg-white border border-slate-200 text-slate-800 text-[15px] font-medium rounded-xl pl-11 pr-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 w-72"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bento-card p-0 flex flex-col bg-white shadow-xl shadow-slate-200/40 border border-slate-100 roundex-3xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white relative z-10 rounded-t-3xl">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
              <ShieldAlert size={20} className="text-rose-600" />
            </div>
             Pending Review Queue
            <span className="ml-3 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 shadow-sm">
              {mockAlerts.length}
            </span>
          </h2>
        </div>
        
        <div className="overflow-x-auto flex-1 h-0 p-2 relative z-10 bg-white rounded-b-3xl">
          <table className="w-full text-sm text-left border-separate border-spacing-y-1">
            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-4 sticky top-0 bg-white z-20 shadow-sm">
              <tr>
                <th className="px-6 py-4 pl-8">Alert ID</th>
                <th className="px-6 py-4">Primary Entity</th>
                <th className="px-6 py-4">Typology Type</th>
                <th className="px-6 py-4">Risk Magnitude</th>
                <th className="px-6 py-4 pr-8 text-right">Detection Time</th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map((alert) => (
                <tr 
                  key={alert.id} 
                  onClick={() => navigate(`/alerts/${alert.id}`)}
                  className="group relative cursor-pointer hover:bg-slate-50/80 transition-colors duration-300"
                >
                  <td className="px-6 py-4 pl-8 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors rounded-l-xl">
                    <span className="font-mono text-xs font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors uppercase tracking-widest">{alert.id}</span>
                  </td>
                  <td className="px-6 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
                    <div className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors tracking-wide text-[15px]">{alert.entity}</div>
                  </td>
                  <td className="px-6 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {alert.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded text-[11px] font-black tracking-widest uppercase border shadow-sm ${
                        alert.score >= 90 ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                        alert.score >= 70 ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {alert.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 pr-8 text-[13px] font-bold text-slate-500 group-hover:text-slate-700 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors text-right rounded-r-xl">
                    {alert.date}
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
