import PLAYERS from "./data/players.json";

export const TEAMS = [
  {
    name: "감자해적단",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    name: "푸켓몬스터",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    name: "못말린다니깐",
    color: "text-green-600",
    bgColor: "bg-lime-100",
  },
  {
    name: "따봉디제도",
    color: "text-cyan-600",
    bgColor: "bg-sky-100",
  },
  {
    name: "칠순집 막내아들",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
];
const teamMap = Object.fromEntries(
  Object.keys(PLAYERS).map((p, i) => [p, Math.floor(i / 6)])
);

export function getTeam(name: string | undefined) {
  return name != null && name in teamMap
    ? TEAMS[teamMap[name]]
    : { color: "truncate", bgColor: "bg-gray-100" };
}
