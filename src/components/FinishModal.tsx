import React from 'react';
import { Trophy, Zap, Gauge, RotateCcw, Home } from 'lucide-react';
import { GameMode } from '../types/game';

interface FinishModalProps {
  stats: {
    totalTime: number;
    bestSpeed: number;
    pointsEarned: number;
  };
  gameMode: GameMode;
  careerTotalPoints: number;
  onRaceAgain: () => void;
  onReturnToMenu: () => void;
}

export const FinishModal: React.FC<FinishModalProps> = ({
  stats,
  gameMode,
  careerTotalPoints,
  onRaceAgain,
  onReturnToMenu,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${Number(secs) < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      <div className="w-full max-w-md bg-gradient-to-b from-[#141a26] to-[#0a0d14] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-[0_15px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
        {/* Trophy icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="text-amber-400 font-racing font-bold text-xs tracking-widest uppercase mb-1">
          RACE COMPLETED • انتهاء السباق
        </div>
        <h2 className="font-racing font-black text-3xl sm:text-4xl text-white mb-2">
          VICTORY LAP!
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm mb-6">
          أنهيت الجولات الثلاث بنجاح وتجاوزت خط النهاية!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-right">
          <div className="glass p-3 border border-white/10">
            <div className="text-[10px] text-gray-400">الوقت الإجمالي</div>
            <div className="font-racing text-lg font-bold text-white mt-0.5">
              {formatTime(stats.totalTime)}
            </div>
          </div>

          <div className="glass p-3 border border-white/10">
            <div className="text-[10px] text-gray-400">السرعة القياسية</div>
            <div className="font-racing text-lg font-bold text-cyan-400 mt-0.5 flex items-center gap-1 justify-end">
              <Gauge className="w-3.5 h-3.5" />
              <span>{stats.bestSpeed} KM/H</span>
            </div>
          </div>

          <div className="glass p-3 border border-amber-500/30 bg-amber-500/10 col-span-2 flex items-center justify-between">
            <div className="text-right">
              <div className="text-[11px] text-amber-300/80">
                {gameMode === 'career' ? 'مكافأة المسيرة المهنية' : 'نقاط السباق السريع'}
              </div>
              <div className="text-xs text-gray-400">
                إجمالي رصيدك: <b className="text-white font-racing">{careerTotalPoints} PTS</b>
              </div>
            </div>
            <div className="font-racing text-2xl font-black text-amber-400 flex items-center gap-1">
              <Zap className="w-5 h-5 fill-current" />
              <span>+{stats.pointsEarned}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onRaceAgain}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#e10600] to-red-600 hover:from-red-600 hover:to-[#e10600] text-white font-arabic font-bold text-base shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>خوض سباق جديد</span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="w-full py-2.5 px-4 rounded-xl border border-white/15 hover:bg-white/5 text-gray-300 font-arabic text-sm transition-colors cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>العودة للقائمة الرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
