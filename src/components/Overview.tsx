import ChampionStats from "./ChampionStats";
import PLAYERS from "../data/players.json";
import MATCHES from "../data/matches.json";

export default function Overview() {
  return (
    <div>
      {Object.entries(PLAYERS)
        .filter(([_, v]) => v.pos !== "coach")
        .map(([name]) => {
          const matches = MATCHES.filter((s) => s.summonerName === name);
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
