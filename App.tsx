
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Bell, Search, Menu, X, ChevronRight, AlertTriangle, Activity, Calendar, Settings, 
  ShieldCheck, CircleDollarSign, Map as MapIcon, Wind, Sparkles, ClipboardList, 
  RefreshCw, CheckCircle2, Droplets, Clock, TrendingUp, DollarSign, ArrowUpRight, 
  PieChart as PieChartIcon, Settings2, Sliders, Users, Ticket, Percent, Banknote, 
  Navigation, Info, Layers, ThermometerSun, LayoutGrid, FileText, Zap, Wrench, 
  CloudRain, Sun, Trophy, Waves, Cpu, Database, Landmark, CreditCard, Microchip,
  History, ScanSearch, Microscope, Radio, Share2, Download, Send, Globe
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line
} from 'recharts';
import { ViewType, HealthStatus, PitchZone } from './types';
import { NAV_ITEMS, MOCK_PITCH_ZONES, INFRASTRUCTURE_DATA, REVENUE_DATA } from './constants';
import { 
  analyzeStadiumData, generateReadinessReport, 
  calculateIrrigationNeeds, getFinancialInsights,
  getZoneRemediation,
  generateMediaReport
} from './geminiService';

// --- Types ---
type HeatmapMode = 'health' | 'moisture' | 'density' | 'temperature';

// --- Global Toast ---
const Toast = ({ message, type, onClose }: { message: string, type: 'info' | 'alert', onClose: () => void }) => (
  <div className="fixed top-24 right-10 z-[100] animate-in slide-in-from-right-10 fade-in duration-500">
    <div className={`flex items-center gap-4 px-6 py-5 rounded-3xl backdrop-blur-2xl border shadow-2xl ${
      type === 'alert' ? 'bg-rose-500/10 border-rose-500/30 shadow-rose-900/20' : 'bg-blue-500/10 border-blue-500/30 shadow-blue-900/20'
    }`}>
      <div className={`p-2.5 rounded-xl ${type === 'alert' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>
        {type === 'alert' ? <AlertTriangle size={20} /> : <Info size={20} />}
      </div>
      <div>
        <p className="text-sm font-black text-white leading-none mb-1">System Notice</p>
        <p className="text-xs text-slate-400 font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-slate-500 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  </div>
);

// --- Brand Logo ---
const BrandLogo = () => (
  <div className="flex items-center gap-4 group cursor-pointer select-none">
    <div className="relative">
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/40 via-indigo-500/20 to-emerald-400/30 rounded-[1.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <div className="relative w-14 h-14 bg-slate-950 border border-slate-800 rounded-[1.2rem] flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500 group-hover:border-blue-500/50">
        <svg viewBox="0 0 100 100" className="w-10 h-10">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <path d="M15 35 C 15 15, 85 15, 85 35 L 85 65 C 85 85, 15 85, 15 65 Z" className="fill-slate-900 stroke-slate-800 stroke-[2px]" />
          <g className="group-hover:translate-y-[-2px] transition-transform duration-500">
            <path d="M50 35 L63 42.5 L63 57.5 L50 65 L37 57.5 L37 42.5 Z" className="fill-blue-500/10 stroke-blue-500 stroke-[1.5px]" />
            <circle cx="50" cy="50" r="4" className="fill-blue-400 animate-pulse" />
            <circle cx="50" cy="35" r="1.5" className="fill-indigo-400" />
            <circle cx="63" cy="42.5" r="1.5" className="fill-indigo-400" />
            <circle cx="63" cy="57.5" r="1.5" className="fill-indigo-400" />
            <circle cx="50" cy="65" r="1.5" className="fill-indigo-400" />
            <circle cx="37" cy="57.5" r="1.5" className="fill-indigo-400" />
            <circle cx="37" cy="42.5" r="1.5" className="fill-indigo-400" />
            <path d="M50 50 L50 35 M50 50 L63 42.5 M50 50 L63 57.5 M50 50 L50 65 M50 50 L37 57.5 M50 50 L37 42.5" className="stroke-blue-400/30 stroke-[0.5px]" />
          </g>
          <path d="M20 30 C 20 20, 80 20, 80 30" className="fill-none stroke-blue-500/20 stroke-[1px] stroke-dasharray-[2,2]" />
        </svg>
      </div>
    </div>
    <div className="flex flex-col">
      <h1 className="text-xl font-black tracking-tighter text-white leading-none">Stadium<span className="text-blue-500">PRO</span></h1>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
        AI-CORE ACTIVE
      </p>
    </div>
  </div>
);

// --- Sub-components ---

const Sidebar = ({ currentView, setView }: { currentView: ViewType, setView: (v: ViewType) => void }) => (
  <aside className="w-72 bg-slate-950 border-r border-slate-900 flex flex-col h-screen fixed left-0 top-0 z-50">
    <div className="p-8 border-b border-slate-900/50">
      <BrandLogo />
    </div>
    <nav className="flex-1 px-6 py-10 space-y-2 overflow-y-auto custom-scrollbar">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id as ViewType)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
            currentView === item.id 
              ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40 ring-1 ring-white/10 translate-x-1' 
              : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <div className={`${currentView === item.id ? 'scale-110' : 'opacity-60'} transition-all`}>
            {item.icon}
          </div>
          <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
          {currentView === item.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
        </button>
      ))}
    </nav>
    <div className="p-6 border-t border-slate-900 bg-slate-950/50">
      <div className="bg-slate-900/50 backdrop-blur rounded-3xl p-5 flex items-center gap-4 border border-slate-800/50">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 overflow-hidden ring-1 ring-white/10">
          <img src="https://picsum.photos/seed/admin/100" alt="Avatar" className="w-full h-full object-cover grayscale opacity-80" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white truncate">Marcus Vane</p>
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">Site Superintendent</p>
        </div>
        <Settings size={18} className="text-slate-600 cursor-pointer hover:text-white transition-colors" />
      </div>
    </div>
  </aside>
);

const Header = ({ title }: { title: string }) => (
  <header className="h-24 bg-slate-950/90 backdrop-blur-3xl border-b border-slate-900 px-12 flex items-center justify-between sticky top-0 z-40">
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-black capitalize text-white tracking-tighter">{title.replace('-', ' ')}</h2>
        <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">v4.5.1_STABLE</span>
      </div>
      <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mt-1.5">Telemetry Synchronization Active</p>
    </div>
    <div className="flex items-center gap-8">
      <div className="relative hidden xl:block">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
        <input 
          type="text" 
          placeholder="Global System Search..." 
          className="bg-slate-900/50 border border-slate-800 rounded-3xl pl-14 pr-6 py-3.5 text-xs focus:ring-2 focus:ring-blue-500/50 w-96 transition-all outline-none text-slate-300 placeholder:text-slate-700"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer group p-3 rounded-2xl hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800">
          <Bell size={20} className="text-slate-500 group-hover:text-white transition-colors" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-4 border-slate-950"></span>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-[1.5rem] border border-slate-800 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
          <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">Node_01_Sync</span>
        </div>
      </div>
    </div>
  </header>
);

const ReadinessAuditor = ({ score }: { score: number }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const performAudit = async () => {
    setIsAuditing(true);
    const result = await generateReadinessReport({ 
      turfHealth: 98.2, 
      infraScore: 89, 
      safetyScore: 94, 
      margin: 12.4 
    });
    setReport(result);
    setIsAuditing(false);
  };

  const steps = [
    { name: 'Turf Profile', status: 'complete', icon: <MapIcon size={14} /> },
    { name: 'Lighting Grid', status: 'complete', icon: <Zap size={14} /> },
    { name: 'Safety Systems', status: 'complete', icon: <ShieldCheck size={14} /> },
    { name: 'Broadcast Line', status: 'processing', icon: <Navigation size={14} /> },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800/50 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none transition-opacity duration-700"></div>
      
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 mb-12">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-2">Global Compliance Auditor</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Cross-referencing FIFA/UEFA Quality Pro Standards</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={performAudit}
            disabled={isAuditing}
            className="px-10 py-5 bg-blue-600 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/50 flex items-center gap-3 disabled:opacity-50"
          >
            {isAuditing ? <RefreshCw className="animate-spin" size={18} /> : <ClipboardList size={18} />}
            Execute Compliance Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        {steps.map((step, i) => (
          <div key={i} className="p-6 bg-slate-950 rounded-[2rem] border border-slate-800 shadow-inner flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${
              step.status === 'complete' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 animate-pulse'
            }`}>
              {step.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{step.name}</p>
            <p className="text-xs font-bold text-white capitalize">{step.status}</p>
          </div>
        ))}
      </div>

      {report && (
        <div className="p-10 bg-slate-950/80 backdrop-blur-md rounded-[2.5rem] border border-blue-500/20 prose prose-invert max-w-none shadow-2xl animate-in fade-in slide-in-from-top-6 duration-500">
           <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
              <Trophy className="text-amber-500" size={24} />
              <h4 className="font-black text-lg m-0 text-white tracking-tight">Audit Summary Protocol</h4>
           </div>
           <div className="text-slate-400 text-sm leading-relaxed font-medium">
             {report}
           </div>
        </div>
      )}
    </div>
  );
};

// --- Statistics & Overview Components ---

const StatCard = ({ label, value, sub, icon: Icon, color }: { label: string, value: string, sub: string, icon: any, color: string }) => (
  <div className="bg-slate-900 border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 blur-3xl -mr-12 -mt-12 group-hover:opacity-10 transition-opacity duration-700`}></div>
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-white`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
        <p className="text-[9px] text-slate-700 font-bold uppercase mt-0.5">{sub}</p>
      </div>
    </div>
    <div className="flex items-end justify-between">
      <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors">
        <ArrowUpRight size={14} className="text-slate-500" />
      </div>
    </div>
  </div>
);

const Overview = () => (
  <div className="space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <StatCard label="Global Compliance" value="94%" sub="FIFA_READY_P" icon={ShieldCheck} color="bg-green-500" />
      <StatCard label="Service Room Load" value="72%" sub="NOMINAL_STABLE" icon={Zap} color="bg-blue-500" />
      <StatCard label="Match ROI" value="+$2.4M" sub="PRED_PROFIT" icon={CircleDollarSign} color="bg-purple-500" />
      <StatCard label="Turf Stress" value="Low" sub="RECOV_PHASE" icon={Activity} color="bg-emerald-500" />
    </div>
    <ReadinessAuditor score={94} />
  </div>
);

// --- Infrastructure Schematic View ---

const InfrastructureSchematic = () => {
  const [selectedComp, setSelectedComp] = useState<string | null>(null);

  const components = [
    { id: 'FL-N', x: 50, y: 15, type: 'light', name: 'Floodlight N', status: 'operational', val: '2000 lx' },
    { id: 'FL-S', x: 50, y: 85, type: 'light', name: 'Floodlight S', status: 'maintenance', val: '1850 lx' },
    { id: 'PUMP-A', x: 15, y: 50, type: 'irrigation', name: 'Pump Alpha', status: 'fault', val: '0.5 bar' },
    { id: 'HVAC-01', x: 85, y: 50, type: 'hvac', name: 'HVAC Control', status: 'operational', val: '21°C' },
    { id: 'GEN-01', x: 20, y: 20, type: 'power', name: 'Gen-01 Backup', status: 'operational', val: '92%' },
    { id: 'STR-B', x: 80, y: 80, type: 'struct', name: 'Stand B Core', status: 'operational', val: '98%' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'operational': return 'bg-emerald-500 shadow-emerald-900/40';
      case 'maintenance': return 'bg-amber-500 shadow-amber-900/40';
      case 'fault': return 'bg-rose-500 animate-pulse shadow-rose-900/40';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">System Infrastructure Hub</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Live Asset Schematics & Telemetry Logs</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 shadow-inner">
              <Cpu size={14} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Assets: {INFRASTRUCTURE_DATA.length}</span>
           </div>
        </div>
      </div>

      {/* Main Dual-Panel Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Schematic Panel (Left) */}
        <div className="xl:col-span-8 bg-slate-900 border border-slate-800/50 rounded-[3rem] p-10 flex flex-col shadow-2xl relative overflow-hidden h-[500px] lg:h-[700px]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                <LayoutGrid size={20} className="text-slate-500" />
              </div>
              <h4 className="font-black text-sm uppercase tracking-[0.2em] text-white">Spatial Logic Diagram</h4>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Feed</span>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1 relative bg-slate-950/50 border border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-inner flex items-center justify-center p-8">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 transition-all duration-700 hover:opacity-30">
              <rect x="5" y="5" width="90" height="90" rx="15" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-600" />
              <path d="M20 20 L80 20 L80 80 L20 80 Z" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-slate-800" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-slate-800" />
              <path d="M0 50 L100 50 M50 0 L50 100" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1,1" className="text-slate-700" />
              <path d="M50 15 L50 25 M50 75 L50 85 M15 50 L25 50 M75 50 L85 50" stroke="currentColor" strokeWidth="0.2" className="text-slate-700" />
            </svg>

            {components.map(comp => (
              <div 
                key={comp.id}
                onClick={() => setSelectedComp(comp.id === selectedComp ? null : comp.id)}
                className={`absolute group transition-all duration-500 cursor-pointer z-20 ${selectedComp === comp.id ? 'scale-150 z-30' : 'hover:scale-125'}`}
                style={{ left: `${comp.x}%`, top: `${comp.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-2xl transition-all ${getStatusColor(comp.status)} ${selectedComp === comp.id ? 'ring-4 ring-blue-500/40' : ''}`}>
                   {comp.type === 'light' ? <Zap size={14} className="text-white" /> : 
                    comp.type === 'irrigation' ? <Droplets size={14} className="text-white" /> :
                    comp.type === 'hvac' ? <Wind size={14} className="text-white" /> :
                    comp.type === 'power' ? <Zap size={14} className="text-white" /> :
                    <ShieldCheck size={14} className="text-white" />}
                   
                   {comp.status === 'fault' && (
                     <div className="absolute inset-0 rounded-full animate-ping bg-rose-500/40 -z-10"></div>
                   )}
                </div>

                <div className={`absolute bottom-full mb-5 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none ${selectedComp === comp.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] min-w-[160px]">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{comp.name}</p>
                    <div className="flex items-center justify-between gap-4 mt-2">
                       <span className="text-[8px] font-bold text-slate-500 uppercase">Metric:</span>
                       <span className="text-[10px] font-black text-blue-400 font-mono">{comp.val}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                       <div className="h-full bg-blue-500 w-3/4 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-700/50 absolute left-1/2 -translate-x-1/2 -bottom-1.5 shadow-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Panel (Right) */}
        <div className="xl:col-span-4 space-y-8 flex flex-col h-full">
          <div className="bg-slate-900 border border-slate-800/50 rounded-[3rem] p-8 shadow-2xl flex-1 flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between mb-8 z-10">
               <div className="flex items-center gap-4">
                 <Database size={18} className="text-blue-500" />
                 <h4 className="font-black text-sm uppercase tracking-widest text-white">Live Telemetry Feed</h4>
               </div>
               <button className="p-2 bg-slate-950 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors">
                  <RefreshCw size={14} className="text-slate-500" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {INFRASTRUCTURE_DATA.map((item, i) => (
                <div 
                  key={i}
                  onMouseEnter={() => setSelectedComp(components.find(c => c.name.includes(item.name.split(' ')[0]))?.id || null)}
                  onMouseLeave={() => setSelectedComp(null)}
                  className={`p-5 rounded-[1.5rem] border transition-all duration-300 cursor-pointer group flex items-center justify-between ${
                    selectedComp && item.name.includes(components.find(c => c.id === selectedComp)?.name.split(' ')[0] || '---')
                    ? 'bg-slate-800 border-blue-500 shadow-xl translate-x-1' 
                    : 'bg-slate-950/40 border-slate-800/50 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
                      item.status === 'operational' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      item.status === 'maintenance' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500 animate-pulse'
                    }`}>
                      {item.status === 'operational' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white leading-none mb-1.5">{item.name}</p>
                      <div className="flex items-center gap-2">
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.metric}:</p>
                         <p className="text-[10px] font-black text-slate-400 font-mono">{item.value}</p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-800 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
               <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">SLA Performance</p>
                  <span className="text-[10px] font-black text-emerald-500 font-mono">99.8%</span>
               </div>
               <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 w-[99%]" />
               </div>
            </div>
          </div>

          <div className="bg-blue-600 border border-blue-500 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/40 group relative overflow-hidden cursor-pointer">
             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
             <div className="flex items-center gap-6 z-10 relative">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur shadow-xl border border-white/20">
                   <Wrench size={24} />
                </div>
                <div>
                   <h5 className="font-black text-base text-white tracking-tight">Maintenance Portal</h5>
                   <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-0.5">3 Active Tickets • 1 Urgent</p>
                </div>
                <ArrowUpRight size={24} className="ml-auto text-white/50 group-hover:text-white transition-colors" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Media & Reporting View ---

const MediaReporting = () => {
  const [matchName, setMatchName] = useState('Global Derby: Kings vs Titans');
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'briefing' | 'distribution'>('briefing');

  const outlets = [
    { name: 'SkySports Satellite', type: 'Satellite', status: 'Connected', icon: <Radio size={16} /> },
    { name: 'BeIn Digital', type: 'Broadcaster', status: 'Ready', icon: <Globe size={16} /> },
    { name: 'National Press Agency', type: 'Press', status: 'Awaiting', icon: <Send size={16} /> },
    { name: 'FIFA Media Portal', type: 'Governing Body', status: 'Syncing', icon: <ShieldCheck size={16} /> }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    const stats = { compliance: 94.2, turf: 98.1, attendance: 65000 };
    const result = await generateMediaReport(period, matchName, stats);
    setReport(result);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-slate-900 border border-slate-800/50 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] pointer-events-none"></div>
        
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 mb-12">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl border border-white/10 group">
                <Radio className="text-white group-hover:scale-110 transition-transform" size={40} />
             </div>
             <div>
               <h3 className="text-3xl font-black text-white tracking-tight">Media & Press Center</h3>
               <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Pre-Match Intelligence Briefings</p>
             </div>
          </div>
          
          <div className="flex gap-4 p-2 bg-slate-950 rounded-3xl border border-slate-800">
             <button 
               onClick={() => setActiveTab('briefing')}
               className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'briefing' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-200'}`}
             >
               AI Briefing
             </button>
             <button 
               onClick={() => setActiveTab('distribution')}
               className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'distribution' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-200'}`}
             >
               Network Sync
             </button>
          </div>
        </div>

        {activeTab === 'briefing' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-8">
               <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-inner space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 block">Upcoming Match Context</label>
                    <input 
                      value={matchName}
                      onChange={(e) => setMatchName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 block">Reporting Interval</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         onClick={() => setPeriod('weekly')}
                         className={`py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${period === 'weekly' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                       >Weekly Intel</button>
                       <button 
                         onClick={() => setPeriod('monthly')}
                         className={`py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${period === 'monthly' ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                       >Monthly Yield</button>
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4"
                  >
                    {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    Issue Media Briefing
                  </button>
               </div>

               <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 group relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                  <h4 className="text-white font-black text-sm mb-4">Pre-Match Press Pack</h4>
                  <p className="text-white/70 text-[10px] leading-relaxed mb-6 font-medium">Download the full technical documentation including high-res pitch topology maps and broadcast signal logs.</p>
                  <button className="flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    <Download size={14} /> Fetch Press Pack
                  </button>
               </div>
            </div>

            <div className="lg:col-span-8 flex flex-col">
               {report ? (
                 <div className="flex-1 bg-slate-950/80 backdrop-blur-md rounded-[3rem] border border-blue-500/20 p-12 overflow-y-auto max-h-[600px] custom-scrollbar prose prose-invert animate-in slide-in-from-bottom-6">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                       <div className="flex items-center gap-4">
                          <Radio className="text-blue-500" size={24} />
                          <h4 className="m-0 text-white font-black uppercase tracking-tighter">Pre-Match Media Intel #{Math.floor(Math.random()*1000)}</h4>
                       </div>
                       <div className="flex items-center gap-3">
                          <button className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"><Share2 size={16} /></button>
                          <button className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"><Download size={16} /></button>
                       </div>
                    </div>
                    <div className="text-slate-400 text-sm leading-relaxed font-medium">
                       {report}
                    </div>
                 </div>
               ) : (
                 <div className="flex-1 bg-slate-950/50 rounded-[3rem] border border-slate-800 border-dashed flex flex-col items-center justify-center text-center p-12 group">
                    <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-inner flex items-center justify-center mb-8 group-hover:border-blue-500/30 transition-all">
                       <FileText size={40} className="text-slate-800 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h4 className="text-xl font-black text-white tracking-tight mb-4">Awaiting Report Command</h4>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest max-w-sm leading-relaxed">Select reporting interval and match context to synchronize AI data streams into a professional broadcast briefing.</p>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 shadow-inner">
                <h4 className="text-white font-black text-base tracking-tight mb-8">Active Media Distribution</h4>
                <div className="space-y-4">
                   {outlets.map((outlet, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-slate-900/50 rounded-2xl border border-slate-800 group hover:border-blue-500/50 transition-all">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 border border-slate-800 transition-colors">
                              {outlet.icon}
                           </div>
                           <div>
                              <p className="text-xs font-black text-white">{outlet.name}</p>
                              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{outlet.type}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-black text-emerald-500 uppercase">{outlet.status}</span>
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="space-y-8">
                <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 shadow-inner h-full flex flex-col justify-center text-center">
                   <div className="flex justify-center mb-8">
                      <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Globe size={32} />
                      </div>
                   </div>
                   <h4 className="text-white font-black text-lg tracking-tight mb-4">Global Signal Sync</h4>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-widest mb-8">Synchronize pre-match briefings across the entire federation media network via encrypted satellite uplink Node_88-X.</p>
                   <button className="mx-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-900/40 transition-all flex items-center gap-3">
                      <RefreshCw size={16} /> Synchronize All Nodes
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ROI Simulator Component ---

const ROISimulator = () => {
  const [scenario, setScenario] = useState<'nominal' | 'derby' | 'rainy'>('nominal');
  const [capacity, setCapacity] = useState(65000);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const pricingTiers = [
    { name: 'VVIP Boxes', price: 100, share: 0.05, color: 'text-amber-500' },
    { name: 'Club Seats', price: 75, share: 0.15, color: 'text-blue-400' },
    { name: 'Main Stand', price: 45, share: 0.50, color: 'text-emerald-400' },
    { name: 'Supporters End', price: 20, share: 0.30, color: 'text-slate-400' },
  ];

  const attendanceRates = { nominal: 0.94, derby: 1.0, rainy: 0.72 };
  const currentAttendance = Math.round(capacity * attendanceRates[scenario]);

  const projectedTicketRevenue = useMemo(() => {
    return pricingTiers.reduce((acc, tier) => {
      const attendeesInTier = Math.round(currentAttendance * tier.share);
      return acc + (attendeesInTier * tier.price);
    }, 0);
  }, [currentAttendance]);

  const projectedTotalRevenue = projectedTicketRevenue * 1.45; // Concessions, Parking, Merch factor
  const projectedCosts = capacity * 25 + (scenario === 'derby' ? 500000 : 0);

  const fetchSimulatorInsights = async () => {
    setLoading(true);
    const stats = { revenue: projectedTotalRevenue, costs: projectedCosts, attendance: currentAttendance };
    const result = await getFinancialInsights(stats);
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-slate-900 border border-slate-800/50 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-12 gap-10">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">Precision Financial Modeling</h3>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">ROI Simulator & Matchday Yield Analytics</p>
          </div>
          <div className="flex flex-wrap gap-3 bg-slate-950 p-2 rounded-3xl border border-slate-800 shadow-inner">
             {(['nominal', 'derby', 'rainy'] as const).map((key) => (
               <button 
                key={key}
                onClick={() => { setScenario(key); setInsights(null); }}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${scenario === key ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:text-white'}`}
               >
                 {key === 'nominal' ? <Sun size={14} /> : key === 'derby' ? <Trophy size={14} /> : <CloudRain size={14} />}
                 {key}
               </button>
             ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-4 space-y-8">
              <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-inner">
                 <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Venue Capacity</p>
                    <span className="text-xs font-black text-blue-500 font-mono">{capacity.toLocaleString()} seats</span>
                 </div>
                 <input type="range" min="40000" max="80000" step="1000" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500" />
                 <div className="flex justify-between mt-3 text-[9px] font-black text-slate-700 uppercase tracking-widest"><span>40k</span><span>60k</span><span>80k</span></div>
              </div>
              <div className="p-8 bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-inner space-y-6">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Yield by Seat Tier</p>
                 {pricingTiers.map(tier => (
                   <div key={tier.name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></div><p className="text-[11px] font-black text-slate-400 group-hover:text-white transition-colors">{tier.name}</p></div>
                      <div className="flex items-center gap-4"><span className="text-[10px] font-black text-slate-600 font-mono">Avg ${tier.price}</span><span className={`text-[10px] font-black font-mono ${tier.color}`}>{(tier.share * 100).toFixed(0)}%</span></div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 h-fit">
              <div className="p-10 bg-slate-950 rounded-[3rem] border border-slate-800 shadow-inner group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-500"><Banknote size={48} /></div>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Gross Matchday Revenue</p>
                 <p className="text-4xl font-black text-white font-mono tracking-tight">${(projectedTotalRevenue / 1000000).toFixed(2)}M</p>
              </div>
              <div className="p-10 bg-slate-950 rounded-[3rem] border border-slate-800 shadow-inner group relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-10 text-blue-500"><Users size={48} /></div>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Effective Attendance</p>
                 <p className="text-4xl font-black text-white font-mono tracking-tight">{currentAttendance.toLocaleString()}</p>
              </div>
              <div className="p-10 bg-slate-950 rounded-[3rem] border border-slate-800 shadow-inner sm:col-span-2 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-10">
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Projected Profit Margin</p>
                    <p className="text-5xl font-black text-blue-500 font-mono tracking-tight">${((projectedTotalRevenue - projectedCosts) / 1000000).toFixed(2)}M</p>
                 </div>
                 <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="64" cy="64" r="50" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-900" />
                       <circle cx="64" cy="64" r="50" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="314" strokeDashoffset={314 * (1 - (projectedTotalRevenue - projectedCosts) / projectedTotalRevenue)} className="text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-white font-mono">{( ((projectedTotalRevenue - projectedCosts) / projectedTotalRevenue) * 100 ).toFixed(0)}%</div>
                 </div>
              </div>
           </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-12 flex flex-col items-center">
           <button onClick={fetchSimulatorInsights} disabled={loading} className="w-full lg:w-fit px-16 py-6 bg-slate-950 border border-slate-800 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl">
             {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />} Synthesize Financial Strategy Insights
           </button>
           {insights && (
             <div className="mt-10 w-full p-12 bg-blue-600/5 rounded-[3rem] border border-blue-500/20 prose prose-invert max-w-none animate-in fade-in duration-700">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5"><Landmark className="text-blue-400" size={24} /><h4 className="font-black text-lg m-0 text-white tracking-tight">AI Generated Fiscal Advisory</h4></div>
                <div className="text-slate-400 text-sm leading-relaxed font-medium">{insights}</div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Turf Management View ---

const TurfManagement = () => {
  const [selectedZone, setSelectedZone] = useState<PitchZone | null>(null);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('health');
  const [irrigationPlan, setIrrigationPlan] = useState<string | null>(null);
  const [remediationPlan, setRemediationPlan] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingIrrigation, setIsAnalyzingIrrigation] = useState(false);

  const mockHistoricalData = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      time: `${i*2}h`,
      moisture: Math.floor(Math.random() * 10) + 15,
      temp: Math.floor(Math.random() * 5) + 20,
      density: Math.floor(Math.random() * 5) + 90,
    }));
  }, [selectedZone?.id]);

  const getZoneColor = (zone: any) => {
    if (heatmapMode === 'health') {
      return zone.status === HealthStatus.EXCELLENT ? 'bg-emerald-500/60' :
             zone.status === HealthStatus.WARNING ? 'bg-amber-400/80' : 'bg-rose-500/90';
    }
    if (heatmapMode === 'moisture') return zone.moisture < 15 ? 'bg-rose-500/80' : zone.moisture < 22 ? 'bg-amber-400/70' : 'bg-blue-500/60';
    if (heatmapMode === 'density') return zone.density < 88 ? 'bg-rose-500/80' : zone.density < 93 ? 'bg-amber-500/70' : 'bg-emerald-500/60';
    return zone.temperature > 26 ? 'bg-rose-500/80' : zone.temperature > 23 ? 'bg-amber-400/70' : 'bg-blue-400/60';
  };

  const handleRemediationProtocol = async () => {
    if (!selectedZone) return;
    setIsAnalyzing(true);
    const plan = await getZoneRemediation(selectedZone);
    setRemediationPlan(plan);
    setIsAnalyzing(false);
  };

  const runIrrigationAnalysis = async () => {
    setIsAnalyzingIrrigation(true);
    const moistureData = MOCK_PITCH_ZONES.map(z => z.moisture);
    const plan = await calculateIrrigationNeeds(moistureData, "Sunny, low humidity, 22°C");
    setIrrigationPlan(plan);
    setIsAnalyzingIrrigation(false);
  };

  useEffect(() => {
    setRemediationPlan(null);
  }, [selectedZone]);

  return (
    <div className="space-y-12 relative">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className={`xl:col-span-8 bg-slate-900 border border-slate-800/50 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden transition-all duration-700 ${selectedZone ? 'xl:opacity-40 scale-[0.98]' : ''}`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner"><ScanSearch className="text-blue-500" size={24} /></div>
              <div><h3 className="text-2xl font-black text-white tracking-tight">Pitch Topology Intel</h3><p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-1">Real-time LIDAR Surface Analysis</p></div>
            </div>
            <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
               {(['health', 'moisture', 'density', 'temperature'] as HeatmapMode[]).map((mode) => (
                 <button key={mode} onClick={() => setHeatmapMode(mode)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${heatmapMode === mode ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>{mode}</button>
               ))}
            </div>
          </div>
          <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 shadow-inner overflow-hidden relative group">
             <div className="pitch-grid relative">
                {MOCK_PITCH_ZONES.map(zone => (
                  <div key={zone.id} onClick={() => setSelectedZone(zone)} className={`cursor-pointer transition-all hover:scale-125 border-[0.1px] border-black/10 ${getZoneColor(zone)} ${selectedZone?.id === zone.id ? 'ring-4 ring-white scale-125 z-40' : ''}`} />
                ))}
             </div>
          </div>
        </div>
        {selectedZone && (
          <div className="xl:col-span-4 bg-slate-900 border border-slate-800/50 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><Microchip size={24} /></div><div><h4 className="font-black text-lg text-white">Zone {selectedZone.id.split('-')[1]}</h4></div></div>
               <button onClick={() => setSelectedZone(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] text-slate-500 uppercase mb-1">Moisture</p><p className="text-xl font-black text-blue-400">{selectedZone.moisture}%</p></div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800"><p className="text-[9px] text-slate-500 uppercase mb-1">Density</p><p className="text-xl font-black text-emerald-400">{selectedZone.density}%</p></div>
               </div>
               <div className="h-40 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={mockHistoricalData}><Line type="monotone" dataKey="moisture" stroke="#3b82f6" dot={false} /></LineChart></ResponsiveContainer></div>
               {remediationPlan ? <div className="p-6 bg-blue-600/5 rounded-2xl border border-blue-500/20 text-xs text-slate-400">{remediationPlan}</div> : <button onClick={handleRemediationProtocol} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase">Plan Remediation</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AIAssistant = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const response = await analyzeStadiumData(input, { readinessScore: 94, turfHealth: 98.2, activeAlerts: 3, distribution: { excellent: 260 } });
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-250px)] flex flex-col bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-950/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[2rem] p-7 shadow-xl ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300'}`}>
              <p className="text-sm font-medium leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-8 border-t border-slate-800/50 bg-slate-900/80">
        <div className="flex gap-5">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Query intelligence..." className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-8 py-5 text-sm outline-none text-white" />
          <button onClick={handleSend} className="bg-blue-600 p-5 rounded-2xl transition-all"><ChevronRight size={28} className="text-white" /></button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Logic ---

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [toast, setToast] = useState<{ message: string, type: 'info' | 'alert' } | null>(null);

  const renderView = () => {
    switch(currentView) {
      case 'overview': return <Overview />;
      case 'turf': return <TurfManagement />;
      case 'infrastructure': return <InfrastructureSchematic />;
      case 'financials': return <ROISimulator />;
      case 'reporting': return <MediaReporting />;
      case 'ai-assistant': return <AIAssistant />;
      default: return <Overview />;
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-200 selection:bg-blue-500/30 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 ml-72 min-h-screen flex flex-col relative">
        <Header title={currentView} />
        <div className="p-12 max-w-screen-2xl mx-auto flex-1 w-full space-y-12">{renderView()}</div>
        <footer className="px-12 py-12 border-t border-slate-900 bg-slate-950/80">
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">StadiumPRO AI Suite v4.5</p>
            <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">Administrator by <span className="text-blue-500 bg-blue-500/5 px-2.5 py-1 rounded-lg">Firas.com</span></p>
          </div>
        </footer>
      </main>
      <div className="fixed bottom-12 right-12 z-[60] bg-slate-900/95 backdrop-blur-3xl border border-white/10 p-6 rounded-[3rem] shadow-2xl flex items-center gap-8">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
            <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="201" strokeDashoffset={201 * (1 - 0.94)} className="text-blue-500" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-black text-lg text-white">94%</div>
        </div>
        <div><p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Compliance</p><div className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-500" /><span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">PRO_READY</span></div></div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
