import { FontOption } from '../types/logo';

export interface CustomFontItem {
  id: string;
  name: string;
  category: string;
  dataUrl: string; // base64 arraybuffer for persistence
  isCustom: boolean;
  isFavorite?: boolean;
}

const CUSTOM_FONTS_STORAGE_KEY = 'logo_craft_custom_fonts';
const RECENT_FONTS_STORAGE_KEY = 'logo_craft_recent_fonts';
const FAVORITE_FONTS_STORAGE_KEY = 'logo_craft_favorite_fonts';

export const FONT_CATEGORIES = [
  'All',
  'Stylish',
  'Bold',
  '3D',
  'Calligraphy',
  'Handwriting',
  'Display',
  'Decorative',
  'Serif',
  'Sans Serif',
];

// Initialize and load custom fonts from localStorage on startup
export async function initializeCustomFonts(): Promise<CustomFontItem[]> {
  try {
    const raw = localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
    if (!raw) return [];
    const items: CustomFontItem[] = JSON.parse(raw);
    for (const font of items) {
      try {
        const response = await fetch(font.dataUrl);
        const buffer = await response.arrayBuffer();
        const fontFace = new FontFace(font.id, buffer);
        await fontFace.load();
        document.fonts.add(fontFace);
      } catch (err) {
        console.error('Failed to register persisted font:', font.name, err);
      }
    }
    return items;
  } catch (err) {
    console.error('Error loading custom fonts', err);
    return [];
  }
}

export async function saveCustomFont(name: string, category: string, file: File): Promise<CustomFontItem | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to base64 data URL for localStorage persistence
    const blob = new Blob([arrayBuffer]);
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const fontId = `custom_${Date.now()}_${name.replace(/[^a-zA-Z0-9]/g, '_')}`;

        try {
          const fontFace = new FontFace(fontId, arrayBuffer);
          await fontFace.load();
          document.fonts.add(fontFace);

          const newItem: CustomFontItem = {
            id: fontId,
            name,
            category: category || 'Stylish',
            dataUrl,
            isCustom: true,
          };

          // Save to localStorage
          const existingRaw = localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
          const existing: CustomFontItem[] = existingRaw ? JSON.parse(existingRaw) : [];
          existing.push(newItem);
          localStorage.setItem(CUSTOM_FONTS_STORAGE_KEY, JSON.stringify(existing));

          resolve(newItem);
        } catch (e) {
          reject(new Error('Invalid font file format. Ensure it is a valid .TTF or .OTF file.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read font file.'));
      reader.readAsDataURL(blob);
    });
  } catch (err: any) {
    throw new Error(err.message || 'Failed to import font.');
  }
}

export function removeCustomFont(fontId: string): CustomFontItem[] {
  try {
    const existingRaw = localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
    if (!existingRaw) return [];
    const existing: CustomFontItem[] = JSON.parse(existingRaw);
    const updated = existing.filter((f) => f.id !== fontId);
    localStorage.setItem(CUSTOM_FONTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error removing font', err);
    return [];
  }
}

export function renameCustomFont(fontId: string, newName: string): CustomFontItem[] {
  try {
    const existingRaw = localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
    if (!existingRaw) return [];
    const existing: CustomFontItem[] = JSON.parse(existingRaw);
    const updated = existing.map((f) => (f.id === fontId ? { ...f, name: newName } : f));
    localStorage.setItem(CUSTOM_FONTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error renaming font', err);
    return [];
  }
}
