/**
 * Video Generator for the Time-Travel Transformation Process
 * Records an animated sequence of the portal time warp and morph using HTML5 Canvas & MediaRecorder.
 */

export interface VideoExportOptions {
  originalImgUrl: string;
  transformedImgUrl: string;
  eraName: string;
  eraYear: string;
  creatorHandle?: string;
  onProgress?: (progress: number) => void;
}

export async function generateTransformationVideo(options: VideoExportOptions): Promise<{ blob: Blob; url: string }> {
  const { originalImgUrl, transformedImgUrl, eraName, eraYear, creatorHandle = '@TimeVoyager', onProgress } = options;

  // Load both images
  const [origImg, transImg] = await Promise.all([
    loadImage(originalImgUrl),
    loadImage(transformedImgUrl),
  ]);

  const canvas = document.createElement('canvas');
  // High viral engagement 9:16 vertical format or 1:1 square
  const width = 720;
  const height = 960;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  // Check supported mime types
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }
  }

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 3_500_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      resolve({ blob, url });
    };

    recorder.onerror = (err) => {
      reject(err);
    };

    recorder.start();

    // Total duration: 4.5 seconds @ 30fps = 135 frames
    const totalFrames = 135;
    let currentFrame = 0;

    const interval = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      if (onProgress) onProgress(Math.min(100, Math.round(progress * 100)));

      // Render frame
      renderVideoFrame(ctx, width, height, currentFrame, totalFrames, origImg, transImg, eraName, eraYear, creatorHandle);

      if (currentFrame >= totalFrames) {
        clearInterval(interval);
        setTimeout(() => {
          recorder.stop();
        }, 150);
      }
    }, 1000 / 30);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for video export: ' + src));
    img.src = src;
  });
}

function renderVideoFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  totalFrames: number,
  origImg: HTMLImageElement,
  transImg: HTMLImageElement,
  eraName: string,
  eraYear: string,
  creatorHandle: string
) {
  const t = frame / totalFrames; // 0 to 1
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, w, h);

  // Background dark grid
  ctx.strokeStyle = '#ffffff08';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Phase 1: 0.0 - 0.3 (Original Photo + HUD Scanner)
  // Phase 2: 0.3 - 0.65 (Quantum Vortex Warp + Glitch + Speeding Timeline)
  // Phase 3: 0.65 - 0.85 (Cross Dissolve + Morph Arrival)
  // Phase 4: 0.85 - 1.0 (Historical Masterpiece + Title Lock)

  const imageAspect = origImg.width / origImg.height;
  const targetW = w * 0.88;
  const targetH = targetW / imageAspect;
  const imgX = (w - targetW) / 2;
  const imgY = h * 0.14;

  if (t < 0.3) {
    // Phase 1: Original portrait with scanline
    ctx.drawImage(origImg, imgX, imgY, targetW, targetH);

    // Laser scan bar
    const scanY = imgY + (targetH * ((t / 0.3) % 1));
    const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
    grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.7)');
    grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(imgX, scanY - 15, targetW, 30);

    // Reticle
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    const corner = 25;
    // Top Left
    ctx.beginPath();
    ctx.moveTo(imgX, imgY + corner);
    ctx.lineTo(imgX, imgY);
    ctx.lineTo(imgX + corner, imgY);
    ctx.stroke();
    // Top Right
    ctx.beginPath();
    ctx.moveTo(imgX + targetW - corner, imgY);
    ctx.lineTo(imgX + targetW, imgY);
    ctx.lineTo(imgX + targetW, imgY + corner);
    ctx.stroke();
    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(imgX, imgY + targetH - corner);
    ctx.lineTo(imgX, imgY + targetH);
    ctx.lineTo(imgX + corner, imgY + targetH);
    ctx.stroke();
    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(imgX + targetW - corner, imgY + targetH);
    ctx.lineTo(imgX + targetW, imgY + targetH);
    ctx.lineTo(imgX + targetW, imgY + targetH - corner);
    ctx.stroke();

    // HUD Text
    ctx.fillStyle = '#06b6d4';
    ctx.font = "bold 16px monospace";
    ctx.fillText("TEMPORAL DISPLACEMENT PROTOCOL ACTIVE", imgX + 10, imgY + targetH + 35);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px monospace";
    ctx.fillText(`TARGET ERA: ${eraName.toUpperCase()}`, imgX + 10, imgY + targetH + 60);

  } else if (t < 0.65) {
    // Phase 2: Quantum Vortex & Warp
    const warpProgress = (t - 0.3) / 0.35; // 0 to 1

    // Morph interpolation
    const alphaTrans = warpProgress;
    ctx.save();
    // Slight zoom
    const zoom = 1 + warpProgress * 0.08;
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-w / 2, -h / 2);

    ctx.globalAlpha = 1 - alphaTrans;
    ctx.drawImage(origImg, imgX, imgY, targetW, targetH);
    ctx.globalAlpha = alphaTrans;
    ctx.drawImage(transImg, imgX, imgY, targetW, targetH);
    ctx.restore();

    // Draw glowing portal vortex rings
    ctx.save();
    const cx = w / 2;
    const cy = imgY + targetH / 2;
    for (let r = 0; r < 5; r++) {
      const radius = ((warpProgress * 250) + r * 60) % 300;
      ctx.strokeStyle = `hsla(${(r * 60 + frame * 8) % 360}, 90%, 65%, ${0.7 - (radius / 300) * 0.7})`;
      ctx.lineWidth = 4 + r * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Temporal year counter spinning
    const simulatedYear = Math.round(2026 - (2026 - parseInt(eraYear, 10) || 500) * warpProgress);
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.font = "900 36px 'Cinzel', serif";
    ctx.textAlign = 'center';
    ctx.fillText(`WARPING: ${simulatedYear} CE`, w / 2, imgY + targetH + 50);
    ctx.shadowBlur = 0;

  } else {
    // Phase 3 & 4: Transformed portrait + Masterpiece Era plaque
    const arriveProgress = Math.min(1, (t - 0.65) / 0.35);
    ctx.save();
    // Smooth slow push-in
    const zoom = 1.05 - (1 - arriveProgress) * 0.05;
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-w / 2, -h / 2);
    ctx.drawImage(transImg, imgX, imgY, targetW, targetH);
    ctx.restore();

    // Golden frame border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(imgX - 2, imgY - 2, targetW + 4, targetH + 4);

    // Title Plaque card
    const plaqueY = imgY + targetH + 20;
    const plaqueH = 100;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.fillRect(imgX, plaqueY, targetW, plaqueH);
    ctx.strokeRect(imgX, plaqueY, targetW, plaqueH);

    // Era Title
    ctx.fillStyle = '#ffd700';
    ctx.font = "700 24px 'Cinzel', serif";
    ctx.textAlign = 'center';
    ctx.fillText(eraName, w / 2, plaqueY + 40);

    // Era Year & Subtitle
    ctx.fillStyle = '#cbd5e1';
    ctx.font = "500 16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`${eraYear} • Chronos Time-Travel Portrait`, w / 2, plaqueY + 68);

    // Creator watermark
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px monospace";
    ctx.fillText(`Created by ${creatorHandle} on ChronosSnap`, w / 2, plaqueY + 90);
  }

  // Top header branding
  ctx.fillStyle = '#ffffff';
  ctx.font = "bold 18px 'Cinzel', serif";
  ctx.textAlign = 'left';
  ctx.fillText("CHRONOS-SNAP // TIME BOOTH", w * 0.06, 50);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#06b6d4';
  ctx.font = "12px monospace";
  ctx.fillText(`TIME ENGINE v2.4 • ${Math.round(t * 100)}%`, w * 0.94, 50);
}
