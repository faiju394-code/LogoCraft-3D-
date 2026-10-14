import React, { useState } from 'react';
import { LogoConfig } from '../../types/logo';
import { FONTS } from './presets';
import { Type, Sparkles, Sliders, Upload, Globe, Plus } from 'lucide-react';
import { FontManagerModal } from './components/panels/FontManagerModal';
interface TextPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const TextPanel: React.FC<TextPanelProps> = ({ config, onChange }) => {
  const [isFontManagerOpen, setIsFontManagerOpen] = useState(false);

  const unicodePresets = [
    { label: 'English', text: 'NEXUS' },
    { label: 'Assamese (অসমীয়া)', text: 'অসমীয়া' },
    { label: 'Hindi (हिन्दी)', text: 'लोगोक्राफ्ट' },
    { label: 'Bengali (বাংলা)', text: 'লোগো ক্রাফট' },
    { label: 'Tamil (தமிழ்)', text: 'லোগோ கிராஃப்ட்' },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* Primary Text Input */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Brand / Logo Text (Unicode Supported)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={config.primaryText}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, primaryText: e.target.value }))
            }
            placeholder="ENTER BRAND NAME"
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-base font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all tracking-wider"
          />
        </div>

        {/* Multilingual Unicode Quick Presets */}
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
            <Globe className="w-3 h-3 text-amber-400" /> Languages:
          </span>
          {unicodePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() =>
                onChange((prev) => ({ ...prev, primaryText: preset.text }))
              }
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-amber-400/60 hover:text-amber-300 shrink-0 transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Transform / Casing Buttons */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Text Casing
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['uppercase', 'none', 'lowercase'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() =>
                onChange((prev) => ({ ...prev, textTransform: mode }))
              }
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                config.textTransform === mode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {mode === 'uppercase'
                ? 'UPPERCASE'
                : mode === 'lowercase'
                ? 'lowercase'
                : 'As Typed'}
            </button>
          ))}
        </div>
      </div>

      {/* Font Selection & "+ Add Font" Button */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Font ({FONTS.length})</span>
          </label>
          <button
            onClick={() => setIsFontManagerOpen(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Font</span>
          </button>
        </div>

        {/* Scrollable Font Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
          {FONTS.map((font) => {
            const isSelected = config.fontFamily === font.id;
            return (
              <button
                key={font.id}
                onClick={() =>
                  onChange((prev) => ({ ...prev, fontFamily: font.id }))
                }
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="text-base text-slate-100 truncate mb-1"
                  style={{ fontFamily: `"${font.id}", sans-serif` }}
                >
                  {config.primaryText || 'LOGO'}
                </div>
                <div className="text-[10px] text-slate-400 truncate flex items-center justify-between">
                  <span>{font.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-slate-500">{font.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography Sliders */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        {/* Font Size */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-300">Font Size</span>
            <span className="text-amber-400 font-mono">{config.fontSize}px</span>
          </div>
          <input
            type="range"
            min="32"
            max="96"
            value={config.fontSize}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, fontSize: Number(e.target.value) }))
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Letter Spacing */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-300">Letter Spacing</span>
            <span className="text-amber-400 font-mono">
              {config.letterSpacing}px
            </span>
          </div>
          <input
            type="range"
            min="-2"
            max="24"
            value={config.letterSpacing}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                letterSpacing: Number(e.target.value),
              }))
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Curvature / Arc Deformation */}
        <div>
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-300">Text Arc / Curve</span>
            <span className="text-amber-400 font-mono">
              {config.effects.curveArc}°
            </span>
          </div>
          <input
            type="range"
            min="-60"
            max="60"
            value={config.effects.curveArc}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                effects: { ...prev.effects, curveArc: Number(e.target.value) },
              }))
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Font Manager Modal */}
      <FontManagerModal
        isOpen={isFontManagerOpen}
        onClose={() => setIsFontManagerOpen(false)}
        config={config}
        onChange={onChange}
      />
    </div>
  );
};
