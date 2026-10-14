import React, { useRef } from 'react';
import { LogoConfig } from '../../types/logo';

import { Shield, Upload, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import { EMBLEM_SHAPES } from '../../presets';
interface EmblemPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const EmblemPanel: React.FC<EmblemPanelProps> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange((prev) => ({
        ...prev,
        emblem: {
          ...prev.emblem,
          enabled: true,
          type: 'image',
          imageUrl: dataUrl,
          imageFileName: file.name,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedImage = () => {
    onChange((prev) => ({
      ...prev,
      emblem: {
        ...prev.emblem,
        type: 'shape',
        imageUrl: undefined,
        imageFileName: undefined,
      },
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Emblem Master Toggle */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="emblem-toggle"
            checked={config.emblem.enabled}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                emblem: { ...prev.emblem, enabled: e.target.checked },
              }))
            }
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-400"
          />
          <label
            htmlFor="emblem-toggle"
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 cursor-pointer"
          >
            Show Emblem / Badge
          </label>
        </div>
        <span className="text-xs text-amber-400 font-mono">
          {config.emblem.enabled ? 'Enabled' : 'Hidden'}
        </span>
      </div>

      {config.emblem.enabled && (
        <>
          {/* Emblem Type Tabs: Vector Shape vs Custom Image */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
            <button
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  emblem: { ...prev.emblem, type: 'shape' },
                }))
              }
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                config.emblem.type === 'shape'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>3D Vector Shapes</span>
            </button>
            <button
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  emblem: { ...prev.emblem, type: 'image' },
                }))
              }
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                config.emblem.type === 'image'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Image</span>
            </button>
          </div>

          {/* VECTOR SHAPES SELECTOR */}
          {config.emblem.type === 'shape' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Select 3D Emblem Crest ({EMBLEM_SHAPES.length})
              </label>

              <div className="grid grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {EMBLEM_SHAPES.map((shape) => {
                  const isSelected = config.emblem.shapeId === shape.id;
                  return (
                    <button
                      key={shape.id}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          emblem: { ...prev.emblem, shapeId: shape.id },
                        }))
                      }
                      className={`p-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        className="w-8 h-8 mb-1 fill-current"
                      >
                        <path d={shape.svgPath} />
                      </svg>
                      <span className="text-[10px] truncate max-w-full text-center">
                        {shape.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Emblem Color Picker */}
              <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl">
                <span className="text-xs text-slate-300">Emblem Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.emblem.color || config.textColor}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        emblem: { ...prev.emblem, color: e.target.value },
                      }))
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-amber-400">
                    {config.emblem.color || config.textColor}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM IMAGE UPLOAD */}
          {config.emblem.type === 'image' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              {!config.emblem.imageUrl ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-amber-300 transition-all bg-slate-900/40"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold">
                    Tap to Import Logo Icon / Image
                  </span>
                  <span className="text-[10px] text-slate-500">
                    PNG (transparent recommended), SVG, JPG, WebP
                  </span>
                </button>
              ) : (
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={config.emblem.imageUrl}
                      alt="Uploaded emblem"
                      className="w-12 h-12 object-contain bg-black/40 rounded-lg p-1 border border-slate-800"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200 truncate max-w-[150px]">
                        {config.emblem.imageFileName || 'Custom Image'}
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Ready in 3D Scene</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    >
                      Replace
                    </button>
                    <button
                      onClick={removeUploadedImage}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Circular Mask Option */}
              {config.emblem.imageUrl && (
                <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl">
                  <span className="text-xs text-slate-300">
                    Circular Medal / Coin Crop
                  </span>
                  <input
                    type="checkbox"
                    checked={config.emblem.circularCrop}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        emblem: {
                          ...prev.emblem,
                          circularCrop: e.target.checked,
                        },
                      }))
                    }
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* SIZING & POSITIONING SLIDERS */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
            {/* Emblem Scale */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Scale Size</span>
                <span className="font-mono text-amber-400">
                  {config.emblem.size}px
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                value={config.emblem.size}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    emblem: { ...prev.emblem, size: Number(e.target.value) },
                  }))
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Vertical Position (OffsetY) */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Vertical Position (Y)</span>
                <span className="font-mono text-amber-400">
                  {config.emblem.offsetY}px
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="80"
                value={config.emblem.offsetY}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    emblem: { ...prev.emblem, offsetY: Number(e.target.value) },
                  }))
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Emblem 3D Extrusion */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Emblem 3D Extrusion</span>
                <span className="font-mono text-amber-400">
                  {config.emblem.extrusionDepth}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={config.emblem.extrusionDepth}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    emblem: {
                      ...prev.emblem,
                      extrusionDepth: Number(e.target.value),
                    },
                  }))
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
