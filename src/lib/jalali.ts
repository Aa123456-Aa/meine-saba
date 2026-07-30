/**
 * تبدیل تاریخ میلادی <-> شمسی (الگوریتم استاندارد jalaali)
 */

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const toFaDigits = (value: string | number): string =>
  String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** نام کوتاه روزهای هفته به شروع شنبه */
export const WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const div = (a: number, b: number) => ~~(a / b);
const mod = (a: number, b: number) => a - ~~(a / b) * b;

function jalCal(jy: number) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
    2192, 2262, 2324, 2394, 2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): JalaliDate {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

export const toJalaali = (date: Date): JalaliDate =>
  d2j(g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));

export const toGregorian = (j: JalaliDate): Date => {
  const { gy, gm, gd } = d2g(j2d(j.jy, j.jm, j.jd));
  return new Date(gy, gm - 1, gd);
};

export const isLeapJalaali = (jy: number) => jalCal(jy).leap === 0;

export const jalaliMonthLength = (jy: number, jm: number) => {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaali(jy) ? 30 : 29;
};

/** فاصله‌ی اولین روز ماه شمسی از شنبه (۰ تا ۶) */
export const firstWeekdayOffset = (jy: number, jm: number) => {
  const g = toGregorian({ jy, jm, jd: 1 });
  return (g.getDay() + 1) % 7; // شنبه = ۰
};

/** نام روز هفته به فارسی (مثلاً «جمعه») */
export const weekdayNameFa = (date: Date) =>
  new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(date);

/** «جمعه، ۱۵ اسفند ۱۴۰۴» */
export const formatJalaliLong = (j: JalaliDate) => {
  const g = toGregorian(j);
  return `${weekdayNameFa(g)}، ${toFaDigits(j.jd)} ${JALALI_MONTHS[j.jm - 1]} ${toFaDigits(j.jy)}`;
};

export const formatTimeFa = (h: number, m: number) =>
  `${toFaDigits(String(h).padStart(2, "0"))}:${toFaDigits(String(m).padStart(2, "0"))}`;
