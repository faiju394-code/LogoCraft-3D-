import React from 'react';
import { LogoConfig, MaterialFinish } from '../../types/logo';
import { COLOR_PALETTES } from '../../presets';
import { Palette, Sparkles, Gem, Disc } from 'lucide-react';
interface ColorsPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const ColorsPanel: React.FC<ColorsPanelProps> = ({ config, onChange }) => {
  const materials: { id: MaterialFinish; label: string; icon: string }[] = [
    { id: 'gold', label: 'Imperial Gold', icon: '👑' },
    { id: 'chrome', label: 'Silver Chrome', icon: '🪞' },
    { id: 'metallic', label: 'Brushed Metal', icon: '⚙️' },
    { id: 'neon', label: 'Cyber Neon', icon: '⚡' },
    { id: 'matte', label: 'Matte Clay', icon: '🎨' },
    { id: 'glass', label: 'Crystal Glass', icon: '💎' },
  ];

  const applyPalette = (palette: (typeof COLOR_PALETTES)[0]) => {
    onChange((prev) => ({
      ...prev,
      textColor: palette.textColor,
      extrusionColor: palette.extrusionColor,
      taglineColor: palette.accentColor,
      effects: {
        ...prev.effects,
        outlineColor: palette.textColor,
        glowColor: palette.accentColor,
      },
      emblem: {
        ...prev.emblem,
        color: palette.textColor,
      },
      background: {
        ...prev.background,
        color: palette.bgColor,
        gradientColor1: palette.bgColor,
        gradientColor2: '#030305',
      },
    }));
  };

  return (
    <div className="space-y-5 pb-6">
      {/* 3D Material Surface Finish */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Gem className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Surface Material</span>
        </label>

        <div className="grid grid-cols-3 gap-2">
          {materials.map((mat) => {
            const isSelected = config.material === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() =>
                  onChange((prev) => ({ ...prev, material: mat.id }))
                }
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-base mb-1">{mat.icon}</div>
                <div className="text-xs font-semibold truncate">{mat.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Curated Color Schemes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Color Palettes</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {COLOR_PALETTES.map((pal) => (
            <button
              key={pal.name}
              onClick={() => applyPalette(pal)}
              className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 text-left transition-all group flex items-center justify-between"
            >
              <span className="text-xs font-medium text-slate-200 group-hover:text-amber-300">
                {pal.name}
              </span>
              <div className="flex items-center -space-x-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                  style={{ backgroundColor: pal.textColor }}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                  style={{ backgroundColor: pal.extrusionColor }}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                  style={{ backgroundColor: pal.accentColor }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Specific Color Pickers */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          Fine-Tune Colors
        </label>

        {/* Text Face Color */}
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-slate-300">Front Face Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.textColor}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, textColor: e.target.value }))
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono text-amber-400">
              {config.textColor}
            </span>
          </div>
        </div>

        {/* Extrusion Depth Color */}
        <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
          <span className="text-xs text-slate-300">3D Extrusion Side Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.extrusionColor}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  extrusionColor: e.target.value,
                }))
              }
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
            />
            <span className="text-xs font-mono text-amber-400">
              {config.extrusionColor}
            </span>
          </div>
        </div>

        {/* Tagline Color */}
        {config.taglineEnabled && (
          <div className="flex items-center justify-between py-1 border-t border-slate-800/60">
            <span className="text-xs text-slate-300">Tagline Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.taglineColor}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    taglineColor: e.target.value,
                  }))
                }
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs font-mono text-amber-400">
                {config.taglineColor}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
