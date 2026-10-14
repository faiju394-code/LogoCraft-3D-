import React, { useState, useEffect, useRef } from 'react';
import { LogoConfig } from '../../types/logo';
import { FONTS } from '../../presets';
import { CustomFontItem, FONT_CATEGORIES, initializeCustomFonts, saveCustomFont, removeCustomFont, renameCustomFont } from '../../fontManager';
import { Type, Plus, Search, Trash2, Edit2, Star, Check, AlertCircle, X, Sparkles } from 'lucide-react';

interface FontManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const FontManagerModal: React.FC<FontManagerModalProps> = ({ isOpen, onClose, config, onChange }) => {
  const [customFonts, setCustomFonts] = useState<CustomFontItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [fontCategoryChoice, setFontCategoryChoice] = useState('Stylish');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      initializeCustomFonts().then((loaded) => setCustomFonts(loaded));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.ttf') && !fileName.endsWith('.otf') && !fileName.endsWith('.woff') && !fileName.endsWith('.woff2')) {
      setErrorMsg('Unsupported font format. Please select a valid .TTF or .OTF font file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Font file is too large. Please select a file under 15MB.');
      return;
    }

    try {
      const fontDisplayName = file.name.replace(/\.[^/.]+$/, '');
      const newFont = await saveCustomFont(fontDisplayName, fontCategoryChoice, file);
      if (newFont) {
        setCustomFonts((prev) => [...prev, newFont]);
        onChange((prev) => ({ ...prev, fontFamily: newFont.id }));
        setSuccessMsg(`Successfully installed "${fontDisplayName}"!`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse font file. The file might be corrupted.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    const updated = removeCustomFont(id);
    setCustomFonts(updated);
    if (config.fontFamily === id) {
      onChange((prev) => ({ ...prev, fontFamily: 'Unbounded' }));
    }
    setSuccessMsg('Font removed successfully.');
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleRenameSubmit = (id: string) => {
    if (!newName.trim()) return;
    const updated = renameCustomFont(id, newName.trim());
    setCustomFonts(updated);
    setRenamingId(null);
    setNewName('');
    setSuccessMsg('Font renamed.');
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  // Combine standard preset fonts + custom imported fonts
  const allFonts = [
    ...FONTS.map((f) => ({ id: f.id, name: f.name, category: f.category, isCustom: false })),
    ...customFonts.map((f) => ({ id: f.id, name: f.name, category: f.category, isCustom: true })),
  ];

  const filteredFonts = allFonts.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Font Manager & Add Font</h3>
              <p className="text-xs text-slate-400">Import TTF/OTF & Manage Unicode Typography</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

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

        {/* "+ Add Font" Action Bar */}
        <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Install Custom .TTF or .OTF Font</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Supports English, Hindi, Assamese, Bengali, Tamil & Unicode scripts.
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={fontCategoryChoice}
              onChange={(e) => setFontCategoryChoice(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-2.5 py-2 focus:outline-none focus:border-amber-400"
            >
              {FONT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              ref={fileInputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={handleFileImport}
              className="hidden"
            />

            <button
              onClick={() => {
                setErrorMsg(null);
                fileInputRef.current?.click();
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Font</span>
            </button>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search installed fonts..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {FONT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Font List with Live Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {filteredFonts.map((font) => {
            const isSelected = config.fontFamily === font.id;
            return (
              <div
                key={font.id}
                onClick={() => onChange((prev) => ({ ...prev, fontFamily: font.id }))}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-amber-400/90 font-medium font-mono uppercase">
                    {font.category} {font.isCustom && '· (Installed)'}
                  </span>

                  {font.isCustom && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(font.id);
                        }}
                        className="p-1 text-rose-400 hover:bg-rose-500/20 rounded-md"
                        title="Remove font"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div
                  className="text-lg text-slate-100 truncate py-1"
                  style={{ fontFamily: `"${font.id}", sans-serif` }}
                >
                  {config.primaryText || 'LogoCraft 3D'}
                </div>

                <div className="text-[11px] text-slate-400 truncate font-medium">
                  {font.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
