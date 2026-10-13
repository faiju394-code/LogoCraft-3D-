import React, { useState, useEffect } from 'react';
import { LogoConfig } from '../../types/logo';
import { Download, Share2, Check, X, Sparkles, Image as ImageIcon, Copy } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LogoConfig;
  exportLogo: (scale?: number, transparent?: boolean) => Promise<string>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  config,
  exportLogo,
}) => {
  const [resolution, setResolution] = useState<1 | 2 | 4>(2);
  const [exportTransparent, setExportTransparent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generate preview whenever settings change
  useEffect(() => {
    if (!isOpen) return;
    let isCurrent = true;

    const generatePreview = async () => {
      try {
        const url = await exportLogo(1, exportTransparent);
        if (isCurrent) setPreviewUrl(url);
      } catch (err) {
        console.error('Failed to generate export preview', err);
      }
    };

    generatePreview();
    return () => {
      isCurrent = false;
    };
  }, [isOpen, exportTransparent, exportLogo]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const url = await exportLogo(resolution, exportTransparent);
      const cleanName = (config.primaryText || 'logo')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const suffix = exportTransparent ? 'transparent' : 'studio';
      const fileName = `${cleanName}-3d-logo-${resolution}x-${suffix}.png`;

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Download error', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsExporting(true);
      const url = await exportLogo(resolution, exportTransparent);

      // Convert data URL to Blob for Web Share API
      const res = await fetch(url);
      const blob = await res.blob();
      const cleanName = (config.primaryText || 'logo')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const file = new File([blob], `${cleanName}-3d-logo.png`, {
        type: 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${config.primaryText} 3D Logo`,
          text: 'Created with 3D Logo Forge for Android',
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `${config.primaryText} 3D Logo`,
          text: 'Check out my 3D Logo design!',
        });
      } else {
        // Fallback to copy image URL
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  const getDimensionLabel = (res: number) => {
    const dim = 512 * res;
    return `${dim} × ${dim} px`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export 3D Logo</h3>
              <p className="text-xs text-slate-400">High-Fidelity PNG Export</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Export Preview */}
        <div className="relative aspect-square max-w-[240px] mx-auto rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center bg-[repeating-conic-gradient(#222_0%_25%,#111_0%_50%)_50%/12px_12px]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Logo export preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-xs text-slate-500 animate-pulse">
              Generating rendering...
            </div>
          )}
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-amber-300 font-mono backdrop-blur-sm">
            {getDimensionLabel(resolution)}
          </div>
        </div>

        {/* Resolution Quality Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Resolution & Scale
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 1 as const, name: '1x Web', size: '512px' },
              { val: 2 as const, name: '2x HD', size: '1024px' },
              { val: 4 as const, name: '4x Ultra', size: '2048px' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setResolution(item.val)}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  resolution === item.val
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm ring-1 ring-amber-400/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{item.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{item.size}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Transparent Alpha vs Canvas Backdrop */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Transparency Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setExportTransparent(true)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                exportTransparent
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-semibold mb-0.5">Transparent PNG</div>
              <div className="text-[10px] text-slate-500">
                Isolated logo with no background
              </div>
            </button>

            <button
              onClick={() => setExportTransparent(false)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                !exportTransparent
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-semibold mb-0.5">With Backdrop</div>
              <div className="text-[10px] text-slate-500">
                Studio lighting & floor grid
              </div>
            </button>
          </div>
        </div>

        {/* Primary Download & Android Share Buttons */}
        <div className="pt-2 space-y-2.5">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PNG ({getDimensionLabel(resolution)})</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            disabled={isExporting}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Android Native Share / Save to Gallery</span>
          </button>
        </div>
      </div>
    </div>
  );
};
