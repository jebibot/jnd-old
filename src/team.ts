import PLAYERS from "./data/players.json";

export const TEAMS = [
  {
    name: "Team 얍얍",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    name: "Team 푸린",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  {
    name: "Team 류제홍",
    color: "text-green-600",
    bgColor: "bg-lime-100",
  },
  {
    name: "Team 따효니",
    color: "text-cyan-600",
    bgColor: "bg-sky-100",
  },
  {
    name: "Team 한동숙",
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
