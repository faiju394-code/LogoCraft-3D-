import React from 'react';
import { Type, Box, Shield, Palette, Layout, Download, Smartphone } from 'lucide-react';

export type TabType = 'text' | 'effects' | 'emblem' | 'colors' | 'backdrop';

interface ToolbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenExport: () => void;
  onOpenReactNative: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTab,
  onTabChange,
  onOpenExport,
  onOpenReactNative,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'text', label: 'Text', icon: Type },
    { id: 'effects', label: '3D FX', icon: Box },
    { id: 'emblem', label: 'Emblem', icon: Shield },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'backdrop', label: 'Backdrop', icon: Layout },
  ];

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-1 flex-1 justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[44px] min-w-[48px] px-2 py-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="h-6 w-[1px] bg-slate-800 mx-1 shrink-0" />

      {/* Android RN Button */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onOpenReactNative}
          className="min-h-[44px] px-2.5 py-1 text-slate-300 hover:text-amber-300 rounded-xl hover:bg-slate-800/60 transition-all flex flex-col items-center justify-center cursor-pointer"
          title="React Native Source & Android Testing Guide"
        >
          <Smartphone className="w-4 h-4 text-emerald-400 mb-0.5" />
          <span className="text-[9px] font-semibold text-emerald-400">Android</span>
        </button>

        {/* Quick Export Button */}
        <button
          onClick={onOpenExport}
          className="min-h-[44px] px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
};
