import React from 'react';
import { LogoConfig } from '../../types/logo';
import { Grid, Sparkles, Check, ImageOff, Layers } from 'lucide-react';

interface BackgroundPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({ config, onChange }) => {
  const backdropPresets = [
    {
      name: 'Pure Transparent',
      type: 'transparent' as const,
      color: '#000000',
      g1: '#000000',
      g2: '#000000',
      grid: false,
    },
    {
      name: 'Obsidian Studio',
      type: 'gradient' as const,
      color: '#0A0A0E',
      g1: '#14141E',
      g2: '#050508',
      grid: true,
      gridColor: 'rgba(255, 215, 0, 0.15)',
    },
    {
      name: 'Cyberpunk Grid',
      type: 'gradient' as const,
      color: '#090514',
      g1: '#1A0B2E',
      g2: '#05020A',
      grid: true,
      gridColor: 'rgba(0, 240, 255, 0.25)',
    },
    {
      name: 'Crimson Night',
      type: 'gradient' as const,
      color: '#15050A',
      g1: '#260813',
      g2: '#0A0205',
      grid: true,
      gridColor: 'rgba(255, 30, 86, 0.2)',
    },
    {
      name: 'Slate Minimal',
      type: 'solid' as const,
      color: '#0F172A',
      g1: '#0F172A',
      g2: '#0F172A',
      grid: false,
    },
    {
      name: 'Clean White Studio',
      type: 'gradient' as const,
      color: '#F8FAFC',
      g1: '#FFFFFF',
      g2: '#E2E8F0',
      grid: true,
      gridColor: 'rgba(0, 0, 0, 0.1)',
    },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* Background Mode Switcher */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Background Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                background: { ...prev.background, type: 'transparent' },
              }))
            }
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all ${
              config.background.type === 'transparent'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 ring-1 ring-amber-400/40'
                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-5 h-5 rounded border border-slate-600 bg-[linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] bg-[size:6px_6px] bg-[position:0_0,0_3px,3px_-3px,-3px_0px]" />
            <span>Transparent</span>
          </button>

          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                background: { ...prev.background, type: 'solid' },
              }))
            }
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all ${
              config.background.type === 'solid'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 ring-1 ring-amber-400/40'
                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div
              className="w-5 h-5 rounded border border-slate-600"
              style={{ backgroundColor: config.background.color }}
            />
            <span>Solid Color</span>
          </button>

          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                background: { ...prev.background, type: 'gradient' },
              }))
            }
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all ${
              config.background.type === 'gradient'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 ring-1 ring-amber-400/40'
                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div
              className="w-5 h-5 rounded border border-slate-600"
              style={{
                background: `linear-gradient(135deg, ${config.background.gradientColor1}, ${config.background.gradientColor2})`,
              }}
            />
            <span>Gradient</span>
          </button>
        </div>
      </div>

      {/* Preset Studio Backdrops */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Studio Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {backdropPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    type: preset.type,
                    color: preset.color,
                    gradientColor1: preset.g1,
                    gradientColor2: preset.g2,
                    showFloorGrid: preset.grid,
                    floorGridColor:
                      preset.gridColor || prev.background.floorGridColor,
                  },
                }))
              }
              className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 text-left transition-all flex items-center justify-between group"
            >
              <span className="text-xs font-medium text-slate-300 group-hover:text-amber-300">
                {preset.name}
              </span>
              <div
                className="w-4 h-4 rounded-md border border-slate-700"
                style={{
                  background:
                    preset.type === 'transparent'
                      ? 'repeating-conic-gradient(#555 0% 25%, #222 0% 50%) 50% / 6px 6px'
                      : `linear-gradient(135deg, ${preset.g1}, ${preset.g2})`,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Solid or Gradient Customization */}
      {config.background.type !== 'transparent' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
          {config.background.type === 'solid' ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Canvas Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.background.color}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        color: e.target.value,
                      },
                    }))
                  }
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-amber-400">
                  {config.background.color}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300">Color 1</span>
                  <input
                    type="color"
                    value={config.background.gradientColor1}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        background: {
                          ...prev.background,
                          gradientColor1: e.target.value,
                        },
                      }))
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300">Color 2</span>
                  <input
                    type="color"
                    value={config.background.gradientColor2}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        background: {
                          ...prev.background,
                          gradientColor2: e.target.value,
                        },
                      }))
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Gradient Angle</span>
                  <span className="font-mono text-amber-400">
                    {config.background.gradientAngle}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={config.background.gradientAngle}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        gradientAngle: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3D Floor Grid & Vignette Controls */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        {/* Floor Grid Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="grid-toggle"
              checked={config.background.showFloorGrid}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    showFloorGrid: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-400"
            />
            <label
              htmlFor="grid-toggle"
              className="text-xs font-semibold text-slate-300 cursor-pointer flex items-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Studio Floor Grid</span>
            </label>
          </div>
          {config.background.showFloorGrid && (
            <span className="text-[10px] text-amber-400">Perspective On</span>
          )}
        </div>

        {/* Vignette Toggle */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="vignette-toggle"
              checked={config.background.vignette}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    vignette: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-400"
            />
            <label
              htmlFor="vignette-toggle"
              className="text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Radial Studio Vignette
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
