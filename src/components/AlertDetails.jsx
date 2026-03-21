import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import FundJourneyView from './FundJourneyView';
import { ArrowLeft, Clock, ShieldAlert, FileText, CheckCircle2, AlertOctagon, Waypoints, Brain, Scale, Download, Users, Briefcase } from 'lucide-react';

const timelineEvents = [
  { id: 1, time: '10:05 AM', amount: '$5.2M', source: 'Global Corp Shell (CUST-8819)', dest: 'Offshore Holding (ACC-9921)', channel: 'Internal Transfer', status: 'completed' },
  { id: 2, time: '10:12 AM', amount: '$5.2M', source: 'Offshore Holding (ACC-9921)', dest: 'RTGS Transfer (CH-RTGS)', channel: 'System Gateway', status: 'completed' },
  { id: 3, time: '10:15 AM', amount: '$5.2M', source: 'RTGS Transfer', dest: 'Cayman Branch 02 (BR-CYM-02)', channel: 'Wire Settlement', status: 'completed' },
  { id: 4, time: '10:45 AM', amount: '$2.6M', source: 'Cayman Branch 02', dest: 'Trading Acct 1 (ACC-1102)', channel: 'Wire Split Layering', status: 'flagged' },
  { id: 5, time: '10:45 AM', amount: '$2.6M', source: 'Cayman Branch 02', dest: 'Trading Acct 2 (ACC-1103)', channel: 'Wire Split Layering', status: 'flagged' },
  { id: 6, time: '11:05 AM', amount: '$2.55M', source: 'Trading Acct 2', dest: 'Crypto Network (CH-CRYPTO)', channel: 'Exchange Route', status: 'flagged' },
  { id: 7, time: '11:30 AM', amount: '$2.6M', source: 'Trading Acct 1', dest: 'Alexandrov LLC (CUST-4421)', channel: 'Direct Transfer', status: 'critical' },
  { id: 8, time: '12:10 PM', amount: '$2.55M', source: 'Crypto Network', dest: 'Alexandrov LLC (CUST-4421)', channel: 'Wallet Deposit', status: 'critical' },
];

export default function AlertDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 lg:p-10 max-w-[1800px] mx-auto w-full h-full flex flex-col relative z-0">
      
      {/* Header Context */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/alerts')}
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center border border-slate-200 shadow-sm transition-colors text-slate-500 hover:text-indigo-600 shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">
                Rapid Layering Typology
              </span>
              <span className="text-slate-400 text-xs font-mono font-bold tracking-widest uppercase">
                {id || 'ALT-88291'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Entity: Global Corp Shell
              <ShieldAlert size={28} className="text-rose-500 ml-2 drop-shadow-sm" />
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Assessed Threat Level</div>
            <div className="text-3xl font-black text-rose-600 tracking-tight">95 <span className="text-sm text-slate-400">/ 100</span></div>
          </div>
        </div>
      </div>

      {/* Vast Grid Layout: 2 Cols Graph, 1 Col Timeline, 1 Col AI Narrative */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        
        {/* Left: Fund Journey Graph */}
        <div className="lg:col-span-2 bento-card bg-white shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
            <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                <Waypoints size={18} className="text-indigo-600" />
              </div>
              Fund Journey: Temporal Flow Graph
            </h2>
          </div>
          <div className="flex-1 relative">
            <FundJourneyView />
          </div>
        </div>

        {/* Middle: Timeline Storyboard */}
        <div className="lg:col-span-1 bento-card bg-white shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
            <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                <Clock size={18} className="text-emerald-600" />
              </div>
              Transaction Storyboard
            </h2>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-lg border border-transparent">
              <FileText size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 custom-scrollbar">
            <div className="flex flex-col gap-6 relative">
              {timelineEvents.map((event, idx) => {
                const isFlagged = event.status === 'flagged';
                const isCritical = event.status === 'critical';
                
                return (
                  <div key={event.id} className="flex gap-4 relative group">
                    {/* Event Vertical Connection Line */}
                    {idx !== timelineEvents.length - 1 && (
                      <div className="absolute left-[15px] top-9 bottom-[-24px] w-[2px] bg-slate-200 group-hover:bg-indigo-200 transition-colors z-0"></div>
                    )}
                    
                    {/* Node Dot */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 border-2 transition-colors duration-300 shadow-sm ${
                      isCritical ? 'bg-rose-50 border-rose-300 text-rose-600 group-hover:bg-rose-100' : 
                      isFlagged ? 'bg-amber-50 border-amber-300 text-amber-600 group-hover:bg-amber-100' : 
                      'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-600'
                    }`}>
                      {isCritical ? <AlertOctagon size={14} /> : 
                       isFlagged ? <ShieldAlert size={14} /> : 
                       <CheckCircle2 size={14} />}
                    </div>
                    
                    {/* Event Details Card */}
                    <div className={`flex-1 rounded-2xl p-4 border transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.02)] ${
                      isCritical ? 'bg-white border-rose-200 hover:shadow-[0_8px_20px_rgba(225,29,72,0.1)] hover:-translate-y-0.5' :
                      isFlagged ? 'bg-white border-amber-200 hover:shadow-[0_8px_20px_rgba(245,158,11,0.1)] hover:-translate-y-0.5' :
                      'bg-white border-slate-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:border-indigo-100'
                    }`}>
                      <div className="flex justify-between items-start mb-2.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                          <Clock size={10} className="text-slate-300" />
                          {event.time}
                        </span>
                        <span className={`text-[12px] font-black tracking-tight ${
                          isCritical ? 'text-rose-600' : isFlagged ? 'text-amber-600' : 'text-slate-800'
                        }`}>
                          {event.amount}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">From</span>
                          <span className="text-[11px] font-bold text-slate-700 leading-tight">{event.source}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">To</span>
                          <span className="text-[11px] font-bold text-slate-700 leading-tight">{event.dest}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md">
                          {event.channel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-200 text-center pb-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                End of Trace
              </span>
            </div>
          </div>
        </div>

        {/* Right: AI Alert Explanation Panel */}
        <div className="lg:col-span-1 bento-card bg-white shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
            <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                <Brain size={18} className="text-indigo-600" />
              </div>
              AI Threat Narrative
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar flex flex-col gap-8">
            {/* Behavioural Twin Mismatch */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                <Scale size={14} className="text-slate-400" /> Behavioural Twin Mismatch
              </h3>
              
              <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden text-sm">
                <div className="grid grid-cols-2 bg-rose-50 border-b border-rose-200">
                  <div className="p-3 font-black text-rose-800 text-[9px] uppercase tracking-[0.15em] border-r border-rose-200 text-center">Declared KYC</div>
                  <div className="p-3 font-black text-rose-800 text-[9px] uppercase tracking-[0.15em] text-center">Observed Drift</div>
                </div>
                
                <div className="grid grid-cols-2 border-b border-slate-100 items-center">
                  <div className="p-3 border-r border-slate-100 text-slate-600 font-bold text-[11px] text-center">Agri-Export (Low Vol)</div>
                  <div className="p-3 text-rose-600 font-black text-[11px] text-center bg-rose-50/40">Shell Tech Ops</div>
                </div>
                
                <div className="grid grid-cols-2 border-b border-slate-100 items-center">
                  <div className="p-3 border-r border-slate-100 text-slate-600 font-bold text-[11px] text-center">&lt;$50k / Month Velocity</div>
                  <div className="p-3 text-rose-600 font-black text-[11px] text-center bg-rose-50/40">&gt;$5M Daily RTGS Surges</div>
                </div>

                <div className="grid grid-cols-2 items-center">
                  <div className="p-3 border-r border-slate-100 text-slate-600 font-bold text-[11px] text-center">Domestic Targets</div>
                  <div className="p-3 text-rose-600 font-black text-[11px] text-center bg-rose-50/40">Offshore Crypto Bridges</div>
                </div>
              </div>
            </div>

            {/* AI Narrative */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                <FileText size={14} className="text-slate-400" /> Synthesized Case Summary
              </h3>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-0 transition-colors group-hover:bg-rose-100/50"></div>
                
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">Generated 2 mins ago</span>
                </div>
                
                <div className="relative z-10 space-y-4">
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                    Based on topological flow analysis, Global Corp Shell exhibits an intense <span className="font-bold text-slate-900 bg-amber-100 px-1 py-0.5 rounded shadow-sm">Rapid Layering</span> typology. Funds are ingested via high-volume intra-day transfers that completely contradict their declared 'Low Volume Export' KYC profile.
                  </p>
                  <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                    At exactly <span className="font-bold text-slate-900 border-b border-slate-300">10:45 AM</span>, a $5.2M block was deliberately split into dual $2.6M wires via Cayman Branch 02. The velocity of these funds—clearing into Alexandrov LLC and a Crypto Exchange bridge within 45 minutes—is <span className="font-bold text-rose-600 bg-rose-50 px-1 border border-rose-100 rounded">highly consistent with automated laundering vectors</span> designed to evade systemic threshold holds. 
                  </p>
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 block mb-1">Recommended Action</span>
                    <span className="text-[12px] font-bold text-rose-600">Immediate asset freeze and FIU escalation required.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Massive Primary CTA Button at the Bottom */}
      <div className="mt-8 flex justify-center shrink-0">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full max-w-3xl py-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.4)] transition-all rounded-2xl text-[16px] font-black uppercase tracking-widest border border-indigo-500 active:scale-[0.98] flex items-center justify-center gap-4 group"
        >
          <FileText className="group-hover:scale-110 transition-transform" />
          Generate FIU-IND STR (Evidence Pack)
        </button>
      </div>

      {/* Evidence Pack Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 border border-slate-200/50 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 shadow-inner">
                  <Briefcase size={22} />
                </div>
                Evidence Pack Preview: Suspicious Transaction Report
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 rounded-full bg-white hover:bg-rose-50 flex items-center justify-center border border-slate-200 shadow-sm transition-colors text-slate-400 hover:text-rose-600 hover:border-rose-200"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
              <div className="space-y-8">
                
                {/* Section 1: Case Metadata */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 pb-2">Part A: Case Metadata</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">System ID</p>
                      <p className="font-mono text-sm font-bold text-slate-800">{id || 'ALT-88291'}</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Filing Date</p>
                      <p className="text-sm font-bold text-slate-800">22-Mar-2026</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Primary Typology</p>
                      <p className="text-sm font-black text-rose-600">Rapid Layering</p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Threat Score</p>
                      <p className="text-sm font-black text-rose-600">95 / 100</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Implicated Entities */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Users size={16} /> Part B: Implicated Entities
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Entity Name</th>
                          <th className="px-5 py-3">Type</th>
                          <th className="px-5 py-3">Identifier</th>
                          <th className="px-5 py-3 text-right">Jurisdiction</th>
                        </tr>
                      </thead>
                      <tbody className="font-semibold text-slate-700 divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="px-5 py-4 text-slate-900 font-bold">Global Corp Shell</td>
                          <td className="px-5 py-4"><span className="px-2 py-1 bg-sky-50 text-sky-600 text-[10px] rounded-md border border-sky-100">Originator</span></td>
                          <td className="px-5 py-4 font-mono text-xs text-slate-500">CUST-8819</td>
                          <td className="px-5 py-4 text-right">Domestic</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-5 py-4 text-slate-900 font-bold">Alexandrov LLC</td>
                          <td className="px-5 py-4"><span className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] rounded-md border border-rose-100">Beneficiary</span></td>
                          <td className="px-5 py-4 font-mono text-xs text-slate-500">CUST-4421</td>
                          <td className="px-5 py-4 text-right">Offshore (BVI)</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-5 py-4 text-slate-900 font-bold">Cayman Branch 02</td>
                          <td className="px-5 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md border border-slate-200">Intermediary</span></td>
                          <td className="px-5 py-4 font-mono text-xs text-slate-500">BR-CYM-02</td>
                          <td className="px-5 py-4 text-right text-rose-600 font-bold">High-Risk (CYM)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3: AI Narrative Injection */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Brain size={16} /> Part C: Investigative Narrative (AI Generated)
                  </h3>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm text-indigo-900 leading-relaxed font-medium mb-4">
                      Based on topological flow analysis, Global Corp Shell exhibits an intense <span className="font-bold bg-white px-1.5 py-0.5 rounded shadow-sm text-indigo-700">Rapid Layering</span> typology. Funds are ingested via high-volume intra-day transfers that completely contradict their declared 'Low Volume Export' KYC profile. 
                    </p>
                    <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                      At exactly 10:45 AM, a $5.2M block was deliberately split into dual $2.6M wires via Cayman Branch 02. The velocity of these funds—clearing into Alexandrov LLC and a Crypto Exchange bridge within 45 minutes—is highly consistent with automated laundering vectors designed to evade systemic threshold holds.
                    </p>
                  </div>
                </div>

                {/* Section 4: Transaction Ledger */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 border-b border-slate-200 pb-2">Part D: Suspect Transaction Ledger</h3>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[120px]">
                    <p className="text-sm font-bold text-slate-400 italic">Complete ledger containing 8 transactional hops successfully compiled and appended.</p>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-200 bg-white flex justify-end gap-4 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-300 rounded-xl text-[13px] font-black uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white shadow-[0_4px_14px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)] transition-all rounded-xl text-[13px] font-black uppercase tracking-widest border border-rose-500 flex items-center gap-3 active:scale-[0.98]">
                <Download size={18} />
                Download as PDF
              </button>
            </div>

          </div>
        </div>
      , document.body)}

    </div>
  );
}
