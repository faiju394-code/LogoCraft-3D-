import React, { useEffect, useRef, useState, useCallback } from 'react';
import { LogoConfig, MaterialFinish } from '../types/logo';
import { EMBLEM_SHAPES } from '../presets';
interface Canvas3DProps {
  confimportig: LogoConfig;
  mediaUrl?: string | null;
  mediaType?: 'photo' | 'video' | null;
  onRotationChange?: (rot: { x: number; y: number; z: number }) => void;
  exportRef?: React.MutableRefObject<((scale?: number, transparent?: boolean) => Promise<string>) | null>;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({ config, onRotationChange, exportRef, mediaUrl, mediaType }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 0,
    rotY: 0,
  });
  const currentRotRef = useRef<{ x: number; y: number; z: number }>({
    x: config.effects.rotationX,
    y: config.effects.rotationY,
    z: config.effects.rotationZ,
  });

  // Keep ref updated from config
  useEffect(() => {
    currentRotRef.current = {
      x: config.effects.rotationX,
      y: config.effects.rotationY,
      z: config.effects.rotationZ,
    };
  }, [config.effects.rotationX, config.effects.rotationY, config.effects.rotationZ]);

  // Image cache for custom uploaded emblem
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (config.emblem.enabled && config.emblem.type === 'image' && config.emblem.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = config.emblem.imageUrl;
      img.onload = () => {
        imageElementRef.current = img;
      };
    } else {
      imageElementRef.current = null;
    }
  }, [config.emblem.enabled, config.emblem.type, config.emblem.imageUrl]);

  // Function to render the logo on any canvas at any scale
  const renderLogoToCanvas = useCallback(
    (targetCanvas: HTMLCanvasElement, renderScale = 1, forceTransparent = false) => {
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      const width = targetCanvas.width;
      const height = targetCanvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      const isTransparent = forceTransparent || config.background.type === 'transparent';

      // 1. Background Rendering
      if (!isTransparent) {
        if (config.background.type === 'solid') {
          ctx.fillStyle = config.background.color;
          ctx.fillRect(0, 0, width, height);
        } else if (config.background.type === 'gradient') {
          const rad = (config.background.gradientAngle * Math.PI) / 180;
          const x0 = cx - Math.cos(rad) * cx;
          const y0 = cy - Math.sin(rad) * cy;
          const x1 = cx + Math.cos(rad) * cx;
          const y1 = cy + Math.sin(rad) * cy;
          const grad = ctx.createLinearGradient(x0, y0, x1, y1);
          grad.addColorStop(0, config.background.gradientColor1);
          grad.addColorStop(1, config.background.gradientColor2);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }

        // 3D Perspective Studio Floor Grid
        if (config.background.showFloorGrid) {
          ctx.save();
          const gridColor = config.background.floorGridColor || 'rgba(255,255,255,0.12)';
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 1 * renderScale;

          const horizonY = cy + 120 * renderScale;
          const floorBottom = height;
          const numLines = 14;

          // Radial vanishing lines
          for (let i = -numLines; i <= numLines; i++) {
            ctx.beginPath();
            ctx.moveTo(cx + i * 22 * renderScale, horizonY);
            ctx.lineTo(cx + i * 85 * renderScale, floorBottom);
            ctx.stroke();
          }

          // Horizontal perspective depth lines
          for (let j = 1; j <= 8; j++) {
            const t = j / 8;
            const y = horizonY + Math.pow(t, 2) * (floorBottom - horizonY);
            const span = (width * 0.9 * t);
            ctx.beginPath();
            ctx.moveTo(cx - span / 2, y);
            ctx.lineTo(cx + span / 2, y);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Vignette effect
        if (config.background.vignette) {
          ctx.save();
          const maxR = Math.sqrt(cx * cx + cy * cy);
          const vGrad = ctx.createRadialGradient(cx, cy, maxR * 0.35, cx, cy, maxR);
          vGrad.addColorStop(0, 'rgba(0,0,0,0)');
          vGrad.addColorStop(1, 'rgba(0,0,0,0.65)');
          ctx.fillStyle = vGrad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }
      }

      // 2. Setup 3D Projection Matrices
      ctx.save();
      ctx.translate(cx, cy);

      const rotXRad = (currentRotRef.current.x * Math.PI) / 180;
      const rotYRad = (currentRotRef.current.y * Math.PI) / 180;
      const rotZRad = (currentRotRef.current.z * Math.PI) / 180;

      // Global shadow beneath 3D object
      if (config.effects.shadowEnabled) {
        ctx.save();
        ctx.fillStyle = config.effects.shadowColor || 'rgba(0,0,0,0.6)';
        ctx.filter = `blur(${config.effects.shadowBlur * renderScale * 0.8}px)`;
        const shadowScaleY = Math.max(0.2, 0.45 + Math.sin(rotXRad) * 0.3);
        const shadowSkew = Math.sin(rotYRad) * 0.4;
        ctx.transform(
          1,
          0,
          shadowSkew,
          shadowScaleY,
          config.effects.shadowOffsetX * renderScale,
          (130 + config.effects.shadowOffsetY) * renderScale
        );
        ctx.beginPath();
        ctx.ellipse(0, 0, 140 * renderScale, 45 * renderScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3D Pseudo-isometric Transform Matrix
      const cosX = Math.cos(rotXRad);
      const sinX = Math.sin(rotXRad);
      const cosY = Math.cos(rotYRad);
      const sinY = Math.sin(rotYRad);
      const cosZ = Math.cos(rotZRad);
      const sinZ = Math.sin(rotZRad);

      // Extrusion vector based on rotation angles
      const extrudeStepX = -sinY * 1.35 * renderScale;
      const extrudeStepY = sinX * 1.35 * renderScale;
      const depthLevels = Math.max(0, Math.round(config.effects.extrusionDepth * (renderScale / 1.5)));

      // Render helper for text
      const drawTextItem = (
        text: string,
        font: string,
        size: number,
        spacing: number,
        offsetY: number,
        color: string,
        strokeOnly = false,
        strokeWidth = 0,
        strokeColor = '#ffffff'
      ) => {
        ctx.font = `900 ${size * renderScale}px "${font}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const transformText =
          config.textTransform === 'uppercase'
            ? text.toUpperCase()
            : config.textTransform === 'lowercase'
            ? text.toLowerCase()
            : text;

        const letterSpacingPx = spacing * renderScale;

        // Draw with letter spacing or curvature
        if (config.effects.curveArc !== 0 && text === config.primaryText) {
          const arcRad = (config.effects.curveArc * Math.PI) / 180;
          const radius = (width * 0.35 * renderScale) / (Math.abs(arcRad) || 0.1);
          const chars = transformText.split('');
          const totalAngle = arcRad;
          const stepAngle = totalAngle / Math.max(1, chars.length - 1);
          const startAngle = -totalAngle / 2;

          chars.forEach((char, idx) => {
            ctx.save();
            const angle = startAngle + stepAngle * idx;
            ctx.rotate(angle);
            ctx.translate(0, -radius + offsetY * renderScale);
            if (strokeOnly) {
              ctx.lineWidth = strokeWidth * renderScale;
              ctx.strokeStyle = strokeColor;
              ctx.strokeText(char, 0, 0);
            } else {
              ctx.fillStyle = color;
              ctx.fillText(char, 0, 0);
            }
            ctx.restore();
          });
        } else {
          // Standard horizontal text with custom letter-spacing
          const chars = transformText.split('');
          let totalWidth = 0;
          const charWidths = chars.map((char) => {
            const w = ctx.measureText(char).width;
            totalWidth += w + letterSpacingPx;
            return w;
          });
          totalWidth -= letterSpacingPx;

          let startX = -totalWidth / 2;
          chars.forEach((char, idx) => {
            const charW = charWidths[idx];
            const posX = startX + charW / 2;
            startX += charW + letterSpacingPx;

            if (strokeOnly) {
              ctx.lineWidth = strokeWidth * renderScale;
              ctx.strokeStyle = strokeColor;
              ctx.lineJoin = 'round';
              ctx.strokeText(char, posX, offsetY * renderScale);
            } else {
              ctx.fillStyle = color;
              ctx.fillText(char, posX, offsetY * renderScale);
            }
          });
        }
      };

      // Render helper for Emblem / SVG Path or Custom Image
      const drawEmblemItem = (
        color: string,
        offsetX: number,
        offsetY: number,
        scaleMultiplier = 1
      ) => {
        if (!config.emblem.enabled) return;

        ctx.save();
        ctx.translate(
          (config.emblem.offsetX + offsetX) * renderScale,
          (config.emblem.offsetY + offsetY) * renderScale
        );
        ctx.rotate((config.emblem.rotation * Math.PI) / 180);
        ctx.globalAlpha = config.emblem.opacity;

        const size = config.emblem.size * renderScale * scaleMultiplier;

        if (config.emblem.type === 'image' && imageElementRef.current) {
          const img = imageElementRef.current;
          const halfSize = size / 2;

          if (config.emblem.circularCrop) {
            ctx.beginPath();
            ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
            ctx.clip();
          }

          ctx.drawImage(img, -halfSize, -halfSize, size, size);
        } else {
          // Render SVG Vector Emblem Shape
          const shapeObj =
            EMBLEM_SHAPES.find((s) => s.id === config.emblem.shapeId) || EMBLEM_SHAPES[0];
          const path2d = new Path2D(shapeObj.svgPath);

          // SVG paths are normalized in a 100x100 viewBox with center at 50,50
          const shapeScale = size / 100;
          ctx.scale(shapeScale, shapeScale);
          ctx.translate(-50, -50);

          ctx.fillStyle = color;
          ctx.fill(path2d);
        }

        ctx.restore();
      };

      // Apply 3D perspective skew and rotation to the canvas context
      ctx.transform(
        cosY * cosZ,
        cosY * sinZ - sinX * sinY * cosZ,
        -cosX * sinZ,
        cosX * cosZ,
        0,
        0
      );

      // --- 3D EXTRUSION LAYERS (BACK TO FRONT) ---
      // We render depth slices from furthest depth to front face
      for (let d = depthLevels; d > 0; d--) {
        const factor = d / Math.max(1, depthLevels);
        const curOffsetX = extrudeStepX * d;
        const curOffsetY = extrudeStepY * d;

        // Shading darker toward the back with subtle bevel ambient occlusion
        ctx.save();
        ctx.translate(curOffsetX, curOffsetY);

        // Darken extrusion color by depth
        const depthColor = adjustBrightness(config.extrusionColor, -15 - factor * 35);

        // 3D Emblem depth slice
        if (config.emblem.enabled && config.emblem.extrusionDepth > 0) {
          const emblemDepthFactor = d / Math.max(1, depthLevels);
          if (emblemDepthFactor * config.effects.extrusionDepth <= config.emblem.extrusionDepth) {
            const emblemSliceColor = adjustBrightness(
              config.emblem.color || config.extrusionColor,
              -20 - factor * 30
            );
            drawEmblemItem(emblemSliceColor, 0, 0);
          }
        }

        // 3D Primary Text depth slice
        drawTextItem(
          config.primaryText,
          config.fontFamily,
          config.fontSize,
          config.letterSpacing,
          0,
          depthColor
        );

        ctx.restore();
      }

      // --- 2D / 3D GLOW AURA (Behind Front Face) ---
      if (config.effects.glowEnabled) {
        ctx.save();
        ctx.shadowColor = config.effects.glowColor;
        ctx.shadowBlur = config.effects.glowBlur * renderScale * 1.5;
        // Stroke glow
        drawTextItem(
          config.primaryText,
          config.fontFamily,
          config.fontSize,
          config.letterSpacing,
          0,
          config.effects.glowColor,
          true,
          Math.max(4, config.effects.outlineWidth + 4),
          config.effects.glowColor
        );
        ctx.restore();
      }

      // --- OUTLINE EFFECT (Around Front Face) ---
      if (config.effects.outlineWidth > 0) {
        ctx.save();
        drawTextItem(
          config.primaryText,
          config.fontFamily,
          config.fontSize,
          config.letterSpacing,
          0,
          'transparent',
          true,
          config.effects.outlineWidth,
          config.effects.outlineColor
        );
        ctx.restore();
      }

      // --- FRONT FACE: EMBLEM ---
      if (config.emblem.enabled) {
        ctx.save();
        // Bevel highlight or material shader for emblem
        const emblemFill = getMaterialStyle(
          ctx,
          config.emblem.color || config.textColor,
          config.material,
          cx,
          cy,
          100 * renderScale
        );
        drawEmblemItem(emblemFill as string, 0, 0);
        ctx.restore();
      }

      // --- FRONT FACE: PRIMARY TEXT (With Material Finish) ---
      ctx.save();
      const textFill = getMaterialStyle(
        ctx,
        config.textColor,
        config.material,
        cx,
        cy,
        config.fontSize * renderScale * 2
      );

      // Bevel highlight shine on top edge
      if (config.effects.bevelSize > 0) {
        ctx.save();
        ctx.translate(0, -config.effects.bevelSize * 0.4 * renderScale);
        drawTextItem(
          config.primaryText,
          config.fontFamily,
          config.fontSize,
          config.letterSpacing,
          0,
          'rgba(255,255,255,0.45)'
        );
        ctx.restore();
      }

      // Core front face
      drawTextItem(
        config.primaryText,
        config.fontFamily,
        config.fontSize,
        config.letterSpacing,
        0,
        textFill as string
      );
      ctx.restore();

      // --- SECONDARY TAGLINE TEXT ---
      if (config.taglineEnabled && config.taglineText.trim()) {
        ctx.save();
        // Subtle 3D offset for tagline
        const tagOffsetY = config.taglineOffsetY * renderScale;
        ctx.font = `700 ${config.taglineFontSize * renderScale}px "${config.taglineFontFamily}", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = config.taglineColor;

        // Custom spacing for tagline
        const tagChars = config.taglineText.toUpperCase().split('');
        const tagSpacing = config.taglineLetterSpacing * renderScale;
        let totalTagWidth = 0;
        const tagWidths = tagChars.map((c) => {
          const w = ctx.measureText(c).width;
          totalTagWidth += w + tagSpacing;
          return w;
        });
        totalTagWidth -= tagSpacing;

        let startTagX = -totalTagWidth / 2;
        tagChars.forEach((c, idx) => {
          const cw = tagWidths[idx];
          const px = startTagX + cw / 2;
          startTagX += cw + tagSpacing;
          ctx.fillText(c, px, tagOffsetY);
        });

        ctx.restore();
      }

      ctx.restore(); // Restore 3D center translate
    },
    [config]
  );

  // Material shaders / gradient styling
  const getMaterialStyle = (
    ctx: CanvasRenderingContext2D,
    baseColor: string,
    material: MaterialFinish,
    x: number,
    y: number,
    size: number
  ): string | CanvasGradient => {
    const half = size / 2;
    if (material === 'gold') {
      const grad = ctx.createLinearGradient(-half, -half, half, half);
      grad.addColorStop(0, '#FFE875');
      grad.addColorStop(0.3, '#FFD700');
      grad.addColorStop(0.65, '#D4AF37');
      grad.addColorStop(0.85, '#FFF2A3');
      grad.addColorStop(1, '#996515');
      return grad;
    }
    if (material === 'chrome') {
      const grad = ctx.createLinearGradient(-half, -half, half, half);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.25, '#CBD5E1');
      grad.addColorStop(0.5, '#64748B');
      grad.addColorStop(0.75, '#F8FAFC');
      grad.addColorStop(1, '#334155');
      return grad;
    }
    if (material === 'metallic') {
      const grad = ctx.createLinearGradient(-half, -half, half, half);
      grad.addColorStop(0, adjustBrightness(baseColor, 40));
      grad.addColorStop(0.4, baseColor);
      grad.addColorStop(0.7, adjustBrightness(baseColor, -25));
      grad.addColorStop(1, adjustBrightness(baseColor, 25));
      return grad;
    }
    if (material === 'neon') {
      return baseColor;
    }
    if (material === 'glass') {
      const grad = ctx.createLinearGradient(-half, -half, half, half);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
      grad.addColorStop(1, 'rgba(255,255,255,0.1)');
      return grad;
    }
    return baseColor;
  };

  // Utility to darken or lighten hex colors
  const adjustBrightness = (hex: string, percent: number): string => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (cleanHex.length !== 6) return hex;
    const num = parseInt(cleanHex, 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  };

  // Handle Canvas Resizing & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let lastTime = performance.now();

    const updateAndDraw = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Turntable Auto-rotation
      if (config.autoRotate && !isDragging) {
        currentRotRef.current.y = (currentRotRef.current.y + config.autoRotateSpeed * 35 * delta) % 360;
        if (onRotationChange) {
          onRotationChange({ ...currentRotRef.current });
        }
      }

      renderLogoToCanvas(canvas, 1);
      animId = requestAnimationFrame(updateAndDraw);
    };

    animId = requestAnimationFrame(updateAndDraw);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [config, isDragging, onRotationChange, renderLogoToCanvas]);

  // Touch & Mouse Drag Handlers for 3D Orbiting
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: currentRotRef.current.x,
      rotY: currentRotRef.current.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newRotY = Math.max(-60, Math.min(60, dragStartRef.current.rotY + dx * 0.45));
    const newRotX = Math.max(-50, Math.min(50, dragStartRef.current.rotX - dy * 0.45));

    currentRotRef.current.x = Math.round(newRotX);
    currentRotRef.current.y = Math.round(newRotY);

    if (onRotationChange) {
      onRotationChange({ ...currentRotRef.current });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Expose HD Export Function via Ref
  useEffect(() => {
    if (exportRef) {
      exportRef.current = async (scale = 2, transparent = false) => {
        const offCanvas = document.createElement('canvas');
        const baseWidth = 512;
        const baseHeight = 512;
        offCanvas.width = baseWidth * scale;
        offCanvas.height = baseHeight * scale;

        renderLogoToCanvas(offCanvas, scale, transparent);
        return offCanvas.toDataURL('image/png');
      };
    }
  }, [exportRef, renderLogoToCanvas]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full max-w-[420px] aspect-square object-contain cursor-grab active:cursor-grabbing touch-none transition-shadow rounded-2xl drop-shadow-2xl"
      />

      {/* Floating 3D Gesture Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[11px] text-slate-300 pointer-events-none flex items-center gap-1.5 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <span>Drag to rotate in 3D</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400 font-mono text-[10px]">
          X: {Math.round(currentRotRef.current.x)}° Y: {Math.round(currentRotRef.current.y)}°
        </span>
      </div>
    </div>
  );
};
