import React from 'react';
import { ControlsState } from '../types/game';

interface TouchControlsProps {
  onControlChange: (key: keyof ControlsState, value: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onControlChange }) => {
  const bindTouch = (key: keyof ControlsState) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      onControlChange(key, true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      onControlChange(key, false);
    },
    onPointerCancel: (e: React.PointerEvent) => {
      e.preventDefault();
      onControlChange(key, false);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      e.preventDefault();
      onControlChange(key, false);
    },
  });

  return (
    <div className="fixed bottom-4 inset-x-4 z-20 flex justify-between items-end pointer-events-none md:hidden">
      {/* Steering Buttons Pad */}
      <div className="flex gap-3 pointer-events-auto">
        <button
          {...bindTouch('left')}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl glass flex items-center justify-center text-2xl font-bold text-white active:bg-white/20 active:scale-90 transition-transform touch-none shadow-lg border border-white/20 select-none"
          aria-label="Steer Left"
        >
          ◀
        </button>
        <button
          {...bindTouch('right')}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl glass flex items-center justify-center text-2xl font-bold text-white active:bg-white/20 active:scale-90 transition-transform touch-none shadow-lg border border-white/20 select-none"
          aria-label="Steer Right"
        >
          ▶
        </button>
      </div>

      {/* Pedals Pad: Brake & Gas */}
      <div className="flex gap-3 pointer-events-auto">
        <button
          {...bindTouch('brake')}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl glass flex items-center justify-center text-xl font-bold text-gray-200 active:bg-amber-600/40 active:scale-90 transition-transform touch-none shadow-lg border border-white/20 select-none"
          aria-label="Brake"
        >
          ▼
        </button>
        <button
          {...bindTouch('gas')}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-t from-[#e10600] to-red-600 flex items-center justify-center text-2xl font-bold text-white active:opacity-80 active:scale-90 transition-transform touch-none shadow-xl border border-red-400/50 select-none"
          aria-label="Gas / Accelerate"
        >
          ▲
        </button>
      </div>
    </div>
  );
};
