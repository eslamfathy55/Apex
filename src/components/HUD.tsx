import React from 'react';
import { TelemetryData, GameMode, CameraMode } from '../types/game';
import { Camera, Volume2, VolumeX, Pause, LogOut, Zap } from 'lucide-react';

interface HUDProps {
  telemetry: TelemetryData;
  gameMode: GameMode;
  cameraMode: CameraMode;
  isMuted: boolean;
  onSwitchCamera: () => void;
  onToggleDRS: () => void;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onExitRace: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  telemetry,
  gameMode,
  cameraMode,
  isMuted,
  onSwitchCamera,
  onToggleDRS,
  onToggleMute,
  onTogglePause,
  onExitRace,
}) => {
  const cameraLabels = ['📷 مطاردة (CHASE)', '📷 قمرة القيادة (COCKPIT)', '📷 حركة قريبة (ACTION)'];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-5">
      {/* Top Header Row */}
      <div className="flex items-start justify-between w-full">
        {/* Brand Glass Badge */}
        <div className="glass px-3.5 py-2.5 sm:px-4 sm:py-3 direction-ltr text-left pointer-events-auto shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e10600] animate-pulse"></span>
            <strong className="font-racing text-lg sm:text-xl font-bold tracking-wider text-white">
              TURBO APEX
            </strong>
          </div>
          <span className="block text-[10px] sm:text-[11px] text-gray-400 font-racing tracking-widest mt-0.5">
            PRO MAX • RACING SIM
          </span>
        </div>

        {/* Telemetry Dashboard Glass Panel */}
        <div className="glass px-3.5 py-2.5 sm:px-4 sm:py-3 min-w-[170px] sm:min-w-[210px] text-right pointer-events-auto">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-racing text-[10px] sm:text-xs text-[#e10600] font-bold">
              {gameMode === 'career' ? 'CAREER MODE' : 'QUICK RACE'}
            </span>
            <span className="font-racing font-semibold text-white">
              LAP {telemetry.lap}/{telemetry.maxLaps}
            </span>
          </div>

          {/* Speedometer */}
          <div className="font-racing text-3xl sm:text-5xl font-black text-white leading-none tracking-tight flex items-baseline justify-end gap-1.5 my-1">
            <span>{String(telemetry.speedKmh).padStart(3, '0')}</span>
            <span className="text-xs sm:text-sm text-gray-400 font-medium font-racing">KM/H</span>
          </div>

          {/* RPM Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-racing text-gray-300">
              <span className="text-gray-400">RPM</span>
              <span className="font-bold">{telemetry.rpm}</span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-[#e10600] transition-all duration-75"
                style={{ width: `${telemetry.rpmPercent}%` }}
              />
            </div>
          </div>

          {/* Position & DRS indicator */}
          <div className="flex justify-between items-center text-[11px] sm:text-xs mt-2 pt-1 border-t border-white/10 font-racing">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">POS</span>
              <strong className="text-[#00d2ff] font-bold">
                P {String(telemetry.position).padStart(2, '0')} / {String(telemetry.totalRacers).padStart(2, '0')}
              </strong>
            </div>

            <div className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
              telemetry.drs ? 'bg-[#e10600] text-white animate-pulse' : 'bg-white/10 text-gray-400'
            }`}>
              DRS {telemetry.drs ? 'ACTIVE' : 'READY'}
            </div>
          </div>
        </div>
      </div>

      {/* Center Lap Alert if last lap */}
      {telemetry.lap === 3 && (
        <div className="self-center glass px-4 py-1.5 border border-[#e10600]/40 text-[#e10600] font-racing font-bold text-xs sm:text-sm tracking-widest uppercase animate-bounce">
          ⚡ FINAL LAP • الجولة الأخيرة
        </div>
      )}

      {/* Bottom Bar: Hints & Controls */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 w-full pb-16 sm:pb-0">
        {/* Controls Hint */}
        <div className="glass px-3 py-1.5 text-[11px] sm:text-xs text-gray-300 shadow max-w-md hidden md:block">
          <span>W/↑ تسارع · S/↓ فرامل · A/D توجيه · C تبديل الكاميرا · Space DRS</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-center sm:justify-end">
          <button
            onClick={onSwitchCamera}
            className="glass px-3 py-1.5 text-xs font-arabic font-bold text-white hover:border-[#e10600] transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="تبديل زاوية الكاميرا (C)"
          >
            <Camera className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">{cameraLabels[cameraMode]}</span>
            <span className="sm:hidden">كاميرا</span>
          </button>

          <button
            onClick={onToggleDRS}
            className={`glass px-3 py-1.5 text-xs font-racing font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              telemetry.drs ? 'border-[#e10600] bg-[#e10600]/30 text-white' : 'text-gray-300 hover:text-white'
            }`}
            title="نظام تقليل السحب DRS (Space)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>DRS {telemetry.drs ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="glass px-2.5 py-1.5 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer active:scale-95"
            title="كتم / تشغيل الصوت"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onTogglePause}
            className="glass px-3 py-1.5 text-xs font-arabic font-bold text-gray-200 hover:text-white hover:border-white/30 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>إيقاف مؤقت</span>
          </button>

          <button
            onClick={onExitRace}
            className="glass px-3 py-1.5 text-xs font-arabic font-bold text-gray-300 hover:text-[#e10600] hover:border-[#e10600]/40 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>القائمة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
