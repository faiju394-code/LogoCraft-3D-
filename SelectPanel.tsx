import React from 'react';
import { LogoConfig, DesignLayer } from '../../types/logo';
import { Move, RotateCw, Maximize2, Trash2, Copy, ArrowUp, ArrowDown, AlignCenter } from 'lucide-react';

interface SelectPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const SelectPanel: React.FC<SelectPanelProps> = ({ config, onChange }) => {
  const layers = config?.layers || [];
  const activeLayer = layers.find((l) => l.id === config?.activeLayerId) || layers[0];

  const updateActiveLayer = (updater: (layer: DesignLayer) => DesignLayer) => {
    if (!activeLayer) return;
    onChange((prev) => ({
      ...prev,
      layers: (prev.layers || []).map((l) => (l.id === activeLayer.id ? updater(l) : l)),
    }));
  };

  const handleDuplicate = () => {
    if (!activeLayer) return;
    const newLayer: DesignLayer = {
      ...activeLayer,
      id: 'layer_' + Date.now(),
      name: `${activeLayer.name} (Copy)`,
      x: activeLayer.x + 15,
      y: activeLayer.y + 15,
    };
    onChange((prev) => ({
      ...prev,
      layers: [...(prev.layers || []), newLayer],
      activeLayerId: newLayer.id,
    }));
  };

  const handleDelete = () => {
    if (!activeLayer || (config?.layers?.length || 0) <= 1) return;
    onChange((prev) => {
      const filtered = (prev.layers || []).filter((l) => l.id !== activeLayer.id);
      return {
        ...prev,
        layers: filtered,
        activeLayerId: filtered[0]?.id,
      };
    });
  };

  const handleAlignCenter = () => {
    updateActiveLayer((l) => ({ ...l, x: 0, y: 0 }));
  };

  return (
    <div className="space-y-4 text-xs text-slate-200">
      <div>
        <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
          <Move className="w-4 h-4" /> Select & Transform Object
        </h4>
        <p className="text-[11px] text-slate-400">
          Select, position, scale, rotate, and manage individual canvas objects and layers.
        </p>
      </div>

      {/* Layer Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-300">Active Layer</label>
        <select
          value={config?.activeLayerId || activeLayer?.id || ''}
          onChange={(e) => onChange((prev) => ({ ...prev, activeLayerId: e.target.value }))}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
        >
          {layers.map((layer) => (
            <option key={layer.id} value={layer.id}>
              {layer.name} ({layer.type})
            </option>
          ))}
        </select>
      </div>

      {activeLayer && (
        <div className="space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span>Transform: {activeLayer.name}</span>
            <button
              onClick={handleAlignCenter}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg flex items-center gap-1"
            >
              <AlignCenter className="w-3 h-3" /> Center
            </button>
          </div>

          {/* Position X / Y */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400">X Position: {Math.round(activeLayer.x)}px</span>
              <input
                type="range"
                min="-200"
                max="200"
                value={activeLayer.x}
                onChange={(e) => updateActiveLayer((l) => ({ ...l, x: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Y Position: {Math.round(activeLayer.y)}px</span>
              <input
                type="range"
                min="-200"
                max="200"
                value={activeLayer.y}
                onChange={(e) => updateActiveLayer((l) => ({ ...l, y: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Scale / Resize */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Resize Scale</span>
              <span>{Math.round(activeLayer.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.05"
              value={activeLayer.scale}
              onChange={(e) => updateActiveLayer((l) => ({ ...l, scale: Number(e.target.value) }))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Rotation Angle</span>
              <span>{Math.round(activeLayer.rotation)}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={activeLayer.rotation}
              onChange={(e) => updateActiveLayer((l) => ({ ...l, rotation: Number(e.target.value) }))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleDuplicate}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" /> Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 rounded-xl font-medium flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
