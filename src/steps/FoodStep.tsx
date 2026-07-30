import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { FOODS, type Food } from "../lib/data";

const spring = { type: "spring", stiffness: 280, damping: 22 } as const;

export function FoodStep({
  selected,
  onSelect,
  onNext,
}: {
  selected: Food | null;
  onSelect: (food: Food) => void;
  onNext: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -36, scale: 0.97 }}
      transition={{ ...spring, damping: 24 }}
      className="rounded-[30px] border border-white/15 bg-white/[0.08] p-6 shadow-[0_24px_60px_rgba(28,5,48,0.5)] backdrop-blur-2xl sm:p-8"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="inline-flex items-center gap-1.5 rounded-full bg-blush-500/20 px-3 py-1 text-[12px] font-bold text-blush-200"
      >
        <Sparkles className="h-3.5 w-3.5" /> مرحله‌ی دوم: منوی دیت
      </motion.span>

      <div className="mt-3 overflow-hidden">
        <motion.h2
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, ...spring }}
          className="font-display text-[1.65rem] leading-[1.4] text-blush-50 sm:text-[2.1rem]"
        >
          خب <span className="bg-gradient-to-l from-blush-200 to-blush-400 bg-clip-text text-transparent">صبا جان</span>
          ، برای دیت چی دوست داری بخوریم؟ 😋❤️
        </motion.h2>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-2 text-sm leading-6 text-blush-100/80"
      >
        هرچی تو بخوای همون میشه؛ انتخاب با تو، حسابش با آرین 😌
      </motion.p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
        {FOODS.map((food, i) => {
          const isSelected = selected?.id === food.id;
          return (
            <motion.button
              key={food.id}
              type="button"
              initial={{ opacity: 0, y: 26, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.22 + i * 0.08, ...spring }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(food)}
              aria-pressed={isSelected}
              className={`group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-[22px] border p-4 text-center transition-colors duration-300 sm:p-5 ${
                isSelected
                  ? "border-blush-300/80 bg-gradient-to-b from-blush-500/30 to-fuchsia-600/20 shadow-[0_12px_36px_rgba(249,77,155,0.35)]"
                  : "border-white/12 bg-white/[0.06] hover:border-blush-300/40 hover:bg-white/[0.11]"
              }`}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={spring}
                    className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-fuchsia-600 text-white shadow-lg"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.span
                animate={isSelected ? { scale: [1, 1.25, 1], rotate: [0, -10, 8, 0] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-[2.6rem] leading-none drop-shadow-[0_6px_16px_rgba(249,77,155,0.35)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:text-5xl"
              >
                {food.emoji}
              </motion.span>
              <span className="mt-1 text-[15px] font-extrabold text-blush-50 sm:text-base">{food.label}</span>
              <span className="text-[11.5px] leading-5 text-blush-100/70">{food.hint}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 flex min-h-[56px] items-center justify-center">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.button
              key="next"
              type="button"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              onClick={onNext}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-blush-500 via-fuchsia-500 to-purple-500 px-6 py-4 text-base font-extrabold text-white shadow-[0_14px_36px_rgba(240,60,150,0.4)] transition-[filter] hover:brightness-110 active:brightness-95 sm:w-auto sm:px-10"
            >
              بریم مرحله بعد ✨
            </motion.button>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[13px] font-medium text-blush-200/60"
            >
              یکی از گزینه‌ها رو انتخاب کن تا بریم بعدی 💫
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
