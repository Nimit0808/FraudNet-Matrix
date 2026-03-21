import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, AlertTriangle, Network, Briefcase, Settings, Search, Bell, User as UserIcon } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-800 font-sans relative z-10 bg-slate-50">
      
      {/* Sidebar - Light Frosted Glass */}
      <aside className="w-20 lg:w-[260px] border-r border-slate-200/60 bg-white/70 backdrop-blur-2xl flex flex-col items-center lg:items-start py-8 transition-all duration-300 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="px-4 lg:px-8 mb-12 w-full flex items-center justify-center lg:justify-start">
          <Link to="/" className="flex items-center group cursor-pointer w-full justify-center lg:justify-start">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-[0_8px_16px_rgba(79,70,229,0.2)] group-hover:shadow-[0_8px_24px_rgba(79,70,229,0.3)] group-hover:-translate-y-0.5 transition-all z-10">
              <Network className="text-white w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="hidden lg:block ml-4 font-black text-slate-800 tracking-wide text-xl leading-none">
              FUND<span className="text-indigo-600">DNA</span>
              <br />
              <span className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1 block">StoryGraph</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 w-full space-y-1.5 px-4 lg:px-6">
          <NavItem icon={<Home size={22} />} label="Overview" to="/" currentPath={location.pathname} />
          <NavItem icon={<AlertTriangle size={22} />} label="Active Alerts" to="/alerts" badge="8" currentPath={location.pathname} />
          <NavItem icon={<Network size={22} />} label="Graph Explorer" to="/explorer" currentPath={location.pathname} />
          <NavItem icon={<Briefcase size={22} />} label="Evidence Packs" to="/evidence" currentPath={location.pathname} />
        </nav>

        <div className="w-full px-4 lg:px-6 mt-auto">
          <NavItem icon={<Settings size={22} />} label="Settings" to="/settings" currentPath={location.pathname} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header - Light Frosted Glass */}
        <header className="h-[80px] shrink-0 border-b border-slate-200/60 bg-white/70 backdrop-blur-2xl flex items-center justify-between px-10 sticky top-0 z-20 w-full shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="relative w-full max-w-md group">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search Entity, TxHash, or Alert ID..."
                className="w-full bg-slate-100/80 border border-transparent text-slate-800 text-[15px] font-medium rounded-full pl-12 pr-6 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-500 shadow-inner block"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 ml-4">
            <button className="relative p-2.5 text-slate-500 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.4)] border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <button className="flex items-center space-x-3 group hover:opacity-100 transition-opacity text-left p-1.5 rounded-full hover:bg-slate-50 pr-4 border border-transparent hover:border-slate-200/50">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 transition-colors shadow-inner relative overflow-hidden">
                <UserIcon size={20} className="text-slate-600 relative z-10" />
              </div>
              <div className="hidden md:block">
                <p className="font-bold text-slate-800 text-sm tracking-wide">Alex Chen</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Lead Investigator</p>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto w-full relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, to, currentPath, badge }) {
  const active = to === '/' ? currentPath === '/' : currentPath.startsWith(to);
  
  return (
    <Link to={to} className={`w-full flex items-center justify-center lg:justify-between px-3 lg:px-4 py-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
      active 
        ? 'text-indigo-700 bg-indigo-50/80 shadow-[0_4px_12px_rgba(79,70,229,0.05)] border border-indigo-100/50' 
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
    }`}>
      {/* Active Left Indicator Layer */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full"></div>
      )}

      <div className="flex items-center relative z-10">
        <span className={`${active ? 'text-indigo-600' : 'group-hover:text-indigo-500'} transition-colors duration-300`}>
          {icon}
        </span>
        <span className={`hidden lg:block ml-4 text-[15px] font-semibold tracking-wide ${active ? 'text-indigo-800' : ''}`}>{label}</span>
      </div>
      
      {badge && (
        <span className="hidden lg:flex px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[11px] font-black border border-rose-200 min-w-[28px] justify-center relative z-10 shadow-sm">
          {badge}
        </span>
      )}
    </Link>
  );
}
