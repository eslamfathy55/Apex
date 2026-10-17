import React, { useState } from 'react';
import { GameMode, WeatherType, CAR_COLORS } from '../types/game';
import { Trophy, Flag, Sun, CloudRain, Award, Gauge, Sparkles, ExternalLink } from 'lucide-react';

interface MainMenuProps {
  mode: GameMode;
  weather: WeatherType;
  selectedColorHex: number;
  careerPoints: number;
  bestSpeed: number;
  onSelectMode: (mode: GameMode) => void;
  onSelectWeather: (weather: WeatherType) => void;
  onSelectColor: (hex: number) => void;
  onStartRace: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  mode,
  weather,
  selectedColorHex,
  careerPoints,
  bestSpeed,
  onSelectMode,
  onSelectWeather,
  onSelectColor,
  onStartRace,
}) => {
  const [activeTab, setActiveTab] = useState<'race' | 'garage'>('race');

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-gradient-to-br from-[#030509]/95 via-[#070a10]/90 to-[#030509]/95 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#10151f]/95 to-[#090c12]/95 border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl my-auto">
        {/* Eyebrow & Brand */}
        <div className="flex items-center justify-between">
          <div className="text-[#e10600] font-racing font-bold text-xs tracking-[0.25em] direction-ltr">
            A NEW GENERATION OF RACING
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs text-gray-400 font-racing">SIMULATOR 2026</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-racing font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight mt-2 mb-1 direction-ltr text-left">
          TURBO <span className="text-[#e10600]">APEX</span>
          <span className="text-xl sm:text-2xl text-gray-400 block font-normal tracking-widest -mt-1">
            PRO MAX
          </span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-1 mb-5">
          تجربة سباقات ثلاثية الأبعاد واقعية — ابنِ مسيرتك، اختر سيارتك، واضبط الطقس وتنافس مع أمهر السائقين على الحلبة.
        </p>

        {/* Career & Stats Pill Badges */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="glass px-3.5 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400">نقاط المسيرة</div>
              <div className="font-racing text-lg font-bold text-amber-400">{careerPoints} PTS</div>
            </div>
          </div>

          <div className="glass px-3.5 py-2.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400">السرعة القصوى المسجلة</div>
              <div className="font-racing text-lg font-bold text-cyan-400">{bestSpeed} KM/H</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-4 text-xs font-arabic font-bold">
          <button
            onClick={() => setActiveTab('race')}
            className={`pb-2.5 px-4 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'race'
                ? 'border-b-2 border-[#e10600] text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>إعدادات السباق والطقس</span>
          </button>
          <button
            onClick={() => setActiveTab('garage')}
            className={`pb-2.5 px-4 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'garage'
                ? 'border-b-2 border-[#e10600] text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الكراج والطلاء</span>
          </button>
        </div>

        {activeTab === 'race' ? (
          /* Race & Weather Selection Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {/* Quick Race */}
            <button
              type="button"
              onClick={() => onSelectMode('quick')}
              className={`p-3.5 text-right rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                mode === 'quick'
                  ? 'border-[#e10600] bg-[#e10600]/15 ring-1 ring-[#e10600]/40'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  🏁 سباق سريع
                </span>
                <span className="text-[10px] font-racing text-gray-400 border border-white/15 px-2 py-0.5 rounded-full">
                  QUICK RACE
                </span>
              </div>
              <p className="text-xs text-gray-400">ادخل الحلبة فورًا وتنافس على خط النهاية (+25 نقطة)</p>
            </button>

            {/* Career Mode */}
            <button
              type="button"
              onClick={() => onSelectMode('career')}
              className={`p-3.5 text-right rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                mode === 'career'
                  ? 'border-[#e10600] bg-[#e10600]/15 ring-1 ring-[#e10600]/40'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  🏆 المسيرة المهنية
                </span>
                <span className="text-[10px] font-racing text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  CAREER
                </span>
              </div>
              <p className="text-xs text-gray-400">اجمع النقاط واصنع أرقامًا قياسية في البطولة (+100 نقطة)</p>
            </button>

            {/* Clear Weather */}
            <button
              type="button"
              onClick={() => onSelectWeather('clear')}
              className={`p-3.5 text-right rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                weather === 'clear'
                  ? 'border-[#e10600] bg-[#e10600]/15 ring-1 ring-[#e10600]/40'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>طقس صافٍ</span>
                </span>
                <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  324 KM/H
                </span>
              </div>
              <p className="text-xs text-gray-400">سماء صافية، تماسك إطارات أقصى وسرعة قصوى عالية</p>
            </button>

            {/* Rain Weather */}
            <button
              type="button"
              onClick={() => onSelectWeather('rain')}
              className={`p-3.5 text-right rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                weather === 'rain'
                  ? 'border-[#e10600] bg-[#e10600]/15 ring-1 ring-[#e10600]/40'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-blue-400" />
                  <span>حلبة ممطرة</span>
                </span>
                <span className="text-[10px] text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  263 KM/H
                </span>
              </div>
              <p className="text-xs text-gray-400">أرضية مبللة وتماسك منخفض يتطلب مهارة عالية في التوجيه</p>
            </button>
          </div>
        ) : (
          /* Garage / Car Color Livery Selector */
          <div className="mb-6 space-y-3">
            <div className="text-xs text-gray-300 font-bold">اختر لون هيكل سيارة الفورمولا الخاصة بك:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CAR_COLORS.map((c) => {
                const isSelected = selectedColorHex === c.hex;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectColor(c.hex)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#e10600] bg-[#e10600]/20 ring-1 ring-[#e10600]'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-white/30 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: c.css }}
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{c.arabicName}</div>
                      <div className="text-[10px] text-gray-400 font-racing truncate">{c.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Start Race Button */}
        <button
          type="button"
          onClick={onStartRace}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#e10600] to-red-600 hover:from-red-600 hover:to-[#e10600] text-white font-arabic font-black text-lg sm:text-xl shadow-[0_6px_30px_rgba(225,6,0,0.45)] transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>ابدأ السباق الآن</span>
          <span className="font-racing text-xl">←</span>
        </button>

        {/* Footer with Creator Credits and Links */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-racing text-gray-400 gap-2">
          <div>A GAME BY ESLAM FAT7I</div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/eslamfat7i"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>INSTAGRAM</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://wa.me/201043852678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>WHATSAPP</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
