import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toFaDigits } from "../lib/jalali";

const STEPS = [
  { label: "دعوت", emoji: "💌" },
  { label: "غذا", emoji: "🍽️" },
  { label: "زمان", emoji: "🗓️" },
  { label: "ثبت", emoji: "💖" },
];

export function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="rounded-[22px] border border-white/12 bg-white/[0.07] px-4 py-3 shadow-[0_8px_30px_rgba(28,5,48,0.35)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-wide text-blush-200/80">
          مسیرِ قرارِ دونفره
        </span>
        <span className="rounded-full bg-blush-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blush-200">
          مرحله {toFaDigits(Math.min(current + 1, 4))} از {toFaDigits(4)}
        </span>
      </div>

      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={step.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={
                    active
                      ? { scale: [1, 1.12, 1] }
                      : done
                        ? { scale: 1 }
                        : { scale: 0.92 }
                  }
                  transition={
                    active
                      ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                      : { type: "spring", stiffness: 300, damping: 20 }
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-colors duration-500 ${
                    done
                      ? "border-transparent bg-gradient-to-br from-blush-500 to-purple-500 text-white shadow-[0_0_16px_rgba(249,77,155,0.5)]"
                      : active
                        ? "border-blush-300/70 bg-blush-500/25 shadow-[0_0_0_5px_rgba(249,77,155,0.18)]"
                        : "border-white/15 bg-white/5 opacity-60"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <span>{step.emoji}</span>}
                </motion.div>
                <span
                  className={`text-[10px] font-semibold transition-colors duration-500 ${
                    active ? "text-blush-100" : done ? "text-blush-300" : "text-blush-100/45"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-1.5 mb-4 h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-l from-blush-400 to-purple-400"
                    initial={{ width: "0%" }}
                    animate={{ width: i < current ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
