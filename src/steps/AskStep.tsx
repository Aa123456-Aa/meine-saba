import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const DODGE_MESSAGES = [
  "اِی! کجا؟ 😆",
  "دکمه‌ی «نه» خجالت می‌کشه 🙈",
  "هرچی بیشتر تلاش کنی، بیشتر فرار می‌کنه 😌",
  "بی‌خیال شو، فقط یه جواب درسته ❤️",
];

const BURST_EMOJI = ["❤️", "💖", "💕", "💗", "✨", "🌹", "💘", "💝"];

const spring = { type: "spring", stiffness: 260, damping: 20 } as const;

export function AskStep({ onNext }: { onNext: () => void }) {
  const reduceMotion = useReducedMotion();
  const zoneRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);
  const [burst, setBurst] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const dodge = () => {
    if (accepted) return;
    const zone = zoneRef.current?.getBoundingClientRect();
    const btn = noBtnRef.current?.getBoundingClientRect();
    if (!zone || !btn) return;
    const maxX = Math.max(20, zone.width / 2 - btn.width / 2 - 6);
    const maxY = Math.max(14, zone.height / 2 - btn.height / 2 - 6);
    let x = (Math.random() * 2 - 1) * maxX;
    let y = (Math.random() * 2 - 1) * maxY;
    // اگه خیلی نزدیکِ جاش قبلی موند، پرتش کن اون‌ور
    if (Math.abs(x - pos.x) < 40) x = -Math.sign(x || 1) * maxX * 0.9;
    setPos({ x, y });
    setDodges((d) => d + 1);
  };

  const accept = () => {
    if (accepted) return;
    setAccepted(true);
    setBurst(true);
    window.setTimeout(onNext, reduceMotion ? 120 : 850);
  };

  const burstPieces = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 70 + Math.random() * 90;
        return {
          id: i,
          emoji: BURST_EMOJI[i % BURST_EMOJI.length],
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 40,
          rot: (Math.random() - 0.5) * 120,
          scale: 0.8 + Math.random() * 0.9,
        };
      }),
    []
  );

  const message = dodges > 0 ? DODGE_MESSAGES[Math.min(dodges - 1, DODGE_MESSAGES.length - 1)] : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 48, rotate: -1.5, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, y: -36, scale: 0.97 }}
      transition={{ ...spring, damping: 24 }}
      className="relative rounded-[30px] border border-white/15 bg-white/[0.08] p-6 pt-9 shadow-[0_24px_60px_rgba(28,5,48,0.5)] backdrop-blur-2xl sm:p-8"
    >
      {/* مُهر و موم قلبی نامه */}
      <div className="absolute -top-7 right-1/2 translate-x-1/2">
        <div className="animate-heart-beat flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 text-2xl shadow-[0_10px_30px_rgba(249,77,155,0.55),inset_0_2px_6px_rgba(255,255,255,0.35)] ring-4 ring-plum-900/60">
          ❤️
        </div>
      </div>

      {/* سربرگ پاکت نامه */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dashed border-blush-300/30 bg-blush-500/[0.07] px-4 py-2.5 text-[12.5px]"
      >
        <span className="font-medium text-blush-100">
          به: <b className="text-blush-200">صبا خانمِ خوش‌قلب</b> 💗
        </span>
        <span className="text-blush-200/75">
          از: <b>آرین</b>، با کلی ذوق ✨
        </span>
      </motion.div>

      {/* تیتر با رونمایی خطی */}
      <div className="overflow-hidden">
        <motion.h1
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ delay: 0.12, ...spring }}
          className="font-display text-[2rem] leading-[1.35] text-blush-50 sm:text-[2.5rem]"
        >
          <span className="bg-gradient-to-l from-blush-200 to-blush-400 bg-clip-text text-transparent">
            صبا جان،
          </span>
          <br />
          میای با آرین بری دیت؟ 🥰❤️
        </motion.h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-3 text-[15px] leading-7 text-blush-100/85"
      >
        یه قرارِ دونفره‌ی کوچولو، ولی با کلی خاطره‌ی بزرگ. فقط یه جوابِ درست وجود داره… 😉
      </motion.p>

      {/* زمینِ بازی دکمه‌ها */}
      <div ref={zoneRef} className="relative mt-6 h-44 overflow-hidden sm:h-40">
        <div className="flex h-full items-center justify-center gap-4">
          <motion.button
            type="button"
            onClick={accept}
            animate={{ scale: accepted ? 1.1 : 1 + Math.min(dodges * 0.05, 0.22) }}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            className="animate-pulse-soft z-10 rounded-full bg-gradient-to-l from-blush-500 via-fuchsia-500 to-purple-500 px-8 py-4 text-lg font-extrabold text-white shadow-[0_14px_36px_rgba(240,60,150,0.45)] transition-[filter] hover:brightness-110 active:brightness-95"
          >
            بله، حتماً ❤️
          </motion.button>

          <motion.button
            ref={noBtnRef}
            type="button"
            onPointerEnter={dodge}
            onPointerDown={dodge}
            onClick={dodge}
            animate={{
              x: pos.x,
              y: pos.y,
              scale: Math.max(0.62, 1 - dodges * 0.07),
              rotate: dodges > 0 ? (dodges % 2 === 0 ? -5 : 5) : 0,
            }}
            transition={spring}
            className="select-none rounded-full border border-white/20 bg-white/10 px-7 py-4 text-lg font-bold text-blush-100/90 backdrop-blur-md hover:bg-white/15"
            style={{ touchAction: "manipulation" }}
          >
            خیر 😢
          </motion.button>
        </div>

        {/* انفجار قلب موقع «بله» */}
        {burst && !reduceMotion && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            {burstPieces.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale, rotate: p.rot }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute text-2xl"
              >
                {p.emoji}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* پیام‌های بامزه‌ی فرار */}
      <div className="flex h-7 items-center justify-center">
        {message && !accepted && (
          <motion.p
            key={dodges}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={spring}
            className="text-sm font-semibold text-blush-300"
          >
            {message}
          </motion.p>
        )}
        {accepted && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-bold text-blush-200"
          >
            ایول! چه انتخابِ درستی! 😍❤️
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
