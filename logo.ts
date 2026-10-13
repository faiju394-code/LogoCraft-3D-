export type MaterialFinish = 'metallic' | 'gloss' | 'matte' | 'neon' | 'chrome' | 'gold' | 'glass';

export type AspectRatio = '1:1' | '16:9' | '4:3' | '9:16' | '3:4';

export interface ColorGradient {
  enabled: boolean;
  type: 'linear' | 'radial';
  angle: number; // in degrees
  color1: string;
  color2: string;
  color3?: string;
}

export interface TextEffectConfig {
  extrusionDepth: number; // 0 to 60
  bevelSize: number; // 0 to 10
  bevelSegments: number;
  rotationX: number; // -45 to 45 deg
  rotationY: number; // -45 to 45 deg
  rotationZ: number; // -45 to 45 deg
  curveArc: number; // -90 to 90 deg
  outlineWidth: number; // 0 to 20
  outlineColor: string;
  glowEnabled: boolean;
  glowColor: string;
  glowBlur: number; // 0 to 40
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export interface EmblemConfig {
  enabled: boolean;
  type: 'shape' | 'image';
  shapeId: string;
  imageUrl?: string;
  imageFileName?: string;
  size: number; // 20 to 200
  offsetX: number;
  offsetY: number;
  rotation: number;
  color: string;
  extrusionDepth: number;
  circularCrop: boolean;
  opacity: number;
}

export type DesignLayerType = 'text' | 'image' | 'sticker' | 'shape' | 'brush';

export interface OutlineConfig {
  enabled: boolean;
  color: string;
  width: number;
  opacity: number;
}

export interface DesignLayer {
  id: string;
  type: DesignLayerType;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  outline?: OutlineConfig;
  textData?: {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    outlineColor?: string;
    outlineWidth?: number;
    shadowBlur?: number;
  };
  imageData?: {
    url: string;
    fileName: string;
    width: number;
    height: number;
    erasedPoints?: { x: number; y: number; radius: number }[];
  };
  shapeData?: {
    shapeType: 'rectangle' | 'circle' | 'square' | 'star' | 'arrow' | 'polygon';
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
  };
  brushData?: {
    points: { x: number; y: number }[];
    color: string;
    size: number;
    opacity: number;
  };
}

export interface VideoMotionConfig {
  enabled: boolean;
  videoUrl?: string;
  videoFileName?: string;
  startZoom: number; // 1 to 3
  endZoom: number; // 1 to 3
  panX: number; // -100 to 100
  panY: number; // -100 to 100
  duration: number; // seconds (2 to 15)
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  transitionType: 'zoom' | 'slide' | 'swipe' | 'spin' | 'flash' | 'dissolve';
  transitionDuration: number; // seconds
}

export interface BackgroundConfig {
  type: 'transparent' | 'solid' | 'gradient';
  color: string;
  gradientAngle: number;
  gradientColor1: string;
  gradientColor2: string;
  showFloorGrid: boolean;
  floorGridColor: string;
  vignette: boolean;
}

export interface LogoConfig {
  id: string;
  title: string;
  aspectRatio: AspectRatio;
  
  // Primary Text
  primaryText: string;
  fontFamily: string;
  fontSize: number; // 24 to 120
  letterSpacing: number; // -5 to 30
  lineHeight?: number; // 1 to 2
  textTransform: 'uppercase' | 'none' | 'lowercase';
  textColor: string;
  extrusionColor: string;
  
  // Secondary / Tagline Text
  taglineEnabled: boolean;
  taglineText: string;
  taglineFontFamily: string;
  taglineFontSize: number;
  taglineLetterSpacing: number;
  taglineColor: string;
  taglineOffsetY: number;
  
  // Multi-layers
  layers: DesignLayer[];
  activeLayerId?: string;

  // Material & Effects
  material: MaterialFinish;
  effects: TextEffectConfig;
  
  // Emblem / Image
  emblem: EmblemConfig;

  // Video & Motion
  videoMotion: VideoMotionConfig;
  
  // Lighting & Camera
  lightIntensity: number; // 0.5 to 2.5
  lightColor: string;
  autoRotate: boolean;
  autoRotateSpeed: number; // 0.5 to 4
  
  // Background
  background: BackgroundConfig;
}

export interface PresetTemplate {
  id: string;
  name: string;
  category: 'Tech' | 'Luxury' | 'Gaming' | 'Minimal' | 'Retro';
  previewColor: string;
  config: LogoConfig;
}

export interface FontOption {
  id: string;
  name: string;
  category: string;
  fallback: string;
}
