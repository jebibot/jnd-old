import { useRouteLoaderData } from "react-router-dom";
import ChampionStats from "./ChampionStats";
import { MatchData } from "../types";
import PLAYERS from "../data/players.json";

export default function Overview() {
  const data = useRouteLoaderData("root") as MatchData[];
  return (
    <div>
      {Object.entries(PLAYERS)
        .filter(([_, v]) => v.pos !== "coach")
        .map(([name]) => {
          const matches = data.filter((s) => s.summonerName === name);
          return (
            <div className="overflow-x-auto p-2 m-2">
              <div className="text-3xl font-bold">{name}</div>
              <ChampionStats matches={matches}></ChampionStats>
            </div>
          );
        })}
    </div>
  );
}
