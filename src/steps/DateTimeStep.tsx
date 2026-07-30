import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Loader2 } from "lucide-react";
import {
  JALALI_MONTHS,
  WEEKDAYS_SHORT,
  firstWeekdayOffset,
  formatJalaliLong,
  formatTimeFa,
  jalaliMonthLength,
  toFaDigits,
  toJalaali,
  type JalaliDate,
} from "../lib/jalali";

const spring = { type: "spring", stiffness: 280, damping: 22 } as const;
const ITEM_H = 40;

/* ─────────────── چرخِ انتخاب عدد (ساعت / دقیقه) ─────────────── */

function NumberWheel({
  items,
  value,
  onChange,
  label,
}: {
  items: number[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fromWheel = useRef(false);

  // همگام‌سازی وقتی مقدار از بیرون عوض می‌شه (چیپ‌های سریع)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (fromWheel.current) {
      fromWheel.current = false;
      return;
    }
    const target = items.indexOf(value) * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 2) {
      el.scrollTo({ top: target, behavior: "smooth" });
    }
  }, [value, items]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[12px] font-bold text-blush-200/90">{label}</span>
      <div className="relative">
        <div
          ref={ref}
          onScroll={(e) => {
            const el = e.currentTarget;
            const idx = Math.min(items.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM_H)));
            if (items[idx] !== value) {
              fromWheel.current = true;
              onChange(items[idx]);
            }
          }}
          className="no-scrollbar h-[200px] w-20 snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-2xl border border-white/12 bg-plum-950/40"
        >
          <div style={{ paddingTop: ITEM_H * 2, paddingBottom: ITEM_H * 2 }}>
            {items.map((v, idx) => {
              const dist = Math.abs(idx - items.indexOf(value));
              return (
                <div key={v} className="flex snap-center items-center justify-center" style={{ height: ITEM_H }}>
                  <span
                    className={`text-lg font-bold transition-all duration-200 ${
                      dist === 0
                        ? "scale-110 text-blush-50"
                        : dist === 1
                          ? "text-blush-100/50"
                          : "text-blush-100/25"
                    }`}
                  >
                    {toFaDigits(String(v).padStart(2, "0"))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* نشانگرِ ردیفِ وسط */}
        <div className="pointer-events-none absolute inset-x-1.5 top-1/2 h-10 -translate-y-1/2 rounded-xl border border-blush-300/50 bg-blush-500/15 shadow-[0_0_18px_rgba(249,77,155,0.25)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl bg-gradient-to-b from-plum-950/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-2xl bg-gradient-to-t from-plum-950/85 to-transparent" />
      </div>
    </div>
  );
}

/* ─────────────── تقویم شمسی ─────────────── */

function PersianCalendar({ selected, onPick }: { selected: JalaliDate | null; onPick: (d: JalaliDate) => void }) {
  const todayJ = useMemo(() => {
    const d = new Date();
    return toJalaali(d);
  }, []);
  const [view, setView] = useState({ jy: todayJ.jy, jm: todayJ.jm });

  const canPrev = view.jy * 12 + view.jm > todayJ.jy * 12 + todayJ.jm;

  const cells = useMemo(() => {
    const len = jalaliMonthLength(view.jy, view.jm);
    const offset = firstWeekdayOffset(view.jy, view.jm);
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: len }, (_, i) => i + 1),
    ];
  }, [view]);

  const disabled = (jd: number) => {
    if (view.jy < todayJ.jy) return true;
    if (view.jy > todayJ.jy) return false;
    if (view.jm < todayJ.jm) return true;
    if (view.jm > todayJ.jm) return false;
    return jd < todayJ.jd;
  };

  const move = (dir: 1 | -1) => {
    setView((v) => {
      let { jy, jm } = v;
      jm += dir;
      if (jm > 12) {
        jm = 1;
        jy += 1;
      }
      if (jm < 1) {
        jm = 12;
        jy -= 1;
      }
      return { jy, jm };
    });
  };

  return (
    <div className="rounded-[24px] border border-white/12 bg-plum-950/35 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!canPrev}
          aria-label="ماه قبل"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 text-blush-100 transition-all hover:bg-blush-500/25 active:scale-90 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="h-[18px] w-[18px]" />
        </button>
        <p className="font-display text-xl text-blush-50">
          {JALALI_MONTHS[view.jm - 1]} {toFaDigits(view.jy)}
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="ماه بعد"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 text-blush-100 transition-all hover:bg-blush-500/25 active:scale-90"
        >
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center">
        {WEEKDAYS_SHORT.map((w) => (
          <span key={w} className="py-1 text-[11px] font-bold text-blush-200/70">
            {w}
          </span>
        ))}
      </div>

      <div key={`${view.jy}-${view.jm}`} className="grid grid-cols-7 gap-y-1.5">
        {cells.map((jd, i) =>
          jd === null ? (
            <span key={`e-${i}`} />
          ) : (
            <motion.button
              key={`d-${jd}`}
              type="button"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: jd * 0.012, duration: 0.25 }}
              whileTap={{ scale: 0.85 }}
              disabled={disabled(jd)}
              onClick={() => onPick({ jy: view.jy, jm: view.jm, jd })}
              className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13.5px] font-bold transition-colors sm:h-10 sm:w-10 sm:text-sm ${
                selected && selected.jy === view.jy && selected.jm === view.jm && selected.jd === jd
                  ? "bg-gradient-to-br from-blush-500 to-fuchsia-600 text-white shadow-[0_6px_20px_rgba(249,77,155,0.5)]"
                  : disabled(jd)
                    ? "text-blush-100/25"
                    : "text-blush-50 hover:bg-blush-500/25"
              }`}
            >
              {toFaDigits(jd)}
              {todayJ.jy === view.jy &&
                todayJ.jm === view.jm &&
                todayJ.jd === jd &&
                !(selected && selected.jy === view.jy && selected.jm === view.jm && selected.jd === jd) && (
                  <span className="absolute inset-0 rounded-full border border-blush-300/60" />
                )}
            </motion.button>
          )
        )}
      </div>
    </div>
  );
}

/* ─────────────── مرحله‌ی انتخاب روز و ساعت ─────────────── */

const QUICK_TIMES = [
  { h: 13, m: 0 },
  { h: 16, m: 0 },
  { h: 17, m: 30 },
  { h: 18, m: 0 },
  { h: 19, m: 30 },
  { h: 20, m: 0 },
  { h: 21, m: 0 },
];

export function DateTimeStep({
  date,
  time,
  onDate,
  onTime,
  onSubmit,
}: {
  date: JalaliDate | null;
  time: { h: number; m: number };
  onDate: (d: JalaliDate) => void;
  onTime: (t: { h: number; m: number }) => void;
  onSubmit: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 12 }, (_, i) => i * 5), []);

  const submit = () => {
    if (!date || saving) return;
    setSaving(true);
    window.setTimeout(onSubmit, 1100);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -36, scale: 0.97 }}
      transition={{ ...spring, damping: 24 }}
      className="rounded-[30px] border border-white/15 bg-white/[0.08] p-5 shadow-[0_24px_60px_rgba(28,5,48,0.5)] backdrop-blur-2xl sm:p-8"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="inline-flex items-center gap-1.5 rounded-full bg-blush-500/20 px-3 py-1 text-[12px] font-bold text-blush-200"
      >
        <CalendarDays className="h-3.5 w-3.5" /> مرحله‌ی سوم: وقتِ قرار
      </motion.span>

      <div className="mt-3 overflow-hidden">
        <motion.h2
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, ...spring }}
          className="font-display text-[1.55rem] leading-[1.45] text-blush-50 sm:text-[2rem]"
        >
          حالا{" "}
          <span className="bg-gradient-to-l from-blush-200 to-blush-400 bg-clip-text text-transparent">صبا جان</span>
          ، بگو چه روز و ساعتی دوست داری با آرین بری دیت؟ 🥰⏰
        </motion.h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <PersianCalendar selected={date} onPick={onDate} />

        <div className="rounded-[24px] border border-white/12 bg-plum-950/35 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-blush-50">
            <Clock3 className="h-5 w-5 text-blush-300" />
            <p className="font-display text-xl">ساعتِ قرار</p>
          </div>

          <div className="flex items-start justify-center gap-3 sm:gap-4">
            <NumberWheel items={hours} value={time.h} onChange={(h) => onTime({ h, m: time.m })} label="ساعت" />
            <span className="mt-[100px] font-display text-2xl text-blush-300">:</span>
            <NumberWheel items={minutes} value={time.m} onChange={(m) => onTime({ h: time.h, m })} label="دقیقه" />
          </div>

          <p className="mb-2 mt-3 text-center text-[11.5px] font-semibold text-blush-200/70">
            یا یکی از زمان‌های پیشنهادی رو بزن:
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {QUICK_TIMES.map((t) => {
              const active = time.h === t.h && time.m === t.m;
              return (
                <button
                  key={`${t.h}-${t.m}`}
                  type="button"
                  onClick={() => onTime(t)}
                  className={`rounded-full border px-3 py-1.5 text-[12.5px] font-bold transition-all active:scale-90 ${
                    active
                      ? "border-transparent bg-gradient-to-l from-blush-500 to-fuchsia-600 text-white shadow-[0_4px_16px_rgba(249,77,155,0.4)]"
                      : "border-white/15 bg-white/5 text-blush-100/85 hover:border-blush-300/40 hover:bg-blush-500/15"
                  }`}
                >
                  {formatTimeFa(t.h, t.m)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* خلاصه‌ی انتخاب‌ها */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[13px] font-bold">
        <motion.span
          key={date ? formatJalaliLong(date) : "no-date"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-full border px-3.5 py-1.5 ${
            date
              ? "border-blush-300/50 bg-blush-500/15 text-blush-100"
              : "border-white/10 bg-white/5 text-blush-100/45"
          }`}
        >
          📅 {date ? formatJalaliLong(date) : "یه روز از تقویم انتخاب کن"}
        </motion.span>
        <span className="rounded-full border border-blush-300/50 bg-blush-500/15 px-3.5 py-1.5 text-blush-100">
          ⏰ ساعت {formatTimeFa(time.h, time.m)}
        </span>
      </div>

      <motion.button
        type="button"
        onClick={submit}
        disabled={!date || saving}
        whileTap={{ scale: date && !saving ? 0.95 : 1 }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-blush-500 via-fuchsia-500 to-purple-500 px-6 py-4 text-base font-extrabold text-white shadow-[0_14px_36px_rgba(240,60,150,0.4)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100"
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            داره ثبت می‌شه… 💘
          </>
        ) : (
          <>ثبت قرار ❤️</>
        )}
      </motion.button>
    </motion.section>
  );
}
