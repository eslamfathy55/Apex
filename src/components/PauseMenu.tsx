import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onQuit,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-sm glass border border-white/20 rounded-2xl p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="text-[#e10600] font-racing font-bold text-xs tracking-widest uppercase mb-1">
          PAUSED • إيقاف مؤقت
        </div>
        <h2 className="font-racing text-2xl font-bold text-white mb-6">
          TURBO APEX
        </h2>

        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-[#e10600] hover:bg-red-600 text-white font-arabic font-bold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>استئناف السباق</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl glass hover:bg-white/10 text-white font-arabic font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة تشغيل السباق</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-2.5 px-4 rounded-xl glass hover:bg-white/10 text-gray-300 font-arabic text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}</span>
          </button>

          <button
            onClick={onQuit}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 font-arabic text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>العودة للقائمة الرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
