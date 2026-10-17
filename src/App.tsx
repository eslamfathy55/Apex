import React, { useState, useEffect, useCallback } from 'react';
import { RacingCanvas } from './components/RacingCanvas';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { PauseMenu } from './components/PauseMenu';
import { FinishModal } from './components/FinishModal';
import { TouchControls } from './components/TouchControls';
import { GameMode, WeatherType, CameraMode, TelemetryData, ControlsState } from './types/game';
import { soundEngine } from './audio/engineSound';

export function App() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<GameMode>('quick');
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [carColor, setCarColor] = useState<number>(0xe10600);
  const [cameraMode, setCameraMode] = useState<CameraMode>(0);
  const [drs, setDrs] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [careerPoints, setCareerPoints] = useState<number>(() => {
    return +(localStorage.getItem('tapm-points') || 0);
  });
  const [bestSpeed, setBestSpeed] = useState<number>(() => {
    return +(localStorage.getItem('tapm-best') || 0);
  });

  const [controls, setControls] = useState<ControlsState>({
    gas: false,
    brake: false,
    left: false,
    right: false,
  });

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    speedKmh: 0,
    rawSpeed: 0,
    maxSpeed: 90,
    rpm: 1200,
    rpmPercent: 0,
    position: 8,
    totalRacers: 8,
    lap: 1,
    maxLaps: 3,
    drs: false,
    careerPoints: 0,
    bestSpeed: 0,
    lapTimes: [],
    currentLapTime: 0,
  });

  const [finishStats, setFinishStats] = useState<{
    totalTime: number;
    bestSpeed: number;
    pointsEarned: number;
  } | null>(null);

  // Initialize sound engine on first user interaction
  const ensureSound = useCallback(() => {
    soundEngine.init();
  }, []);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      ensureSound();

      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        setControls((prev) => ({ ...prev, gas: true }));
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        setControls((prev) => ({ ...prev, brake: true }));
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setControls((prev) => ({ ...prev, left: true }));
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setControls((prev) => ({ ...prev, right: true }));
      } else if (e.code === 'Space') {
        e.preventDefault();
        setDrs((prev) => !prev);
      } else if (e.code === 'KeyC') {
        setCameraMode((prev) => ((prev + 1) % 3) as CameraMode);
      } else if (e.code === 'Escape') {
        if (isRunning && !finishStats) {
          setIsPaused((prev) => !prev);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        setControls((prev) => ({ ...prev, gas: false }));
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        setControls((prev) => ({ ...prev, brake: false }));
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setControls((prev) => ({ ...prev, left: false }));
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setControls((prev) => ({ ...prev, right: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRunning, finishStats, ensureSound]);

  const handleStartRace = () => {
    ensureSound();
    soundEngine.resume();
    setDrs(false);
    setIsPaused(false);
    setFinishStats(null);
    setControls({ gas: false, brake: false, left: false, right: false });
    setIsRunning(true);
  };

  const handleSwitchCamera = () => {
    setCameraMode((prev) => ((prev + 1) % 3) as CameraMode);
  };

  const handleToggleDRS = () => {
    setDrs((prev) => !prev);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) soundEngine.stop();
      else soundEngine.resume();
      return next;
    });
  };

  const handleRestartRace = () => {
    setIsPaused(false);
    setFinishStats(null);
    setDrs(false);
    setControls({ gas: false, brake: false, left: false, right: false });
    // Force re-trigger race canvas
    setIsRunning(false);
    setTimeout(() => {
      setIsRunning(true);
      soundEngine.resume();
    }, 50);
  };

  const handleExitRace = () => {
    soundEngine.stop();
    setIsRunning(false);
    setIsPaused(false);
    setFinishStats(null);
    setControls({ gas: false, brake: false, left: false, right: false });
  };

  const handleFinishRace = (stats: {
    totalTime: number;
    bestSpeed: number;
    pointsEarned: number;
  }) => {
    soundEngine.stop();
    setFinishStats(stats);
    setCareerPoints((prev) => prev + stats.pointsEarned);
    if (stats.bestSpeed > bestSpeed) {
      setBestSpeed(stats.bestSpeed);
    }
  };

  const handleTouchControlChange = (key: keyof ControlsState, value: boolean) => {
    ensureSound();
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05070b]">
      {/* 3D Scene */}
      <RacingCanvas
        isRunning={isRunning}
        isPaused={isPaused}
        gameMode={gameMode}
        weather={weather}
        carColor={carColor}
        cameraMode={cameraMode}
        drs={drs}
        controls={controls}
        onUpdateTelemetry={setTelemetry}
        onFinishRace={handleFinishRace}
      />

      {/* In-Game HUD */}
      {isRunning && !finishStats && (
        <>
          <HUD
            telemetry={telemetry}
            gameMode={gameMode}
            cameraMode={cameraMode}
            isMuted={isMuted}
            onSwitchCamera={handleSwitchCamera}
            onToggleDRS={handleToggleDRS}
            onToggleMute={handleToggleMute}
            onTogglePause={handleTogglePause}
            onExitRace={handleExitRace}
          />

          {/* Touch Pad Controls for Mobile/Tablets */}
          <TouchControls onControlChange={handleTouchControlChange} />
        </>
      )}

      {/* Main Menu Overlay */}
      {!isRunning && !finishStats && (
        <MainMenu
          mode={gameMode}
          weather={weather}
          selectedColorHex={carColor}
          careerPoints={careerPoints}
          bestSpeed={bestSpeed}
          onSelectMode={setGameMode}
          onSelectWeather={setWeather}
          onSelectColor={setCarColor}
          onStartRace={handleStartRace}
        />
      )}

      {/* Pause Menu Modal */}
      {isRunning && isPaused && (
        <PauseMenu
          onResume={handleTogglePause}
          onRestart={handleRestartRace}
          onQuit={handleExitRace}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Finish Victory Modal */}
      {finishStats && (
        <FinishModal
          stats={finishStats}
          gameMode={gameMode}
          careerTotalPoints={careerPoints}
          onRaceAgain={handleRestartRace}
          onReturnToMenu={handleExitRace}
        />
      )}
    </div>
  );
}

export default App;
