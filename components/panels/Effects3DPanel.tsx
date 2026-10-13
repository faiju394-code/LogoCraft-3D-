import React from 'react';
import { LogoConfig } from '../../types/logo';
import { Box, Play, Pause, RotateCcw, Sparkles, Sun, Eye } from 'lucide-react';

interface Effects3DPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const Effects3DPanel: React.FC<Effects3DPanelProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-5 pb-6">
      {/* 3D Depth & Extrusion Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              3D Extrusion & Depth
            </span>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {config.effects.extrusionDepth}px
          </span>
        </div>

        {/* Depth Slider */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Extrusion Thickness</span>
            <span className="font-mono text-slate-300">
              {config.effects.extrusionDepth > 0 ? `${config.effects.extrusionDepth} layers` : 'Flat 2D'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={config.effects.extrusionDepth}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                effects: {
                  ...prev.effects,
                  extrusionDepth: Number(e.target.value),
                },
              }))
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Bevel Highlight */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Bevel Edge Highlight</span>
            <span className="font-mono text-slate-300">
              {config.effects.bevelSize}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            value={config.effects.bevelSize}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                effects: {
                  ...prev.effects,
                  bevelSize: Number(e.target.value),
                },
              }))
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>

      {/* 3D Angles & Turntable Rotation */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              3D Rotation Angles
            </span>
          </div>
          <button
            onClick={() =>
              onChange((prev) => ({
                ...prev,
                effects: {
                  ...prev.effects,
                  rotationX: 0,
                  rotationY: 0,
                  rotationZ: 0,
                },
              }))
            }
            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/70 px-2 py-0.5 rounded-md"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset (0°)</span>
          </button>
        </div>

        {/* Pitch X */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Pitch (X-Axis)</span>
            <span className="font-mono text-amber-400">
              {config.effects.rotationX}°
            </span>
          </div>
          <input
            type="range"
            min="-40"
            max="40"
            value={config.effects.rotationX}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                effects: {
                  ...prev.effects,
                  rotationX: Number(e.target.value),
                },
              }))
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Yaw Y */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Yaw / Turn (Y-Axis)</span>
            <span className="font-mono text-amber-400">
              {config.effects.rotationY}°
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={config.effects.rotationY}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                effects: {
                  ...prev.effects,
                  rotationY: Number(e.target.value),
                },
              }))
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Turntable Auto-Rotate Button */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onChange((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))
              }
              className={`p-2 rounded-xl flex items-center gap-2 text-xs font-semibold border transition-all ${
                config.autoRotate
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {config.autoRotate ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause 360° Spin</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start 360° Turntable</span>
                </>
              )}
            </button>
          </div>

          {config.autoRotate && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Speed</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={config.autoRotateSpeed}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    autoRotateSpeed: Number(e.target.value),
                  }))
                }
                className="w-16 accent-amber-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2D Outline & Neon Glow */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        {/* Outline Stroke */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
            <span>Outline Stroke</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.effects.outlineColor}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    effects: { ...prev.effects, outlineColor: e.target.value },
                  }))
                }
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-[11px] text-amber-400">
                {config.effects.outlineWidth}px
              </span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            value={config.effects.outlineWidth}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                effects: {
                  ...prev.effects,
                  outlineWidth: Number(e.target.value),
                },
              }))
            }
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Neon Glow Aura */}
        <div className="pt-3 border-t border-slate-800/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="glow-toggle"
                checked={config.effects.glowEnabled}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    effects: { ...prev.effects, glowEnabled: e.target.checked },
                  }))
                }
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-400"
              />
              <label
                htmlFor="glow-toggle"
                className="text-xs font-semibold text-slate-300 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Neon Glow Aura</span>
              </label>
            </div>
            {config.effects.glowEnabled && (
              <input
                type="color"
                value={config.effects.glowColor}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    effects: { ...prev.effects, glowColor: e.target.value },
                  }))
                }
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
            )}
          </div>

          {config.effects.glowEnabled && (
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Glow Intensity</span>
                <span className="font-mono text-amber-400">
                  {config.effects.glowBlur}px
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                value={config.effects.glowBlur}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    effects: {
                      ...prev.effects,
                      glowBlur: Number(e.target.value),
                    },
                  }))
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3D Drop Shadow Projection */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shadow-toggle"
              checked={config.effects.shadowEnabled}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  effects: {
                    ...prev.effects,
                    shadowEnabled: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-400"
            />
            <label
              htmlFor="shadow-toggle"
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 cursor-pointer"
            >
              Floor Drop Shadow
            </label>
          </div>
          {config.effects.shadowEnabled && (
            <span className="text-[10px] text-amber-400">Active</span>
          )}
        </div>

        {config.effects.shadowEnabled && (
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Shadow Blur Softness</span>
                <span className="font-mono text-amber-400">
                  {config.effects.shadowBlur}px
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="40"
                value={config.effects.shadowBlur}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    effects: {
                      ...prev.effects,
                      shadowBlur: Number(e.target.value),
                    },
                  }))
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
