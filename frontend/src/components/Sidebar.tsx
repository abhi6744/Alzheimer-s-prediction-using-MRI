import { 
  Home, 
  UploadCloud, 
  Cpu, 
  Activity, 
  Search, 
  History, 
  HelpCircle,
  X
} from 'lucide-react';
import { BrainLogoIcon } from './BrainIllustrations';

export type NavPage = 'home' | 'upload' | 'preprocess' | 'prediction' | 'xai' | 'history' | 'about';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onNavigate, 
  isOpenMobile, 
  onToggleMobile 
}) => {
  const navItems: { id: NavPage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload MRI', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'preprocess', label: 'Preprocess (3D)', icon: <Cpu className="w-4 h-4" /> },
    { id: 'prediction', label: 'Prediction', icon: <Activity className="w-4 h-4" /> },
    { id: 'xai', label: 'XAI Analysis', icon: <Search className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#fbfdff] border-r border-[#e2eaf4] w-64 select-none">
      {/* Top Brand Logo matching reference */}
      <div className="px-6 py-6 border-b border-[#eef4fb] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
          <BrainLogoIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight">
            Alzheimer's
          </h1>
          <p className="text-[13px] font-semibold text-slate-800 leading-tight">
            Detection
          </p>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (isOpenMobile) onToggleMobile();
              }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                isActive
                  ? 'bg-[#edf5ff] text-[#1d63ed] shadow-xs'
                  : 'text-[#475569] hover:bg-[#f1f6fc] hover:text-[#0f172a]'
              }`}
            >
              <span className={`${isActive ? 'text-[#1d63ed]' : 'text-[#64748b]'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      <div className="p-4 border-t border-[#eef4fb] text-xs text-[#94a3b8] flex items-center justify-between">
        <span>AD Neuro-AI v1.0</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Ready" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-shrink-0 w-64 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" 
            onClick={onToggleMobile} 
          />
          <div className="relative flex flex-col w-64 max-w-xs bg-white shadow-2xl z-10">
            <button 
              onClick={onToggleMobile}
              className="absolute top-4 right-3 p-1.5 text-slate-400 hover:text-slate-700"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
