import React, { useState, useRef } from 'react';
import { LogoConfig } from '../../types/logo';
import { Wand2, Image as ImageIcon, Sparkles, Upload, AlertCircle, Check, Loader2, Video, Smartphone } from 'lucide-react';

interface AIThumbnailPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const AIThumbnailPanel: React.FC<AIThumbnailPanelProps> = ({ config, onChange }) => {
  const [prompt, setPrompt] = useState('Cinematic YouTube thumbnail background, vibrant neon studio lighting, 4k');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Tamil Quick Title Presets
  const tamilPresets = [
    { label: 'வெற்றி நிச்சயம்! (Success)', text: 'வெற்றி நிச்சயம்!' },
    { label: 'சமையல் குறிப்புகள் (Cooking)', text: 'அசத்தல் சமையல்' },
    { label: 'அசத்தல் டெக் (Tech Review)', text: 'டெக் விமர்சனம் 2026' },
    { label: 'அதிர்ச்சி செய்தி! (Breaking)', text: 'அதிர்ச்சி தகவல்!' },
  ];

  // Aspect Ratio Presets
  const aspectPresets = [
    { label: 'YouTube Thumbnail (16:9)', ratio: '16:9' as const, width: 1280, height: 720 },
    { label: 'YouTube Shorts (9:16)', ratio: '9:16' as const, width: 1080, height: 1920 },
    { label: 'Square Post (1:1)', ratio: '1:1' as const, width: 1080, height: 1080 },
  ];

  // Handle Photo Gallery Upload with Permission & Error Handling
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File is too large. Please select an image under 15MB.');
      return;
    }

    try {
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
            size: 140,
          },
        }));
        setSuccessMsg('Photo uploaded successfully from gallery!');
        setTimeout(() => setSuccessMsg(null), 3000);
      };
      reader.onerror = () => {
        setErrorMsg('Failed to read image file. Please try another photo.');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gallery access permission error.');
    }
  };

  // AI Image Generation Call to Server API
  const handleGenerateAIImage = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a description for AI image generation.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          aspectRatio: config.aspectRatio || '16:9',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server failed to generate AI image.');
      }

      if (data.imageUrl) {
        onChange((prev) => ({
          ...prev,
          emblem: {
            ...prev.emblem,
            enabled: true,
            type: 'image',
            imageUrl: data.imageUrl,
            imageFileName: 'ai-generated-bg.png',
            size: 180,
            offsetX: 0,
            offsetY: 0,
          },
        }));
        setSuccessMsg('AI background generated successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'AI generation error. Please check your Gemini API key in Settings > Secrets.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyAspectRatio = (ratio: '1:1' | '16:9' | '9:16') => {
    onChange((prev) => ({
      ...prev,
      aspectRatio: ratio,
    }));
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Error & Success Banners */}
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

      {/* 1. Upload Photo from Gallery */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Android Gallery Photo Upload</span>
          </label>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <button
          onClick={() => {
            setErrorMsg(null);
            fileInputRef.current?.click();
          }}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4 text-amber-400" />
          <span>Select Photo from Android Gallery</span>
        </button>
        <p className="text-[10px] text-slate-500 text-center">
          Requests storage/photo permissions securely. Max file size: 15MB.
        </p>
      </div>

      {/* 2. AI Image Generation */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini AI Background Generator</span>
          </label>
          <span className="text-[10px] text-amber-400 font-mono">Gemini 3.1</span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe AI background or thumbnail theme..."
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
        />

        <button
          onClick={handleGenerateAIImage}
          disabled={isGenerating}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Generating AI Image...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Background</span>
            </>
          )}
        </button>
        <p className="text-[10px] text-slate-500 text-center">
          Powered by server-side Gemini API. Configured via Settings &gt; Secrets.
        </p>
      </div>

      {/* 3. YouTube Thumbnail & Shorts Presets */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-amber-400" />
          <span>Aspect Ratio Presets</span>
        </label>

        <div className="grid grid-cols-3 gap-2">
          {aspectPresets.map((preset) => {
            const isSelected = config.aspectRatio === preset.ratio;
            return (
              <button
                key={preset.ratio}
                onClick={() => applyAspectRatio(preset.ratio)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{preset.label.split(' ')[0]}</div>
                <div className="text-[10px] font-mono text-slate-500">
                  {preset.width}×{preset.height}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tamil YouTube Thumbnail Maker & Unicode Presets */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Tamil Thumbnail Quick Titles
          </label>
          <span className="text-[10px] text-amber-400">Unicode Ready</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {tamilPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  primaryText: preset.text,
                }))
              }
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-400 text-left transition-all"
            >
              <div className="text-xs font-bold text-white truncate">{preset.text}</div>
              <div className="text-[10px] text-slate-400 truncate">{preset.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
