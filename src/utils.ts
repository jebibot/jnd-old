const UNITS: { [unit: string]: number } = {
  year: 365 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};
const KO_UNITS: { [unit: string]: string } = {
  year: "년",
  month: "개월",
  day: "일",
  hour: "시간",
  minute: "분",
  second: "초",
};

const rtf =
  Intl.RelativeTimeFormat &&
  new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

export function getKDA(stat: {
  kills: number;
  deaths: number;
  assists: number;
}) {
  return stat.deaths
    ? ((stat.kills + stat.assists) / stat.deaths).toFixed(2)
    : "Perfect";
}

export function getRelativeTime(d1?: Date | number, d2 = new Date()) {
  if (!d1) {
    return;
  }
  const elapsed = d1.valueOf() - d2.valueOf();
  for (const u in UNITS) {
    if (Math.abs(elapsed) > UNITS[u] || u === "second") {
      const unitElapsed = Math.round(elapsed / UNITS[u]);
      return rtf
        ? rtf.format(unitElapsed, u as Intl.RelativeTimeFormatUnit)
        : `${Math.abs(unitElapsed)}${KO_UNITS[u]} ${elapsed > 0 ? "후" : "전"}`;
    }
  }
}
