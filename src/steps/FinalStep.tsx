import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { buildWhatsAppLink, type DateChoice, type Food } from "../lib/data";
import { formatJalaliLong, formatTimeFa } from "../lib/jalali";
import { Confetti } from "../components/Confetti";

const spring = { type: "spring", stiffness: 260, damping: 22 } as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function FinalStep({
  food,
  choice,
  onRestart,
}: {
  food: Food;
  choice: DateChoice;
  onRestart: () => void;
}) {
  const waLink = buildWhatsAppLink(food, choice);

  const rows = [
    { icon: "🍽️", label: "غذا", value: `${food.emoji} ${food.label}` },
    { icon: "📅", label: "تاریخ", value: formatJalaliLong(choice.date) },
    { icon: "⏰", label: "ساعت", value: formatTimeFa(choice.time.h, choice.time.m) },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 48, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring, damping: 24 }}
      className="relative overflow-hidden rounded-[30px] border border-blush-300/25 bg-white/[0.08] p-6 text-center shadow-[0_24px_60px_rgba(28,5,48,0.5)] backdrop-blur-2xl sm:p-9"
    >
      <Confetti />

      {/* نورِ پشتِ کارت */}
      <div
        className="pointer-events-none absolute -top-24 right-1/2 h-64 w-64 translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(249,77,155,0.5), transparent 70%)" }}
      />

      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, ...spring }}
        className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blush-400 to-fuchsia-600 text-4xl shadow-[0_14px_40px_rgba(249,77,155,0.55)] ring-4 ring-blush-200/25"
      >
        <span className="animate-heart-beat">❤️</span>
      </motion.div>

      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, ...spring }}
          className="font-display text-[1.7rem] leading-[1.45] text-blush-50 sm:text-[2.2rem]"
        >
          دیت خوبی رو با آرین داشته باشی،{" "}
          <span className="bg-gradient-to-l from-blush-200 to-blush-400 bg-clip-text text-transparent">
            زیباترین دختر دنیا
          </span>{" "}
          ❤️🥰✨
        </motion.h2>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-3 text-[15px] font-semibold text-blush-100/90"
      >
        صبا جان، قرار دیت شما با آرین ثبت شد! 💕
      </motion.p>

      {/* خلاصه‌ی قرار */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ...spring }}
        className="mx-auto mt-6 max-w-sm divide-y divide-white/10 rounded-[22px] border border-white/12 bg-plum-950/40 text-start"
      >
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 + i * 0.14, ...spring }}
            className="flex items-center justify-between gap-3 px-4 py-3.5"
          >
            <span className="flex items-center gap-2 text-[13px] font-bold text-blush-200/85">
              <span className="text-lg">{r.icon}</span> {r.label}:
            </span>
            <span className="text-[13.5px] font-extrabold text-blush-50">{r.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* دکمه‌ی واتساپ */}
      <motion.a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 22, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.1, ...spring }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-l from-emerald-500 to-green-600 px-6 py-4 text-base font-extrabold text-white shadow-[0_14px_36px_rgba(16,185,129,0.4)] transition-[filter] hover:brightness-110 active:brightness-95"
      >
        <WhatsAppIcon className="h-5.5 w-5.5" />
        ارسال جزئیات به واتساپ 💚
      </motion.a>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35 }}
        className="mt-2.5 text-[11.5px] text-blush-100/60"
      >
        با یه لمس، واتساپ با پیامِ آماده باز می‌شه؛ فقط ارسالش کن 😉
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-5 rounded-2xl border border-dashed border-blush-300/25 bg-blush-500/[0.06] px-4 py-3 text-[12.5px] leading-6 text-blush-100/80"
      >
        راستی… یه سورپرایزِ کوچولو هم سرِ قرار منتظرته 🎁✨
      </motion.div>

      <motion.button
        type="button"
        onClick={onRestart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.65 }}
        whileTap={{ scale: 0.94 }}
        className="mx-auto mt-5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-blush-200/60 transition-colors hover:text-blush-100"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        اگه خواستی از اول شروع کنی 😉
      </motion.button>
    </motion.section>
  );
}
