import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRtiContext } from '../../store/RtiContext';
import { FileText, Clock, Check, CheckCircle2, Scale, Plus, Search, ChevronRight, Copy } from 'lucide-react';

export const MyRtis = () => {
  const { applications } = useRtiContext();
  const sortedApplications = [...applications].sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime());
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isAppeal = (app: any) => app?.id?.includes('/A/') || app?.id?.includes('-A') || app.status === 'First Appeal Filed';

  const stats = {
    total: sortedApplications.length,
    inProgress: sortedApplications.filter(a => !['Response Received', 'Closed'].includes(a.status) && !isAppeal(a)).length,
    responded: sortedApplications.filter(a => ['Response Received', 'Closed'].includes(a.status) && !isAppeal(a)).length,
    appeals: sortedApplications.filter(a => isAppeal(a)).length,
  };

  let filteredApps = filter === 'All' 
    ? sortedApplications 
    : filter === 'In Progress' ? sortedApplications.filter(a => !['Response Received', 'Closed'].includes(a.status) && !isAppeal(a))
    : filter === 'Responded' ? sortedApplications.filter(a => ['Response Received', 'Closed'].includes(a.status) && !isAppeal(a))
    : filter === 'Closed' ? sortedApplications.filter(a => a.status === 'Closed' && !isAppeal(a))
    : sortedApplications.filter(a => isAppeal(a));

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredApps = filteredApps.filter(app => {
      const idMatch = app?.id?.toLowerCase().includes(q);
      const authMatch = app.authority?.name?.toLowerCase().includes(q) || false;
      const minMatch = app.authority?.ministry?.toLowerCase().includes(q) || false;
      const deptMatch = app.authority?.department?.toLowerCase().includes(q) || false;
      return idMatch || authMatch || minMatch || deptMatch;
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Response Received': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'First Appeal Filed': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Closed': return 'text-slate-600 bg-slate-50 border-slate-200';
      case 'Additional Fee Required':
      case 'Supporting Document Requested': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200'; // Under Process, Submitted, etc.
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My RTIs</h1>
          <p className="text-slate-600 mt-1">Track and manage all your RTI applications</p>
        </div>
        <Link to="/file" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
          <Plus className="w-5 h-5" /> New RTI
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
         <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 mb-2 text-slate-500 text-xs sm:text-sm font-medium">
             <FileText className="w-4 h-4" /> Total Applications
           </div>
           <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
         </div>
         <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 mb-2 text-blue-600 text-xs sm:text-sm font-medium">
             <Clock className="w-4 h-4" /> In Progress
           </div>
           <div className="text-3xl font-bold text-blue-700">{stats.inProgress}</div>
         </div>
         <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 mb-2 text-emerald-600 text-xs sm:text-sm font-medium">
             <CheckCircle2 className="w-4 h-4" /> Responses Received
           </div>
           <div className="text-3xl font-bold text-emerald-700">{stats.responded}</div>
         </div>
         <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm min-w-0">
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 mb-2 text-purple-600 text-xs sm:text-sm font-medium">
             <Scale className="w-4 h-4" /> Appeals
           </div>
           <div className="text-3xl font-bold text-purple-700">{stats.appeals}</div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex space-x-1 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
             {['All', 'In Progress', 'Responded', 'Appeals', 'Closed'].map(f => (
               <button 
                 key={f} 
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
               >
                 {f}
               </button>
             ))}
           </div>
           
           <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input type="text" placeholder="Search registration no, authority, dept..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#06038D] outline-none" />
           </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredApps.length === 0 ? (
             <div className="p-12 text-center text-slate-500">
               <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <p>No applications found in this category.</p>
             </div>
          ) : (
            filteredApps.map(app => (
              <Link key={app.id || Math.random()} to={`/dashboard/${app?.id?.replace(/\//g, '-')}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50 transition-colors group min-w-0 w-full">
                <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-0 min-w-0 w-full">
                   <div className="mt-1 bg-slate-100 p-2 rounded-lg shrink-0">
                     <FileText className="w-5 h-5 text-slate-500" />
                   </div>
                   <div className="min-w-0 flex-1">
                     <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-1">
                       <div className="flex items-start sm:items-center gap-2 min-w-0">
                         <span className="font-bold text-slate-900 break-all sm:break-normal">{app.id}</span>
                         <div className="flex items-center">
                           <button 
                             onClick={(e) => handleCopy(e, app.id)}
                             className={`p-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 shrink-0 ${copiedId === app.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-[#06038D] hover:bg-slate-100 cursor-pointer'}`}
                             title="Copy Registration Number"
                           >
                             {copiedId === app.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                           </button>
                           {copiedId === app.id && (
                             <span className="text-xs font-medium text-emerald-600 ml-2 animate-in fade-in slide-in-from-left-2 duration-200 whitespace-nowrap">
                               Copied successfully!
                             </span>
                           )}
                         </div>
                       </div>
                       <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium whitespace-nowrap ${getStatusColor(app.status)}`}>
                         {app.status}
                       </span>
                     </div>
                     <p className="text-sm font-medium text-slate-700 line-clamp-2">{app.subject}</p>
                     <p className="text-xs text-slate-500 mt-1 truncate">{app.authority.name}, {app.authority.ministry}</p>
                   </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-64 shrink-0 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                   <div className="text-sm">
                     <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Filed On</p>
                     <p className="font-medium text-slate-800">{new Date(app.dateSubmitted).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                   </div>
                   <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#06038D] transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
