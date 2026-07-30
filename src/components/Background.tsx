import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Floater {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  opacity: number;
  hue: string;
}

interface Spark {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

const HEART_PATH =
  "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z";

const HEART_COLORS = ["#ff6fb5", "#f94d9b", "#c084fc", "#ff9ecf", "#f0abfc", "#fb7185"];

export function Background() {
  const reduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const hearts = useMemo<Floater[]>(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 13 + Math.random() * 24,
        duration: 15 + Math.random() * 14,
        delay: -Math.random() * 28,
        sway: (Math.random() - 0.5) * 90,
        opacity: 0.16 + Math.random() * 0.34,
        hue: HEART_COLORS[i % HEART_COLORS.length],
      })),
    []
  );

  const sparks = useMemo<Spark[]>(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 4,
        duration: 2.2 + Math.random() * 3,
      })),
    []
  );

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* پایه‌ی گرادیانی بنفش-صورتی */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(168deg, #23073b 0%, #3a1059 28%, #5c1463 52%, #8a1a63 76%, #b0245f 100%)",
        }}
      />

      {/* هاله‌های نورانی با پارالاکس */}
      <motion.div
        className="absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(217,70,239,0.42) 0%, transparent 68%)" }}
        animate={{ x: pointer.x * -26, y: pointer.y * -18 }}
        transition={{ type: "spring", stiffness: 40, damping: 14 }}
      />
      <motion.div
        className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,111,181,0.4) 0%, transparent 66%)" }}
        animate={{ x: pointer.x * 30, y: pointer.y * 22 }}
        transition={{ type: "spring", stiffness: 36, damping: 13 }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/4 h-[28rem] w-[28rem] rounded-full opacity-55 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 65%)" }}
        animate={{ x: pointer.x * -18, y: pointer.y * -26 }}
        transition={{ type: "spring", stiffness: 44, damping: 15 }}
      />

      {/* ستاره‌های چشمک‌زن */}
      {sparks.map((s) => (
        <span
          key={`spark-${s.id}`}
          className="absolute rounded-full bg-blush-100"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: "0 0 8px 2px rgba(255,224,239,0.55)",
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* قلب‌های شناور */}
      {!reduceMotion &&
        hearts.map((h) => (
          <svg
            key={`heart-${h.id}`}
            viewBox="0 0 24 24"
            className="absolute top-0"
            style={
              {
                left: `${h.left}%`,
                width: h.size,
                height: h.size,
                fill: h.hue,
                filter: h.size > 28 ? "blur(1px)" : undefined,
                animation: `float-up ${h.duration}s linear ${h.delay}s infinite`,
                "--sway": `${h.sway}px`,
                "--o": h.opacity,
                opacity: 0,
              } as React.CSSProperties
            }
          >
            <path d={HEART_PATH} />
          </svg>
        ))}

      {/* ویگنت پایین برای خوانایی بهتر */}
      <div
        className="absolute inset-x-0 bottom-0 h-56"
        style={{ background: "linear-gradient(to top, rgba(28,5,48,0.75), transparent)" }}
      />
    </div>
  );
}
