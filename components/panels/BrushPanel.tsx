import React, { useState } from 'react';
import { LogoConfig, DesignLayer } from '../../types/logo';
import { PenTool, Trash2, CheckCircle2 } from 'lucide-react';

interface BrushPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const BrushPanel: React.FC<BrushPanelProps> = ({ config, onChange }) => {
  const [brushColor, setBrushColor] = useState('#f59e0b');
  const [brushSize, setBrushSize] = useState(8);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const handleStartNewStroke = () => {
    const layers = config?.layers || [];
    const newLayer: DesignLayer = {
      id: 'brush_' + Date.now(),
      type: 'brush',
      name: `Freehand Stroke (${layers.filter(l => l.type === 'brush').length + 1})`,
      visible: true,
      locked: false,
      opacity: brushOpacity,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      brushData: {
        points: [],
        color: brushColor,
        size: brushSize,
        opacity: brushOpacity,
      },
    };

    onChange((prev) => ({
      ...prev,
      layers: [...(prev.layers || []), newLayer],
      activeLayerId: newLayer.id,
    }));
    setIsDrawingMode(true);
  };

  const handleClearBrushStrokes = () => {
    onChange((prev) => ({
      ...prev,
      layers: prev.layers.filter((l) => l.type !== 'brush'),
    }));
    setIsDrawingMode(false);
  };

  return (
    <div className="space-y-4 text-xs text-slate-200">
      <div>
        <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
          <PenTool className="w-4 h-4" /> Freehand Brush Studio
        </h4>
        <p className="text-[11px] text-slate-400">
          Draw freehand strokes on your canvas with adjustable color, brush size, and opacity. Each stroke is saved as an editable layer.
        </p>
      </div>

      <div className="space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Color Picker */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-medium">Brush Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-10 h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
            />
            <input
              type="text"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
            />
          </div>
        </div>

        {/* Brush Size */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
            <span>Brush Size</span>
            <span>{brushSize}px</span>
          </div>
          <input
            type="range"
            min="2"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Brush Opacity */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
            <span>Opacity</span>
            <span>{Math.round(brushOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={brushOpacity}
            onChange={(e) => setBrushOpacity(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleStartNewStroke}
            className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" /> New Brush Stroke
          </button>
          <button
            onClick={handleClearBrushStrokes}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl font-medium flex items-center justify-center gap-1 cursor-pointer"
            title="Clear all brush strokes"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        {isDrawingMode && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Brush active! Drag on canvas to draw freehand strokes.</span>
          </div>
        )}
      </div>
    </div>
  );
};
