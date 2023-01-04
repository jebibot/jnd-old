import Champion from "./Champion";
import { getKDA } from "../utils";
import { MatchData } from "../types";

type GameStats = {
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  csGames: number;
  cs: number;
};

type ChampionStatsProps = {
  matches: MatchData[];
  showCs?: boolean;
};

export default function ChampionStats({ matches, showCs }: ChampionStatsProps) {
  const playerStats: { [champ: string]: GameStats } = {
    "0": {
      games: 0,
      wins: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      csGames: 0,
      cs: 0,
    },
  };
  for (const m of matches) {
    playerStats[m.championId] ||= { ...playerStats["0"] };
    playerStats[m.championId].games++;
    playerStats[m.championId].wins += m.win ? 1 : 0;
    playerStats[m.championId].kills += m.kills;
    playerStats[m.championId].deaths += m.deaths;
    playerStats[m.championId].assists += m.assists;
    if (showCs && m.minionsKilled) {
      playerStats[m.championId].csGames++;
      playerStats[m.championId].cs += m.minionsKilled;
    }
  }
  for (const c in playerStats) {
    if (c === "0") {
      continue;
    }
    for (const stat in playerStats["0"]) {
      playerStats["0"][stat as keyof GameStats] +=
        playerStats[c][stat as keyof GameStats];
    }
  }

  return (
    <table className="text-center table-fixed w-0 mx-auto">
      <thead>
        <tr>
          <th className="p-1 w-36">챔피언</th>
          <th className="p-1 w-40">승률</th>
          <th className="p-1 w-44">KDA</th>
          {showCs && <th className="p-1 w-12">CS</th>}
        </tr>
      </thead>
      <tbody>
        {Object.entries(playerStats)
          .sort((a, b) => b[1].games - a[1].games)
          .map(([championId, stat]) => (
            <tr key={championId}>
              <td>
                {championId !== "0" ? (
                  <Champion
                    championId={championId}
                    className="w-8 h-8 inline-block m-1"
                    showName
                  ></Champion>
                ) : (
                  "(전체)"
                )}
              </td>
              <td>
                {((stat.wins / stat.games) * 100).toFixed()}% ({stat.games}전{" "}
                {stat.wins}승 {stat.games - stat.wins}패)
              </td>
              <td>
                {getKDA(stat)} ({(stat.kills / stat.games).toFixed(1)} /{" "}
                {(stat.deaths / stat.games).toFixed(1)} /{" "}
                {(stat.assists / stat.games).toFixed(1)})
              </td>
              {showCs && (
                <td>
                  {stat.csGames ? (stat.cs / stat.csGames).toFixed(1) : "-"}
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
}
