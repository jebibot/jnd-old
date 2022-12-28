import players from "./data/players.json";

export const TEAMS = [
  {
    name: "Team 얍얍",
    color: "text-orange-600",
  },
  {
    name: "Team 푸린",
    color: "text-pink-600",
  },
  {
    name: "Team 류제홍",
    color: "text-green-600",
  },
  {
    name: "Team 따효니",
    color: "text-cyan-600",
  },
  {
    name: "Team 한동숙",
    color: "text-indigo-600",
  },
];
const teamMap = Object.fromEntries(
  Object.keys(players).map((p, i) => [p, Math.floor(i / 5)])
);

export function getTeam(name: string) {
  return name in teamMap ? TEAMS[teamMap[name]] : { color: "truncate" };
}
