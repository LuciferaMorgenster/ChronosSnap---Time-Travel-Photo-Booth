import { FilterSettings, HistoricalEra, VintageFilterType } from '../types';

/**
 * Apply real-time vintage and artistic photographic filters directly to a canvas.
 */
export function applyFiltersToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: FilterSettings
) {
  const {
    filterType,
    sepiaIntensity,
    grain,
    vignette,
    contrast,
    brightness,
    borderStyle,
    showTimestamp,
    dateCaption,
  } = settings;

  // 1. Pixel manipulation for Color Grading & Sepia/Vintage
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness adjustment
    if (brightness !== 0) {
      r += brightness;
      g += brightness;
      b += brightness;
    }

    // Contrast adjustment
    if (contrast !== 0) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    // Filter profiles
    switch (filterType) {
      case 'sepia1890': {
        const factor = sepiaIntensity / 100;
        const tr = 0.393 * r + 0.769 * g + 0.189 * b;
        const tg = 0.349 * r + 0.686 * g + 0.168 * b;
        const tb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = r * (1 - factor) + tr * factor;
        g = g * (1 - factor) + tg * factor;
        b = b * (1 - factor) + tb * factor;
        break;
      }
      case 'daguerreotype': {
        // High-contrast, silver-plate monochrome with slight warm metallic tint
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray * 1.05 + 8;
        g = gray * 0.98 + 4;
        b = gray * 0.88;
        break;
      }
      case 'noir1920': {
        // Orthochromatic deep noir black and white
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const noir = gray < 128 ? gray * 0.85 : gray * 1.15;
        r = noir;
        g = noir;
        b = noir;
        break;
      }
      case 'kodachrome': {
        // 1970s warm Kodachrome film look
        r = r * 1.12 + 10;
        g = g * 0.98;
        b = b * 0.88 - 5;
        break;
      }
      case 'technicolor': {
        // 1950s 3-strip Technicolor vibrant dye
        r = Math.min(255, r * 1.25);
        g = Math.min(255, g * 1.15);
        b = Math.min(255, b * 1.1);
        break;
      }
      case 'cyanotype': {
        // Prussian blue sun printing
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray * 0.2;
        g = gray * 0.6 + 20;
        b = gray * 0.95 + 40;
        break;
      }
      case 'none':
      default: {
        if (sepiaIntensity > 0) {
          const factor = sepiaIntensity / 100;
          const tr = 0.393 * r + 0.769 * g + 0.189 * b;
          const tg = 0.349 * r + 0.686 * g + 0.168 * b;
          const tb = 0.272 * r + 0.534 * g + 0.131 * b;
          r = r * (1 - factor) + tr * factor;
          g = g * (1 - factor) + tg * factor;
          b = b * (1 - factor) + tb * factor;
        }
        break;
      }
    }

    // Apply film grain noise
    if (grain > 0) {
      const noise = (Math.random() - 0.5) * (grain * 0.75);
      r += noise;
      g += noise;
      b += noise;
    }

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  ctx.putImageData(imgData, 0, 0);

  // 2. Vignette Layer
  if (vignette > 0) {
    const radius = Math.max(width, height) * 0.75;
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * 0.3,
      width / 2,
      height / 2,
      radius
    );
    const vignetteOpacity = (vignette / 100) * 0.85;
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.7, `rgba(15, 10, 5, ${vignetteOpacity * 0.4})`);
    gradient.addColorStop(1, `rgba(10, 5, 2, ${vignetteOpacity})`);

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 3. Vintage Border Frames
  if (borderStyle !== 'none') {
    ctx.save();
    switch (borderStyle) {
      case 'cabinet': {
        // Victorian Cabinet Card with gold embossed bevel
        const borderW = Math.round(width * 0.05);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.strokeRect(borderW / 2, borderW / 2, width - borderW, height - borderW);

        // Aged paper texture border
        ctx.fillStyle = '#f4ecd8';
        ctx.lineWidth = borderW;
        ctx.strokeStyle = '#d7c7a3';
        ctx.strokeRect(borderW / 2, borderW / 2, width - borderW, height - borderW);
        break;
      }
      case 'polaroid': {
        // Classic Instant Print Frame
        const padX = width * 0.04;
        const padTop = height * 0.04;
        const padBottom = height * 0.16;

        ctx.lineWidth = padX * 2;
        ctx.strokeStyle = '#f8fafc';
        ctx.strokeRect(0, 0, width, height);

        // Extra bottom chin
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, height - padBottom, width, padBottom);

        // Subtle bottom border shadow
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, height - 4, width, 4);
        break;
      }
      case 'gilded': {
        // Ornate Renaissance Museum Gold Frame
        const frameW = Math.round(width * 0.06);
        ctx.lineWidth = frameW;
        ctx.strokeStyle = '#b8860b';
        ctx.strokeRect(frameW / 2, frameW / 2, width - frameW, height - frameW);

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffd700';
        ctx.strokeRect(frameW, frameW, width - frameW * 2, height - frameW * 2);
        break;
      }
      case 'museum': {
        // Minimalist Mahogany Dark Mat
        const frameW = Math.round(width * 0.04);
        ctx.lineWidth = frameW;
        ctx.strokeStyle = '#1e1b18';
        ctx.strokeRect(frameW / 2, frameW / 2, width - frameW, height - frameW);
        break;
      }
    }
    ctx.restore();
  }

  // 4. Timestamp & Caption overlay
  if (showTimestamp && dateCaption) {
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.font = `600 ${Math.max(12, Math.round(width * 0.028))}px 'Cinzel', serif`;
    ctx.textAlign = 'right';
    ctx.fillText(dateCaption, width - width * 0.06, height - height * 0.05);
    ctx.restore();
  }
}

/**
 * High-quality client-side temporal portrait synthesizer for instant offline & fast transformations.
 */
export async function synthesizeHistoricalFallback(
  faceImg: HTMLImageElement,
  era: HistoricalEra,
  customPrompt?: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  const size = 800;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // 1. Draw Era-specific atmospheric background
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  switch (era.id) {
    case 'ancient_egypt':
      bgGrad.addColorStop(0, '#592c08');
      bgGrad.addColorStop(0.5, '#b45309');
      bgGrad.addColorStop(1, '#1c1917');
      break;
    case 'renaissance_florence':
      bgGrad.addColorStop(0, '#2b1d0c');
      bgGrad.addColorStop(0.5, '#451a03');
      bgGrad.addColorStop(1, '#0f172a');
      break;
    case 'victorian_steampunk':
      bgGrad.addColorStop(0, '#1c1917');
      bgGrad.addColorStop(0.5, '#451a03');
      bgGrad.addColorStop(1, '#292524');
      break;
    case 'roaring_twenties':
      bgGrad.addColorStop(0, '#18181b');
      bgGrad.addColorStop(0.5, '#3f3f46');
      bgGrad.addColorStop(1, '#09090b');
      break;
    case 'imperial_rome':
      bgGrad.addColorStop(0, '#4a044e');
      bgGrad.addColorStop(0.5, '#831843');
      bgGrad.addColorStop(1, '#18181b');
      break;
    case 'edo_japan':
      bgGrad.addColorStop(0, '#064e3b');
      bgGrad.addColorStop(0.5, '#022c22');
      bgGrad.addColorStop(1, '#0f172a');
      break;
    case 'apollo_sixties':
      bgGrad.addColorStop(0, '#020617');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#09090b');
      break;
    case 'synthwave_eighties':
      bgGrad.addColorStop(0, '#581c87');
      bgGrad.addColorStop(0.5, '#be185d');
      bgGrad.addColorStop(1, '#09090b');
      break;
    default:
      bgGrad.addColorStop(0, '#2d1810');
      bgGrad.addColorStop(0.6, '#451a03');
      bgGrad.addColorStop(1, '#0a0a0a');
      break;
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Background architectural elements
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.arc(size / 2, size * 0.42, size * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Draw historical costume shoulders/silhouette
  ctx.save();
  ctx.fillStyle = era.primaryColor;
  ctx.beginPath();
  ctx.moveTo(size * 0.15, size);
  ctx.quadraticCurveTo(size / 2, size * 0.65, size * 0.85, size);
  ctx.lineTo(size * 0.85, size);
  ctx.lineTo(size * 0.15, size);
  ctx.fill();

  // Costume details & embroidery
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Collar V
  ctx.fillStyle = '#ffffff15';
  ctx.beginPath();
  ctx.moveTo(size * 0.38, size * 0.72);
  ctx.lineTo(size / 2, size * 0.82);
  ctx.lineTo(size * 0.62, size * 0.72);
  ctx.fill();
  ctx.restore();

  // 3. Draw User Face with smooth oval vignette feather
  ctx.save();
  ctx.beginPath();
  // Face oval clip
  ctx.ellipse(size / 2, size * 0.45, size * 0.22, size * 0.27, 0, 0, Math.PI * 2);
  ctx.clip();

  // Draw face
  const aspect = faceImg.width / faceImg.height;
  let dw = size * 0.55;
  let dh = dw / aspect;
  if (dh < size * 0.6) {
    dh = size * 0.6;
    dw = dh * aspect;
  }
  const dx = (size - dw) / 2;
  const dy = size * 0.45 - dh / 2;

  ctx.drawImage(faceImg, dx, dy, dw, dh);

  // Soft tint layer to blend face lighting with era ambient color
  ctx.fillStyle = era.primaryColor;
  ctx.globalCompositeOperation = 'color';
  ctx.globalAlpha = 0.22;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();

  // 4. Feathered edge ring around the face to seamlessly blend
  ctx.save();
  const faceRing = ctx.createRadialGradient(
    size / 2,
    size * 0.45,
    size * 0.18,
    size / 2,
    size * 0.45,
    size * 0.27
  );
  faceRing.addColorStop(0, 'rgba(0,0,0,0)');
  faceRing.addColorStop(0.7, 'rgba(0,0,0,0.1)');
  faceRing.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = faceRing;
  ctx.beginPath();
  ctx.ellipse(size / 2, size * 0.45, size * 0.26, size * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. Draw era headwear / adornment
  ctx.save();
  if (era.id === 'imperial_rome') {
    // Golden Laurel Crown
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.32, size * 0.18, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();
  } else if (era.id === 'ancient_egypt') {
    // Golden Uraeus Crown
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(size * 0.36, size * 0.23, size * 0.28, size * 0.04);
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.21, 14, 0, Math.PI * 2);
    ctx.fill();
  } else if (era.id === 'victorian_steampunk') {
    // Brass Monocle
    ctx.strokeStyle = '#b87333';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(size * 0.56, size * 0.43, size * 0.05, 0, Math.PI * 2);
    ctx.stroke();
    // Glass shine
    ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
    ctx.fill();
  }
  ctx.restore();

  // 6. Apply default vintage filter of the era
  const defaultSettings: FilterSettings = {
    filterType: era.defaultFilter,
    sepiaIntensity: 60,
    grain: 30,
    vignette: 45,
    contrast: 10,
    brightness: 0,
    borderStyle: 'cabinet',
    showTimestamp: true,
    dateCaption: `${era.name} • ${era.year}`,
  };

  applyFiltersToCanvas(ctx, size, size, defaultSettings);

  return canvas.toDataURL('image/jpeg', 0.95);
}
