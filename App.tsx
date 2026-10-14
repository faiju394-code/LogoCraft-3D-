import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LogoConfig, PresetTemplate } from './logo';
import { DEFAULT_LOGO_CONFIG, PRESET_TEMPLATES, COLOR_PALETTES, FONTS, EMBLEM_SHAPES } from './presets';
import { Canvas3D } from './Canvas3D';
import { MobileFrame } from './MobileFrame';
import { Toolbar, TabType } from './Toolbar';
import { TextPanel } from './TextPanel';
import { Effects3DPanel } from './Effects3DPanel';
import { EmblemPanel } from './EmblemPanel';
import { ColorsPanel } from './ColorsPanel';
import { BackgroundPanel } from './BackgroundPanel';
import { ExportModal } from './ExportModal';
import { ReactNativeModal } from './ReactNativeModal';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Shuffle,
  Maximize2,
  Minimize2,
  Download,
  Smartphone,
  Sparkles,
  Layers,
  Play,
  Pause,
  X,
  Check,
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<LogoConfig>(() => {
    try {
      const saved = localStorage.getItem('logo_forge_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_LOGO_CONFIG;
  });

  // Undo / Redo history
  const [history, setHistory] = useState<LogoConfig[]>([DEFAULT_LOGO_CONFIG]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Active Bottom Sheet Tab
  const [activeTab, setActiveTab] = useState<TabType>('text');

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isReactNativeOpen, setIsReactNativeOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Android Mobile Frame preview vs Fullscreen mode
  const [isMobileFrameView, setIsMobileFrameView] = useState(true);

  // Reference for 3D export rendering
  const exportRef = useRef<((scale?: number, transparent?: boolean) => Promise<string>) | null>(null);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('logo_forge_config', JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  // Update config with history tracking
  const updateConfig = useCallback((updater: (prev: LogoConfig) => LogoConfig) => {
    setConfig((prev) => {
      const next = updater(prev);
      setHistory((prevHist) => {
        const sliced = prevHist.slice(0, historyIndex + 1);
        return [...sliced, next];
      });
      setHistoryIndex((prevIdx) => prevIdx + 1);
      return next;
    });
  }, [historyIndex]);

  // Direct fast update (e.g. while dragging or auto-rotating without bloating history)
  const setConfigDirect = useCallback((updater: (prev: LogoConfig) => LogoConfig) => {
    setConfig(updater);
  }, []);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setConfig(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setConfig(history[nextIdx]);
    }
  };

  const handleApplyPreset = (preset: PresetTemplate) => {
    updateConfig(() => ({ ...preset.config }));
    setIsTemplatesOpen(false);
  };

  const handleRandomize = () => {
    const randomFont = FONTS[Math.floor(Math.random() * FONTS.length)].id;
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const randomShape = EMBLEM_SHAPES[Math.floor(Math.random() * EMBLEM_SHAPES.length)].id;
    const materials: LogoConfig['material'][] = ['gold', 'chrome', 'metallic', 'neon', 'matte'];
    const randomMaterial = materials[Math.floor(Math.random() * materials.length)];

    updateConfig((prev) => ({
      ...prev,
      fontFamily: randomFont,
      material: randomMaterial,
      textColor: randomPalette.textColor,
      extrusionColor: randomPalette.extrusionColor,
      taglineColor: randomPalette.accentColor,
      effects: {
        ...prev.effects,
        extrusionDepth: 16 + Math.floor(Math.random() * 24),
        rotationX: -10 + Math.floor(Math.random() * 25),
        rotationY: -25 + Math.floor(Math.random() * 50),
        outlineColor: randomPalette.textColor,
        glowColor: randomPalette.accentColor,
      },
      emblem: {
        ...prev.emblem,
        shapeId: randomShape,
        color: randomPalette.textColor,
      },
      background: {
        ...prev.background,
        color: randomPalette.bgColor,
        gradientColor1: randomPalette.bgColor,
        gradientColor2: '#050308',
      },
    }));
  };

  const handleReset = () => {
    updateConfig(() => DEFAULT_LOGO_CONFIG);
  };

  // Callback from Canvas3D drag
  const handleCanvasRotation = useCallback((rot: { x: number; y: number; z: number }) => {
    setConfigDirect((prev) => ({
      ...prev,
      effects: {
        ...prev.effects,
        rotationX: rot.x,
        rotationY: rot.y,
        rotationZ: rot.z,
      },
    }));
  }, [setConfigDirect]);

  // Main UI shell inside either Mobile Frame or Fullscreen
  const studioContent = (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* --- TOP APP BAR --- */}
      <header className="h-14 px-3 sm:px-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between shrink-0 z-30 select-none">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-amber-500/20">
            3D
          </div>
          <span className="font-bold text-sm tracking-tight text-white truncate">
            Logo Forge
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Templates Drawer Button */}
          <button
            onClick={() => setIsTemplatesOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-amber-300 flex items-center gap-1 border border-slate-700/60 transition-all cursor-pointer"
            title="Browse Starter Logo Templates"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          {/* Randomize Button */}
          <button
            onClick={handleRandomize}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Randomize Design"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Redo Button */}
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Frame Toggle */}
          <button
            onClick={() => setIsMobileFrameView((prev) => !prev)}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-all cursor-pointer"
            title={isMobileFrameView ? 'Expand to Fullscreen' : 'Switch to Android Mobile Mockup'}
          >
            {isMobileFrameView ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* --- MAIN SPLIT VIEW (3D VIEWPORT & BOTTOM EDITING SHEET) --- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* 3D Interactive Viewport */}
        <section className="relative flex-1 min-h-[300px] md:min-h-0 flex items-center justify-center p-3 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
          <Canvas3D
            config={config}
            onRotationChange={handleCanvasRotation}
            exportRef={exportRef}
          />

          {/* Floating Canvas Quick Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {/* Auto-Rotate Turntable Toggle */}
            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  autoRotate: !prev.autoRotate,
                }))
              }
              className={`p-2 rounded-xl backdrop-blur-md border transition-all shadow-lg ${
                config.autoRotate
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                  : 'bg-black/50 border-white/10 text-slate-400 hover:text-white'
              }`}
              title={config.autoRotate ? 'Pause 360° spin' : 'Start 360° spin'}
            >
              {config.autoRotate ? (
                <Pause className="w-4 h-4 text-amber-400" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            {/* Reset Camera Angles */}
            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  effects: {
                    ...prev.effects,
                    rotationX: 0,
                    rotationY: 0,
                    rotationZ: 0,
                  },
                }))
              }
              className="p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-slate-400 hover:text-white transition-all shadow-lg"
              title="Reset 3D Angle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Controls Panel / Drawer */}
        <section className="w-full md:w-[380px] lg:w-[420px] h-[340px] md:h-full flex flex-col bg-slate-950/95 shrink-0 overflow-hidden">
          {/* Active Panel Title */}
          <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {activeTab === 'text' && 'Typography & Brand'}
              {activeTab === 'effects' && '3D Depth & Light Effects'}
              {activeTab === 'emblem' && '3D Emblem & Custom Image'}
              {activeTab === 'colors' && 'Color Schemes & Materials'}
              {activeTab === 'backdrop' && 'Backdrop & Perspective'}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {config.material.toUpperCase()}
            </span>
          </div>

          {/* Scrollable Controls Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
            {activeTab === 'text' && (
              <TextPanel config={config} onChange={updateConfig} />
            )}
            {activeTab === 'effects' && (
              <Effects3DPanel config={config} onChange={updateConfig} />
            )}
            {activeTab === 'emblem' && (
              <EmblemPanel config={config} onChange={updateConfig} />
            )}
            {activeTab === 'colors' && (
              <ColorsPanel config={config} onChange={updateConfig} />
            )}
            {activeTab === 'backdrop' && (
              <BackgroundPanel config={config} onChange={updateConfig} />
            )}
          </div>

          {/* Bottom Thumb Navigation Bar */}
          <Toolbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenReactNative={() => setIsReactNativeOpen(true)}
          />
        </section>
      </div>

      {/* --- TEMPLATES MODAL --- */}
      {isTemplatesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  3D Logo Templates
                </h3>
              </div>
              <button
                onClick={() => setIsTemplatesOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Choose a starter design. You can fully customize all text, colors, 3D depths, and emblems.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleApplyPreset(tmpl)}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-400 text-left transition-all group flex flex-col justify-between h-28 hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">
                      {tmpl.category}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: tmpl.previewColor }}
                    />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {tmpl.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {tmpl.config.primaryText} · {tmpl.config.material}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- EXPORT MODAL --- */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
        exportLogo={async (scale = 2, transparent = false) => {
          if (exportRef.current) {
            return exportRef.current(scale, transparent);
          }
          return '';
        }}
      />

      {/* --- REACT NATIVE & ANDROID GUIDE MODAL --- */}
      <ReactNativeModal
        isOpen={isReactNativeOpen}
        onClose={() => setIsReactNativeOpen(false)}
      />
    </div>
  );

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 flex flex-col">
      <MobileFrame enabled={isMobileFrameView}>
        {studioContent}
      </MobileFrame>
    </div>
  );
}
