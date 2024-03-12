import dayjs from "dayjs";

const DAY_TIME = 24 * 60 * 60 * 1000;
const HOUR_TIME = 60 * 60 * 1000;
const MIN_TIME = 60 * 1000;
const SEC_TIME = 1000;

export const getDateUtcToLocal = (d: any) => {
  const hasTimezone = `${d}`.includes("Z");
  const timezoneOffset = new Date().getTimezoneOffset();
  let currentDate = dayjs(d);
  if (!hasTimezone) {
    currentDate = currentDate.subtract(timezoneOffset, "minutes");
  }
  return {
    value: currentDate.format("YYYY-MM-DD HH:mm:ss"),
    offsetHours: -timezoneOffset / 60,
  };
};

export const getDateDiff = (d: any) => {
  const now = dayjs();
  const target = dayjs(getDateUtcToLocal(d).value);
  const diff = now.diff(target, "seconds");
  const diffM = now.diff(target, "minute");
  const diffH = now.diff(target, "hours");
  const diffD = now.diff(target, "day");
  if (diff < 60) return "less than a minute ago";
  if (diffM < 2) return "1 min ago";
  if (diffM >= 2 && diffM <= 59) return `${diffM} mins ago`;
  if (diffM >= 60 && diffM <= 119) return "1 hour ago";
  if (diffH >= 2 && diffH <= 23) return `${diffH} hours ago`;
  if (diffD >= 1 && diffD < 2) return "1 day ago";
  if (diffD >= 2 && diffD < 31) return `${diffD} days ago`;
  if (diffD >= 31 && diffD < 61) return "1 month ago";
  if (diffD >= 61 && diffD < 365) return `${Math.floor(diffD / 30)} months ago`;
  if (diffD >= 365 && diffD < 730) return "1 year ago";
  if (diffD >= 730) return `${Math.floor(diffD / 365)} years ago`;
};

export const getLocalDateString = (d: any) => {
  const { value, offsetHours } = getDateUtcToLocal(d);
  const sign = offsetHours > 0 ? "+" : "-";
  const offsetHoursString =
    offsetHours === 0 ? "UTC" : `UTC${sign}${Math.abs(offsetHours)}`;
  return `${value} (${offsetHoursString})`;
};

export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function timeToDateStr(time: number | string, measure = 1) {
  const datetime = Number(time) * measure;
  const date = dayjs(datetime);
  return date.format("DD/MM/YYYY HH:mm:ss");
}

export function calculateRemainTime(time: number) {
  let remainTime = time;
  const day = Math.floor(remainTime / DAY_TIME);
  remainTime = remainTime % DAY_TIME;
  const hours = Math.floor(remainTime / HOUR_TIME);
  remainTime = remainTime % HOUR_TIME;
  const minutes = Math.floor(remainTime / MIN_TIME);
  remainTime = remainTime % MIN_TIME;
  const seconds = Math.floor(remainTime / SEC_TIME);
  return {
    day,
    hours,
    minutes,
    seconds,
  };
}
