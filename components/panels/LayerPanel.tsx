import React from 'react';
import { LogoConfig } from '../../types/logo';
import { Layers, MoveUp, MoveDown, Trash2, Copy, Eye, EyeOff } from 'lucide-react';

interface LayerPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ config, onChange }) => {
  // Layers structure: Primary Text, Tagline, Emblem / Image, Background Grid
  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Active Design Layers (Z-Order)</span>
        </label>
        <span className="text-[10px] text-amber-400 font-mono">4 Layers</span>
      </div>

      <div className="space-y-2">
        {/* Layer 1: Primary 3D Text */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold font-mono">
              1
            </span>
            <div>
              <div className="text-xs font-bold text-white">
                Primary Text: "{config.primaryText || 'NEXUS'}"
              </div>
              <div className="text-[10px] text-slate-400">
                Font: {config.fontFamily} · 3D Extrusion
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-medium">
              Active
            </span>
          </div>
        </div>

        {/* Layer 2: Tagline */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
              2
            </span>
            <div>
              <div className="text-xs font-bold text-white">
                Tagline / Subtitle
              </div>
              <div className="text-[10px] text-slate-400">
                {config.taglineEnabled ? config.taglineText : 'Hidden / Disabled'}
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                taglineEnabled: !prev.taglineEnabled,
              }))
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {config.taglineEnabled ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

        {/* Layer 3: Emblem / Custom Image */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
              3
            </span>
            <div>
              <div className="text-xs font-bold text-white">
                {config.emblem.type === 'image' && config.emblem.imageUrl
                  ? 'Custom Imported Image'
                  : `3D Emblem: ${config.emblem.shapeId}`}
              </div>
              <div className="text-[10px] text-slate-400">
                Size: {config.emblem.size}px · Y: {config.emblem.offsetY}px
              </div>
            </div>
          </div>
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                emblem: { ...prev.emblem, enabled: !prev.emblem.enabled },
              }))
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {config.emblem.enabled ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

        {/* Layer 4: Studio Backdrop & Floor Grid */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
              4
            </span>
            <div>
              <div className="text-xs font-bold text-white">
                Studio Backdrop & Floor Grid
              </div>
              <div className="text-[10px] text-slate-400">
                Type: {config.background.type}
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
            Bottom
          </span>
        </div>
      </div>
    </div>
  );
};
