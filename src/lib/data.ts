import type { JalaliDate } from "./jalali";
import { formatJalaliLong, formatTimeFa } from "./jalali";

export interface Food {
  id: string;
  emoji: string;
  label: string;
  hint: string;
}

export const FOODS: Food[] = [
  { id: "caesar", emoji: "🥗", label: "سالاد سزار", hint: "سبک، تازه و خوشمزه" },
  { id: "kebab", emoji: "🍖", label: "کباب", hint: "یه انتخاب اصیل و حسابی" },
  { id: "pizza", emoji: "🍕", label: "پیتزا", hint: "همیشه پایه‌ی حالِ خوبه" },
  { id: "dessert", emoji: "🧃", label: "آبمیوه و بستنی", hint: "شیرین، درست مثل خودت" },
];

export interface DateChoice {
  date: JalaliDate;
  time: { h: number; m: number };
}

const WHATSAPP_NUMBER = "989924015464";

export const buildWhatsAppLink = (food: Food, choice: DateChoice) => {
  const message = [
    "سلام آرین ❤️",
    "صبا برای دیت موافقت کرد! 🥰",
    "",
    `🍽️ انتخاب غذا: ${food.emoji} ${food.label}`,
    `📅 تاریخ دیت: ${formatJalaliLong(choice.date)}`,
    `⏰ ساعت دیت: ${formatTimeFa(choice.time.h, choice.time.m)}`,
    "",
    "زیباترین دختر دنیا قراره با آرین دیت بره ❤️✨",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
