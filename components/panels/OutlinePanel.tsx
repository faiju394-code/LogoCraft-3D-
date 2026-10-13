import React from 'react';
import { LogoConfig, DesignLayer } from '../../types/logo';
import { Square, Sliders } from 'lucide-react';

interface OutlinePanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const OutlinePanel: React.FC<OutlinePanelProps> = ({ config, onChange }) => {
  const layers = config?.layers || [];
  const activeLayer = layers.find((l) => l.id === config?.activeLayerId) || layers[0];

  const updateOutline = (updates: Partial<{ enabled: boolean; color: string; width: number; opacity: number }>) => {
    if (!activeLayer) return;
    onChange((prev) => ({
      ...prev,
      layers: (prev.layers || []).map((l) =>
        l.id === activeLayer.id
          ? {
              ...l,
              outline: {
                enabled: updates.enabled ?? l.outline?.enabled ?? false,
                color: updates.color ?? l.outline?.color ?? '#ffffff',
                width: updates.width ?? l.outline?.width ?? 2,
                opacity: updates.opacity ?? l.outline?.opacity ?? 1,
              },
            }
          : l
      ),
    }));
  };

  const outline = activeLayer?.outline || { enabled: false, color: '#ffffff', width: 2, opacity: 1 };

  return (
    <div className="space-y-4 text-xs text-slate-200">
      <div>
        <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
          <Square className="w-4 h-4" /> Outline & Stroke Editor
        </h4>
        <p className="text-[11px] text-slate-400">
          Add customizable outlines and strokes to text, shapes, and image layers with color, width, and opacity controls.
        </p>
      </div>

      <div className="space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">Enable Outline ({activeLayer?.name || 'Active'})</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={outline.enabled}
              onChange={(e) => updateOutline({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {outline.enabled && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            {/* Outline Color */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-medium">Outline Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={outline.color}
                  onChange={(e) => updateOutline({ color: e.target.value })}
                  className="w-10 h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={outline.color}
                  onChange={(e) => updateOutline({ color: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Thickness / Width */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Outline Thickness</span>
                <span>{outline.width}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={outline.width}
                onChange={(e) => updateOutline({ width: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Outline Opacity</span>
                <span>{Math.round(outline.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={outline.opacity}
                onChange={(e) => updateOutline({ opacity: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
