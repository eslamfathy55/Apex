export type GameMode = 'quick' | 'career';

export type WeatherType = 'clear' | 'rain';

export type CameraMode = 0 | 1 | 2; // 0: Chase, 1: Cockpit, 2: Close

export interface CarColor {
  id: string;
  name: string;
  arabicName: string;
  hex: number;
  css: string;
}

export interface TelemetryData {
  speedKmh: number;
  rawSpeed: number;
  maxSpeed: number;
  rpm: number;
  rpmPercent: number;
  position: number;
  totalRacers: number;
  lap: number;
  maxLaps: number;
  drs: boolean;
  careerPoints: number;
  bestSpeed: number;
  lapTimes: number[];
  currentLapTime: number;
}

export interface ControlsState {
  gas: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
}

export const CAR_COLORS: CarColor[] = [
  { id: 'scuderia', name: 'Scuderia Red', arabicName: 'أحمر فيراري', hex: 0xe10600, css: '#e10600' },
  { id: 'stealth', name: 'Stealth Black', arabicName: 'أسود شبحي', hex: 0x181a20, css: '#181a20' },
  { id: 'cyan', name: 'Electric Cyan', arabicName: 'أزرق كهربائي', hex: 0x00d2ff, css: '#00d2ff' },
  { id: 'gold', name: 'Championship Gold', arabicName: 'ذهبي البطولة', hex: 0xffb703, css: '#ffb703' },
  { id: 'purple', name: 'Apex Violet', arabicName: 'بنفسجي أبيكس', hex: 0x8338ec, css: '#8338ec' },
  { id: 'green', name: 'British Racing Green', arabicName: 'أخضر سباقات', hex: 0x06d6a0, css: '#06d6a0' },
  { id: 'silver', name: 'Silver Arrow', arabicName: 'فضي لامع', hex: 0xe0e1dd, css: '#e0e1dd' },
];
