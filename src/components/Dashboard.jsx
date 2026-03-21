import React from 'react';
import { AlertOctagon, Activity, FileText, TrendingUp, ShieldAlert, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-10 max-w-[1800px] mx-auto w-full relative z-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 bg-indigo-600 rounded-full shadow-[0_2px_8px_rgba(79,70,229,0.3)]"></div>
            <h2 className="text-indigo-600 text-sm font-bold tracking-[0.2em] uppercase">Investigator Hub</h2>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">Command Center</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium max-w-xl leading-relaxed">System-wide real-time monitoring of designated entity threats, ongoing active investigations, and anomalous transaction vectors.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-all flex items-center gap-2 group shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors"></div>
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.35)] active:scale-95 relative overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]"></span>
            <span className="relative">New Investigation</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <SummaryCard 
          title="High Risk Alerts" 
          value="47" 
          change="+12%" 
          trend="up"
          icon={<AlertOctagon size={28} className="text-rose-500" />}
          colorClass="bg-rose-50 border border-rose-100 text-rose-600"
          textColor="text-rose-600"
        />
        <SummaryCard 
          title="Active Investigations" 
          value="124" 
          change="+3%" 
          trend="up"
          icon={<Activity size={28} className="text-sky-500" />}
          colorClass="bg-sky-50 border border-sky-100 text-sky-600"
          textColor="text-sky-600"
        />
        <SummaryCard 
          title="Pending FIU Reports" 
          value="18" 
          change="-4%" 
          trend="down"
          icon={<FileText size={28} className="text-amber-500" />}
          colorClass="bg-amber-50 border border-amber-100 text-amber-600"
          textColor="text-amber-600"
        />
      </div>

      {/* Main Content Area Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bento-card p-0 flex flex-col h-full bg-white shadow-xl shadow-slate-200/40">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <ShieldAlert size={20} className="text-indigo-600" />
                </div>
                Recent Suspicious Activities
              </h2>
              <button className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 hover:bg-slate-50 rounded-lg border border-transparent">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="overflow-x-auto flex-1 p-2">
              <table className="w-full text-sm text-left border-separate border-spacing-y-1">
                <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-4">
                  <tr>
                    <th className="px-5 py-4 pl-6">Entity / ID</th>
                    <th className="px-5 py-4">Typology Vector</th>
                    <th className="px-5 py-4">Threat Score</th>
                    <th className="px-5 py-4">Time</th>
                    <th className="px-5 py-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow entity="Global Corp Shell" id="TRX-99821" type="Structuring" score={92} date="2 mins ago" />
                  <TableRow entity="Alexandrov LLC" id="TRX-10294" type="Wire Transfer" score={85} date="14 mins ago" />
                  <TableRow entity="Crypto Swap XYZ" id="TRX-55392" type="Smurfing" score={78} date="1 hr ago" />
                  <TableRow entity="Offshore Trust BVI" id="TRX-88219" type="Layering" score={74} date="3 hrs ago" />
                  <TableRow entity="Retail Chain 04" id="TRX-11928" type="Cash Deposit" score={65} date="5 hrs ago" />
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bento-card p-6 h-full flex flex-col relative overflow-hidden group/radar bg-white shadow-xl shadow-slate-200/40">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                <TrendingUp size={20} className="text-emerald-600" /> 
              </div>
              Alert Volume Radar
            </h2>
            <div className="flex-1 flex items-end gap-3 pb-2 pt-8 mt-auto mx-1 relative z-10">
              {[40, 25, 45, 30, 60, 80, 50].map((h, i) => (
                <div key={i} className="flex-1 w-full bg-gradient-to-t from-emerald-100 to-emerald-300 rounded-t-lg hover:from-emerald-300 hover:to-emerald-400 cursor-pointer relative group transition-all duration-300 border-t-2 border-emerald-400" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white py-1px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none text-slate-800 font-bold border border-slate-100 translate-y-2 group-hover:-translate-y-1">
                    {h * 12}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-5 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] px-2 relative z-10">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, change, trend, icon, colorClass, textColor }) {
  const isUp = trend === 'up';
  return (
    <div className="bento-card p-8 group hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all duration-500 bg-white">
      <div className="flex justify-between items-start relative z-10 mb-8">
        <div className={`p-4 rounded-2xl shadow-sm transition-all duration-300 ${colorClass}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1.5 mt-1 text-[11px] font-black px-3 py-1.5 rounded-full border shadow-sm ${isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
          {isUp ? <ArrowUpRight size={14} className="stroke-[3]" /> : <ArrowDownRight size={14} className="stroke-[3]" />}
          {change}
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-slate-500 text-sm font-bold mb-2 tracking-wide uppercase">{title}</h3>
        <p className="text-[3rem] leading-none font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function TableRow({ entity, id, type, score, date }) {
  const isCritical = score > 85;
  const isElevated = score > 70 && score <= 85;
  
  return (
    <tr className="group relative hover:bg-slate-50/80 transition-colors duration-300">
      <td className="px-5 py-4 pl-6 relative z-10 w-[28%] border-b border-slate-100 group-hover:border-transparent transition-colors rounded-l-xl">
        <div className="font-bold text-slate-800 tracking-wide">{entity}</div>
        <div className="text-[11px] text-slate-400 mt-1 font-mono uppercase tracking-widest">{id}</div>
      </td>
      <td className="px-5 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          {type}
        </span>
      </td>
      <td className="px-5 py-4 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">
        <div className="flex items-center gap-4">
          <span className={`text-[15px] font-black w-7 ${isCritical ? 'text-rose-600' : isElevated ? 'text-amber-500' : 'text-emerald-500'}`}>{score}</span>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden max-w-[80px] shadow-inner">
            <div className={`h-full relative overflow-hidden ${isCritical ? 'bg-rose-500' : isElevated ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${score}%` }}></div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-[12px] font-bold text-slate-500 relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors">{date}</td>
      <td className="px-5 py-4 pr-6 text-right relative z-10 border-b border-slate-100 group-hover:border-transparent transition-colors rounded-r-xl">
        <button className="text-indigo-600 hover:text-white text-[10px] uppercase font-black tracking-widest bg-indigo-50 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-all border border-indigo-100 shadow-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
          Review
        </button>
      </td>
    </tr>
  );
}
