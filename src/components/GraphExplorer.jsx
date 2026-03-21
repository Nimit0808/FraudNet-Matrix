import React from 'react';
import FundJourneyView from './FundJourneyView';
import { Network, Filter, Search, ShieldAlert, SlidersHorizontal, Settings2, Download } from 'lucide-react';

export default function GraphExplorer() {
  return (
    <div className="p-6 lg:p-10 max-w-[2000px] mx-auto w-full h-[calc(100vh-6rem)] flex flex-col relative z-0">
      
      {/* Header Context */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 bg-indigo-600 rounded-full shadow-[0_2px_8px_rgba(79,70,229,0.3)]"></div>
            <h2 className="text-indigo-600 text-sm font-bold tracking-[0.2em] uppercase">Macro Topology</h2>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">Global Graph Explorer</h1>
          <p className="text-slate-500 text-sm mt-3 font-medium max-w-xl leading-relaxed">
            Investigate multi-hop entity relationships and macro-level money laundering typologies across the entire financial institution's structural datalake.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200 text-sm font-bold rounded-xl transition-all">
            <Filter size={18} /> Deep Filters
          </button>
          <div className="relative group">
            <div className="relative flex items-center shadow-sm rounded-xl border border-slate-200 bg-white">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Query entities, IDs, IPs..."
                className="bg-transparent text-slate-800 text-[15px] font-medium rounded-xl pl-11 pr-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 w-72"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 h-0">
        {/* Left Side: Filter and Query Canvas */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
          
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <SlidersHorizontal size={14} /> View Configuration
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Temporal Window</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Custom Range...</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Active Typologies</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-xs font-bold text-slate-700">Rapid Layering</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-xs font-bold text-slate-700">Circular Round-Tripping</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-xs font-bold text-slate-700">Structuring (Smurfing)</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-xs font-bold text-slate-700">Crypto High-Risk Bridges</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Threshold Minimum</label>
                <input type="range" className="w-full accent-indigo-600" />
                <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400">
                  <span>$0</span>
                  <span>$10M+</span>
                </div>
              </div>
              
              <button className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200 rounded-xl text-xs font-black uppercase tracking-widest mt-4">
                Apply Threat Queries
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-xl shadow-slate-900/20 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-bl-full -z-0"></div>
            <div className="relative z-10 flex flex-col h-full items-start">
              <ShieldAlert className="text-indigo-400 w-8 h-8 mb-4" />
              <h3 className="text-white font-bold text-sm leading-snug mb-2">Automated Extraction Ready</h3>
              <p className="text-slate-400 text-xs mb-6">4 High-Risk clusters detected in the current view port.</p>
              <button className="px-5 py-2.5 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl shadow-sm hover:scale-105 transition-transform flex items-center gap-2">
                <Download size={14} /> Extract Nodes
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Massive Spatial Graph */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col relative overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                <Network size={16} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-[13px] font-bold text-slate-800 tracking-wide">Macro View: Live Transaction Topography</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Syncing Live Tunnels</span>
                </div>
              </div>
            </div>
            
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent">
              <Settings2 size={18} />
            </button>
          </div>
          
          <div className="flex-1 relative bg-slate-50/50">
            {/* Reusing the beautiful React Flow component we built for the alerts */}
            <FundJourneyView />
            
            {/* Context Overlay */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md border border-white shadow-xl rounded-2xl p-4 flex gap-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Nodes</div>
                <div className="text-lg font-black text-slate-800">1,204</div>
              </div>
              <div className="w-[1px] bg-slate-200"></div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Edges</div>
                <div className="text-lg font-black text-slate-800">3,892</div>
              </div>
              <div className="w-[1px] bg-slate-200"></div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Velocity Index</div>
                <div className="text-lg font-black text-rose-600">Critical</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
