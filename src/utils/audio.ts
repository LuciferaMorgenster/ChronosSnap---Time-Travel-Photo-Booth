/**
 * Synthesizes audio effects using browser Web Audio API (100% client-side & offline friendly).
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Camera shutter sound effect
 */
export function playCameraShutterSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Click 1
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(800, now);
  osc1.frequency.exponentialRampToValueAtTime(120, now + 0.05);

  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.05);

  // Click 2 (shutter release)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(600, now + 0.07);
  osc2.frequency.exponentialRampToValueAtTime(80, now + 0.14);

  gain2.gain.setValueAtTime(0.25, now + 0.07);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.07);
  osc2.stop(now + 0.14);
}

/**
 * Quantum time travel portal sound effect
 */
export function playTimeWarpSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(850, now + 0.8);
  osc.frequency.exponentialRampToValueAtTime(220, now + 1.4);

  gain.gain.setValueAtTime(0.05, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.6);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.4);
}
