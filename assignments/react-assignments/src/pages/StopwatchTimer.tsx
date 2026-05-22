import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  Flag,
  Timer,
  Clock,
  Volume2,
} from "lucide-react";

const formatStopwatch = (timeMs: number) => {
  const mins = Math.floor(timeMs / 60000);
  const secs = Math.floor((timeMs % 60000) / 1000);
  const centis = Math.floor((timeMs % 1000) / 10);

  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    mins: pad(mins),
    secs: pad(secs),
    centis: pad(centis),
  };
};

const formatTimer = (totalSeconds: number) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

export default function StopwatchTimer() {
  const [activeTab, setActiveTab] = useState<"stopwatch" | "timer">(
    "stopwatch",
  );

  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<number | null>(null);
  const swStartTimeRef = useRef<number>(0);
  const swPreviousElapsedRef = useRef<number>(0);

  const [timerDuration, setTimerDuration] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  const [inputHrs, setInputHrs] = useState("0");
  const [inputMins, setInputMins] = useState("5");
  const [inputSecs, setInputSecs] = useState("0");

  const [isTimerSetup, setIsTimerSetup] = useState(true);
  const [timerComplete, setTimerComplete] = useState(false);

  const playAlarmSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();

      const playBeep = (delay: number, duration: number, frequency: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(
          0.3,
          audioCtx.currentTime + delay + 0.05,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + delay + duration,
        );

        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };

      playBeep(0, 0.3, 880);
      playBeep(0.4, 0.3, 880);
      playBeep(0.8, 0.5, 1100);
    } catch (e) {
      console.warn(
        "Web Audio API not supported or blocked by user browser settings",
        e,
      );
    }
  };

  const startStopwatch = () => {
    if (swRunning) return;
    setSwRunning(true);
    swStartTimeRef.current = Date.now();
    swIntervalRef.current = window.setInterval(() => {
      const elapsed =
        Date.now() - swStartTimeRef.current + swPreviousElapsedRef.current;
      setSwTime(elapsed);
    }, 10);
  };

  const pauseStopwatch = () => {
    if (!swRunning) return;
    setSwRunning(false);
    swPreviousElapsedRef.current = swTime;
    if (swIntervalRef.current) {
      clearInterval(swIntervalRef.current);
      swIntervalRef.current = null;
    }
  };

  const resetStopwatch = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
    swPreviousElapsedRef.current = 0;
    if (swIntervalRef.current) {
      clearInterval(swIntervalRef.current);
      swIntervalRef.current = null;
    }
  };

  const recordLap = () => {
    if (!swRunning) return;
    setLaps([swTime, ...laps]);
  };

  const startTimer = () => {
    if (timerRunning) return;
    setTimerRunning(true);
    setTimerComplete(false);

    if (isTimerSetup) {
      const h = parseInt(inputHrs) || 0;
      const m = parseInt(inputMins) || 0;
      const s = parseInt(inputSecs) || 0;
      const totalSec = h * 3600 + m * 60 + s;

      if (totalSec <= 0) {
        setTimerRunning(false);
        return;
      }

      setTimerDuration(totalSec);
      setTimerRemaining(totalSec);
      setIsTimerSetup(false);
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setTimerComplete(true);
          playAlarmSound();
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (!timerRunning) return;
    setTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setIsTimerSetup(true);
    setTimerComplete(false);
    setTimerRemaining(0);
    setTimerDuration(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const swParts = formatStopwatch(swTime);

  const progressPercent =
    timerDuration > 0 ? (timerRemaining / timerDuration) * 100 : 0;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <nav className="w-full max-w-2xl mb-8 flex justify-start">
        <Link
          to="/"
          className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all duration-200"
        >
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-8 text-center">
        <h1 className="text-4xl font-semibold text-[#2d2d2d] flex items-center justify-center gap-2">
          {activeTab === "stopwatch" ? (
            <Clock className="w-8 h-8" />
          ) : (
            <Timer className="w-8 h-8" />
          )}
          Stopwatch & Timer
        </h1>
        <p className="text-[#6b6b6b] mt-1">
          Keep track of your time with style
        </p>
      </header>

      <div className="flex border-2 border-[#2d2d2d] rounded-xl overflow-hidden bg-[#faf8f5] mb-8 p-1.5 gap-1.5 shadow-[4px_4px_0_#2d2d2d] max-w-sm w-full">
        <button
          onClick={() => setActiveTab("stopwatch")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "stopwatch"
              ? "bg-[#2d2d2d] text-[#faf8f5]"
              : "text-[#2d2d2d] hover:bg-[#e8d5c4]/50"
          }`}
        >
          <Clock className="w-4 h-4" />
          Stopwatch
        </button>
        <button
          onClick={() => setActiveTab("timer")}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "timer"
              ? "bg-[#2d2d2d] text-[#faf8f5]"
              : "text-[#2d2d2d] hover:bg-[#e8d5c4]/50"
          }`}
        >
          <Timer className="w-4 h-4" />
          Timer
        </button>
      </div>

      <div className="w-full max-w-xl bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-2xl p-8 hover:shadow-[8px_8px_0_#2d2d2d] shadow-[6px_6px_0_#2d2d2d] transition-all duration-300">
        {activeTab === "stopwatch" ? (
          <div className="flex flex-col items-center">
            <div className="font-mono text-6xl sm:text-7xl font-bold text-[#2d2d2d] py-10 tracking-tight flex items-baseline">
              <span>{swParts.mins}</span>
              <span className="text-[#6b6b6b] animate-pulse">:</span>
              <span>{swParts.secs}</span>
              <span className="text-3xl sm:text-4xl text-[#6b6b6b] ml-1 font-semibold">
                .{swParts.centis}
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full mb-8">
              {!swRunning ? (
                <button
                  onClick={startStopwatch}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2d2d2d] text-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl font-semibold hover:bg-[#1a1a1a] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#2d2d2d] active:translate-y-0 active:shadow-none transition-all duration-200 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start
                </button>
              ) : (
                <button
                  onClick={pauseStopwatch}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#e8d5c4] text-[#2d2d2d] border-2 border-[#2d2d2d] rounded-xl font-semibold hover:bg-[#d4beaa] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#2d2d2d] active:translate-y-0 active:shadow-none transition-all duration-200 cursor-pointer"
                >
                  <Pause className="w-5 h-5 fill-current" />
                  Pause
                </button>
              )}

              <button
                onClick={recordLap}
                disabled={!swRunning}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#2d2d2d] rounded-xl font-semibold hover:bg-[#2d2d2d] hover:text-[#faf8f5] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#2d2d2d] active:translate-y-0 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-transparent disabled:hover:text-[#2d2d2d] transition-all duration-200 cursor-pointer"
              >
                <Flag className="w-5 h-5" />
                Lap
              </button>

              <button
                onClick={resetStopwatch}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-500 hover:text-[#faf8f5] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#ef4444] active:translate-y-0 active:shadow-none transition-all duration-200 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

            {laps.length > 0 && (
              <div className="w-full border-2 border-[#2d2d2d] rounded-xl overflow-hidden bg-[#faf8f5] max-h-60 overflow-y-auto">
                <div className="bg-[#e8d5c4] px-4 py-2 border-b-2 border-[#2d2d2d] font-bold text-sm text-[#2d2d2d] flex justify-between">
                  <span>LAP</span>
                  <span>LAP TIME</span>
                </div>
                <div className="divide-y divide-[#2d2d2d]/20">
                  {laps.map((lapTime, index) => {
                    const parts = formatStopwatch(lapTime);
                    const displayIndex = laps.length - index;
                    return (
                      <div
                        key={index}
                        className="px-4 py-3 flex justify-between font-mono text-sm text-[#2d2d2d]"
                      >
                        <span className="font-semibold text-[#6b6b6b]">
                          #{String(displayIndex).padStart(2, "0")}
                        </span>
                        <span>
                          {parts.mins}:{parts.secs}.{parts.centis}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {isTimerSetup ? (
              <div className="w-full flex flex-col items-center">
                <p className="text-sm font-semibold text-[#2d2d2d] mb-4 uppercase tracking-wider">
                  Set Custom Duration
                </p>
                <div className="flex gap-4 mb-8">
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-[#6b6b6b] mb-1 font-semibold uppercase">
                      Hrs
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={inputHrs}
                      onChange={(e) => setInputHrs(e.target.value)}
                      className="w-16 h-16 border-2 border-[#2d2d2d] rounded-xl text-center text-2xl font-bold font-mono bg-[#faf8f5] text-[#2d2d2d] shadow-[3px_3px_0_#2d2d2d] focus:outline-none focus:translate-y-[2px] focus:shadow-[1px_1px_0_#2d2d2d] transition-all"
                    />
                  </div>
                  <span className="text-3xl font-bold text-[#2d2d2d] self-end mb-3">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-[#6b6b6b] mb-1 font-semibold uppercase">
                      Min
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={inputMins}
                      onChange={(e) => setInputMins(e.target.value)}
                      className="w-16 h-16 border-2 border-[#2d2d2d] rounded-xl text-center text-2xl font-bold font-mono bg-[#faf8f5] text-[#2d2d2d] shadow-[3px_3px_0_#2d2d2d] focus:outline-none focus:translate-y-[2px] focus:shadow-[1px_1px_0_#2d2d2d] transition-all"
                    />
                  </div>
                  <span className="text-3xl font-bold text-[#2d2d2d] self-end mb-3">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-[#6b6b6b] mb-1 font-semibold uppercase">
                      Sec
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={inputSecs}
                      onChange={(e) => setInputSecs(e.target.value)}
                      className="w-16 h-16 border-2 border-[#2d2d2d] rounded-xl text-center text-2xl font-bold font-mono bg-[#faf8f5] text-[#2d2d2d] shadow-[3px_3px_0_#2d2d2d] focus:outline-none focus:translate-y-[2px] focus:shadow-[1px_1px_0_#2d2d2d] transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={startTimer}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2d2d2d] text-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl font-semibold hover:bg-[#1a1a1a] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#2d2d2d] active:translate-y-0 active:shadow-none transition-all duration-200 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Timer
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#e8d5c4"
                      strokeWidth="6"
                      className="stroke-[#e8d5c4]"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="#2d2d2d"
                      strokeWidth="6"
                      strokeDasharray="283"
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span
                      className={`font-mono text-4xl font-bold ${timerComplete ? "text-red-500 animate-bounce" : "text-[#2d2d2d]"}`}
                    >
                      {formatTimer(timerRemaining)}
                    </span>
                    {timerComplete && (
                      <span className="text-xs text-red-500 font-bold tracking-wider mt-1 uppercase flex items-center gap-1">
                        <Volume2 className="w-4 h-4 animate-pulse" /> Time's Up!
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  {!timerRunning && !timerComplete ? (
                    <button
                      onClick={startTimer}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2d2d2d] text-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl font-semibold hover:bg-[#1a1a1a] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#2d2d2d] active:translate-y-0 active:shadow-none transition-all duration-200 cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Resume
                    </button>
                  ) : !timerComplete ? (
                    <button
                      onClick={pauseTimer}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#e8d5c4] text-[#2d2d2d] border-2 border-[#2d2d2d] rounded-xl font-semibold hover:bg-[#d4beaa] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#2d2d2d] active:translate-y-0 active:shadow-none transition-all duration-200 cursor-pointer"
                    >
                      <Pause className="w-5 h-5 fill-current" />
                      Pause
                    </button>
                  ) : null}

                  <button
                    onClick={resetTimer}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-500 hover:text-[#faf8f5] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#ef4444] active:translate-y-0 active:shadow-none transition-all duration-200 cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
