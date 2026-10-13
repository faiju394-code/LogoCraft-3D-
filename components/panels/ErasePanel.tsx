import React, { useState } from 'react';
import { LogoConfig } from '../../types/logo';
import { Eraser, RotateCcw, CheckCircle2 } from 'lucide-react';

interface ErasePanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const ErasePanel: React.FC<ErasePanelProps> = ({ config, onChange }) => {
  const [eraserSize, setEraserSize] = useState(16);
  const [isEraserActive, setIsEraserActive] = useState(false);

  const layers = config?.layers || [];
  const activeLayer = layers.find((l) => l.id === config?.activeLayerId) || layers[0];

  const handleClearErasedMask = () => {
    if (!activeLayer) return;
    onChange((prev) => ({
      ...prev,
      layers: prev.layers.map((l) =>
        l.id === activeLayer.id && l.type === 'image'
          ? { ...l, imageData: { ...l.imageData!, erasedPoints: [] } }
          : l
      ),
    }));
  };

  const handleDeleteActiveStrokeOrObject = () => {
    if (!activeLayer) return;
    onChange((prev) => {
      const filtered = prev.layers.filter((l) => l.id !== activeLayer.id);
      return {
        ...prev,
        layers: filtered,
        activeLayerId: filtered[0]?.id,
      };
    });
  };

  return (
    <div className="space-y-4 text-xs text-slate-200">
      <div>
        <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
          <Eraser className="w-4 h-4" /> Eraser & Masking Studio
        </h4>
        <p className="text-[11px] text-slate-400">
          Erase brush strokes or apply non-destructive alpha masks to image layers with adjustable eraser size.
        </p>
      </div>

      <div className="space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">Active Eraser Tool</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEraserActive}
              onChange={(e) => setIsEraserActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Eraser Size */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
            <span>Eraser Radius</span>
            <span>{eraserSize}px</span>
          </div>
          <input
            type="range"
            min="4"
            max="60"
            value={eraserSize}
            onChange={(e) => setEraserSize(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleClearErasedMask}
            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Image Mask
          </button>
          <button
            onClick={handleDeleteActiveStrokeOrObject}
            className="flex-1 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 rounded-xl font-medium flex items-center justify-center gap-1.5"
          >
            <Eraser className="w-3.5 h-3.5" /> Erase Layer
          </button>
        </div>

        {isEraserActive && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Eraser active on selected layer. Tap/drag on canvas to erase.</span>
          </div>
        )}
      </div>
    </div>
  );
};
