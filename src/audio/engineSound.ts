// Web Audio API engine sound generator for Formula 1 simulator
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isRunning: boolean = false;

  // Nodes
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private turboGain: GainNode | null = null;
  private turboOsc: OscillatorNode | null = null;
  private noiseGain: GainNode | null = null;

  constructor() {
    // Lazy init on first user interaction
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Low pass filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // Main engine osc 1 (Sawtooth)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(65, this.ctx.currentTime);
      this.osc1.connect(this.filter);

      // Engine sub osc 2 (Triangle for body)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(32.5, this.ctx.currentTime);
      this.osc2.connect(this.filter);

      // Turbo / DRS whistle
      this.turboOsc = this.ctx.createOscillator();
      this.turboOsc.type = 'sine';
      this.turboOsc.frequency.setValueAtTime(800, this.ctx.currentTime);
      this.turboGain = this.ctx.createGain();
      this.turboGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.turboOsc.connect(this.turboGain);
      this.turboGain.connect(this.masterGain);

      // Tyre friction noise buffer
      const bufferSize = this.ctx.sampleRate * 1;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);
      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      this.osc1.start();
      this.osc2.start();
      this.turboOsc.start();
      whiteNoise.start();

      this.isRunning = true;
    } catch {
      // AudioContext may be restricted until interaction
    }
  }

  public update(speed: number, maxSpeed: number, isBraking: boolean, drs: boolean) {
    if (!this.ctx || !this.isRunning || this.isMuted) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const ratio = Math.max(0, Math.min(1, speed / maxSpeed));

    // Base engine freq: idle 55Hz up to 340Hz at redline
    const baseFreq = 55 + ratio * 280 + (drs ? 35 : 0);
    this.osc1?.frequency.setTargetAtTime(baseFreq, t, 0.05);
    this.osc2?.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.05);

    // Filter opens up as revs increase
    const filterFreq = 900 + ratio * 2800;
    this.filter?.frequency.setTargetAtTime(filterFreq, t, 0.05);

    // Turbo whistle on DRS or high speed
    if (this.turboGain && this.turboOsc) {
      const turboTargetVol = drs ? 0.08 : (ratio > 0.75 ? (ratio - 0.75) * 0.12 : 0);
      const turboFreq = 900 + ratio * 1400 + (drs ? 600 : 0);
      this.turboGain.gain.setTargetAtTime(turboTargetVol, t, 0.06);
      this.turboOsc.frequency.setTargetAtTime(turboFreq, t, 0.06);
    }

    // Brake screech if braking hard at speed
    if (this.noiseGain) {
      const screech = (isBraking && speed > 25) ? 0.06 * (speed / maxSpeed) : 0;
      this.noiseGain.gain.setTargetAtTime(screech, t, 0.04);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
  }

  public resume() {
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0.18, this.ctx.currentTime, 0.05);
    }
  }
}

export const soundEngine = new SoundEngine();
