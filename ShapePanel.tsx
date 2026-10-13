import React from 'react';
import { LogoConfig, DesignLayer } from '../../types/logo';
import { Hexagon, Plus, Square as SquareIcon, Circle as CircleIcon, Star, ArrowRight, Shield } from 'lucide-react';

interface ShapePanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const ShapePanel: React.FC<ShapePanelProps> = ({ config, onChange }) => {
  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'square' | 'star' | 'arrow' | 'polygon') => {
    const newLayer: DesignLayer = {
      id: 'shape_' + Date.now(),
      type: 'shape',
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Shape`,
      visible: true,
      locked: false,
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      shapeData: {
        shapeType,
        fillColor: '#f59e0b',
        strokeColor: '#ffffff',
        strokeWidth: 2,
      },
    };

    onChange((prev) => ({
      ...prev,
      layers: [...(prev.layers || []), newLayer],
      activeLayerId: newLayer.id,
    }));
  };

  const layers = config?.layers || [];
  const activeShapeLayer = layers.find(
    (l) => l.id === config?.activeLayerId && l.type === 'shape'
  ) || layers.find((l) => l.type === 'shape');

  const updateActiveShape = (updates: Partial<NonNullable<DesignLayer['shapeData']>>) => {
    if (!activeShapeLayer || !activeShapeLayer.shapeData) return;
    onChange((prev) => ({
      ...prev,
      layers: prev.layers.map((l) =>
        l.id === activeShapeLayer.id
          ? {
              ...l,
              shapeData: {
                ...l.shapeData!,
                ...updates,
              },
            }
          : l
      ),
    }));
  };

  return (
    <div className="space-y-4 text-xs text-slate-200">
      <div>
        <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
          <Hexagon className="w-4 h-4" /> Shapes & Vector Elements
        </h4>
        <p className="text-[11px] text-slate-400">
          Add geometric shapes, stars, arrows, and polygons with custom fill and stroke colors.
        </p>
      </div>

      {/* Add Shape Grid */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium text-slate-300">Add New Shape Layer</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAddShape('rectangle')}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-300 hover:text-amber-300 cursor-pointer"
          >
            <SquareIcon className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">Rectangle</span>
          </button>
          <button
            onClick={() => handleAddShape('square')}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-300 hover:text-amber-300 cursor-pointer"
          >
            <SquareIcon className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">Square</span>
          </button>
          <button
            onClick={() => handleAddShape('circle')}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-300 hover:text-amber-300 cursor-pointer"
          >
            <CircleIcon className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">Circle</span>
          </button>
          <button
            onClick={() => handleAddShape('star')}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-300 hover:text-amber-300 cursor-pointer"
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">Star</span>
          </button>
          <button
            onClick={() => handleAddShape('arrow')}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-300 hover:text-amber-300 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">Arrow</span>
          </button>
          <button
            onClick={() => handleAddShape('polygon')}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex flex-col items-center gap-1.5 transition-all text-slate-300 hover:text-amber-300 cursor-pointer"
          >
            <Hexagon className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">Polygon</span>
          </button>
        </div>
      </div>

      {/* Active Shape Customizer */}
      {activeShapeLayer && activeShapeLayer.shapeData && (
        <div className="space-y-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="font-semibold text-slate-300 text-[11px]">
            Edit Active Shape: {activeShapeLayer.name}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Fill Color */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Fill Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeShapeLayer.shapeData.fillColor}
                  onChange={(e) => updateActiveShape({ fillColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={activeShapeLayer.shapeData.fillColor}
                  onChange={(e) => updateActiveShape({ fillColor: e.target.value })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                />
              </div>
            </div>

            {/* Stroke Color */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Stroke Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeShapeLayer.shapeData.strokeColor}
                  onChange={(e) => updateActiveShape({ strokeColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={activeShapeLayer.shapeData.strokeColor}
                  onChange={(e) => updateActiveShape({ strokeColor: e.target.value })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-[10px]"
                />
              </div>
            </div>
          </div>

          {/* Stroke Width */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>Stroke Width</span>
              <span>{activeShapeLayer.shapeData.strokeWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={activeShapeLayer.shapeData.strokeWidth}
              onChange={(e) => updateActiveShape({ strokeWidth: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
