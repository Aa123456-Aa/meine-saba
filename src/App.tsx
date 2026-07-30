import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Background } from "./components/Background";
import { ProgressSteps } from "./components/ProgressSteps";
import { AskStep } from "./steps/AskStep";
import { FoodStep } from "./steps/FoodStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { FinalStep } from "./steps/FinalStep";
import type { Food } from "./lib/data";
import type { JalaliDate } from "./lib/jalali";

export default function App() {
  const [step, setStep] = useState(0);
  const [food, setFood] = useState<Food | null>(null);
  const [date, setDate] = useState<JalaliDate | null>(null);
  const [time, setTime] = useState({ h: 19, m: 0 });

  const restart = () => {
    setStep(0);
    setFood(null);
    setDate(null);
    setTime({ h: 19, m: 0 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <Background />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-6 pt-5 sm:pt-8">
        <header className="mb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="animate-heart-beat text-xl">💌</span>
              <h1 className="font-display text-lg tracking-wide text-blush-50">
                دعوت‌نامه‌ی <span className="text-blush-300">دیت</span>
              </h1>
            </div>
            <span className="rounded-full border border-blush-300/30 bg-blush-500/15 px-3 py-1 text-[11px] font-bold text-blush-200">
              مخاطبِ ویژه: صبا ❤️
            </span>
          </div>
          <ProgressSteps current={step} />
        </header>

        <main className="flex flex-1 flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            {step === 0 && <AskStep key="ask" onNext={() => setStep(1)} />}

            {step === 1 && (
              <FoodStep key="food" selected={food} onSelect={setFood} onNext={() => setStep(2)} />
            )}

            {step === 2 && (
              <DateTimeStep
                key="datetime"
                date={date}
                time={time}
                onDate={setDate}
                onTime={setTime}
                onSubmit={() => setStep(3)}
              />
            )}

            {step === 3 && food && date && (
              <FinalStep key="final" food={food} choice={{ date, time }} onRestart={restart} />
            )}
          </AnimatePresence>
        </main>

        <footer className="pt-2 text-center text-[11px] font-medium text-blush-100/45">
          ساخته‌شده با <motion.span className="inline-block" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>❤️</motion.span>{" "}
          فقط برای صبا — از طرف آرین
        </footer>
      </div>
    </div>
  );
}
