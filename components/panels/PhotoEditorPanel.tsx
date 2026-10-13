import React, { useState, useRef } from 'react';
import { LogoConfig } from '../../types/logo';
import { Upload, RotateCw, RefreshCw, Sliders, Wand2, Trash2, Check, AlertCircle, Loader2, Sparkles, Shield } from 'lucide-react';

interface PhotoEditorPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const PhotoEditorPanel: React.FC<PhotoEditorPanelProps> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const photoConfig = config.emblem;

  const handleRealGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file from your Android gallery.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setOriginalImageUrl(dataUrl);
      onChange((prev) => ({
        ...prev,
        emblem: {
          ...prev.emblem,
          enabled: true,
          type: 'image',
          imageUrl: dataUrl,
          imageFileName: file.name,
          size: 160,
          rotation: 0,
          offsetX: 0,
          offsetY: 0,
          opacity: 1,
        },
      }));
      setSuccessMsg('Photo loaded successfully from Android gallery!');
      setTimeout(() => setSuccessMsg(null), 3000);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to load image from gallery.');
    };
    reader.readAsDataURL(file);
  };

  // Automatic Background Remover Feature
  const handleRemoveBackground = async () => {
    if (!photoConfig.imageUrl) {
      setErrorMsg('Please import a photo first before removing background.');
      return;
    }

    setIsRemovingBg(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photoConfig.imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server background removal failed.');
      }

      if (data.imageUrl) {
        onChange((prev) => ({
          ...prev,
          emblem: {
            ...prev.emblem,
            imageUrl: data.imageUrl,
          },
        }));
        setSuccessMsg('Background removed successfully with transparent alpha!');
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Background removal error. Please check your Gemini API key in Settings > Secrets.');
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleRestoreOriginal = () => {
    if (originalImageUrl) {
      onChange((prev) => ({
        ...prev,
        emblem: {
          ...prev.emblem,
          imageUrl: originalImageUrl,
        },
      }));
      setSuccessMsg('Restored original photo.');
      setTimeout(() => setSuccessMsg(null), 2000);
    }
  };

  const handleRemovePhoto = () => {
    setOriginalImageUrl(null);
    onChange((prev) => ({
      ...prev,
      emblem: {
        ...prev.emblem,
        imageUrl: undefined,
        imageFileName: undefined,
        type: 'shape',
      },
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSuccessMsg('Photo removed.');
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleResetPhoto = () => {
    onChange((prev) => ({
      ...prev,
      emblem: {
        ...prev.emblem,
        size: 140,
        rotation: 0,
        offsetX: 0,
        offsetY: 0,
        opacity: 1,
      },
    }));
    setSuccessMsg('Photo adjustments reset.');
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Error / Success Banners */}
      {errorMsg && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-start gap-2 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 font-bold">×</button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Android Gallery System Photo Picker Button */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Android Photo Gallery Picker</span>
          </label>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleRealGalleryUpload}
          className="hidden"
        />

        <button
          onClick={() => {
            setErrorMsg(null);
            fileInputRef.current?.click();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Open Real Photo Gallery</span>
        </button>

        {photoConfig.imageUrl && (
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-medium truncate max-w-[180px]">
                ✓ {photoConfig.imageFileName || 'Active Photo'}
              </span>
              <div className="flex items-center gap-1.5">
                {originalImageUrl && (
                  <button
                    onClick={handleRestoreOriginal}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    Restore Original
                  </button>
                )}
                <button
                  onClick={handleRemovePhoto}
                  className="px-2.5 py-1 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* AUTOMATIC PHOTO BACKGROUND REMOVER BUTTON */}
            <button
              onClick={handleRemoveBackground}
              disabled={isRemovingBg}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isRemovingBg ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Removing Background (AI Processing)...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Remove Background (Auto AI Cutout)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 2. Photo Editing Tools (Crop, Rotate, Resize, Opacity) */}
      {photoConfig.imageUrl && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Photo Transforms & Adjustments</span>
            </span>
            <button
              onClick={handleResetPhoto}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Photo Size / Resize */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Photo Size (Resize)</span>
              <span className="font-mono text-amber-400">{photoConfig.size}px</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              value={photoConfig.size}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  emblem: { ...prev.emblem, size: Number(e.target.value) },
                }))
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Photo Rotation */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Rotation Angle</span>
              <span className="font-mono text-amber-400">{photoConfig.rotation}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={photoConfig.rotation}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  emblem: { ...prev.emblem, rotation: Number(e.target.value) },
                }))
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Photo Opacity / Transparency */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Opacity / Transparency</span>
              <span className="font-mono text-amber-400">{Math.round(photoConfig.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={photoConfig.opacity}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  emblem: { ...prev.emblem, opacity: Number(e.target.value) },
                }))
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Circular Medal Crop Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <span className="text-xs text-slate-300">Circular / Badge Crop</span>
            <input
              type="checkbox"
              checked={photoConfig.circularCrop}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  emblem: { ...prev.emblem, circularCrop: e.target.checked },
                }))
              }
              className="w-4 h-4 rounded text-amber-500 accent-amber-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};
