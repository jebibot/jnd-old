import { useParams, useRouteLoaderData } from "react-router-dom";
import Champion from "./Champion";
import Links from "./Links";
import Match from "./Match";
import RankedPosition from "./RankedPosition";
import { getTeam } from "../team";
import { getKDA } from "../utils";
import { MatchData } from "../types";

import PLAYERS from "../data/players.json";

import "react-tooltip/dist/react-tooltip.css";

type GameStats = {
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  csGames: number;
  cs: number;
};

export default function Stats() {
  const { player } = useParams();
  if (player == null || !(player in PLAYERS)) {
    throw new Error("스트리머를 찾을 수 없습니다!");
  }
  const playerData = PLAYERS[player as keyof typeof PLAYERS];
  if (playerData.pos === "coach") {
    throw new Error("스트리머를 찾을 수 없습니다!");
  }

  const data = useRouteLoaderData("root") as MatchData[];
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
  const matches = data.filter((s) => s.summonerName === player);
  for (const m of matches) {
    playerStats[m.championId] ||= { ...playerStats["0"] };
    playerStats[m.championId].games++;
    playerStats[m.championId].wins += m.win ? 1 : 0;
    playerStats[m.championId].kills += m.kills;
    playerStats[m.championId].deaths += m.deaths;
    playerStats[m.championId].assists += m.assists;
    if (m.minionsKilled) {
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
    <>
      <div className="flex flex-row items-center bg-gray-200 rounded-lg p-2 m-2">
        <img
          className="w-32 h-32 rounded-lg m-2"
          src={playerData.profile}
          alt={player}
          title={player}
        ></img>
        <div>
          <div className="p-2">
            <span
              className={`text-4xl font-bold align-middle ${
                getTeam(player).color
              }`}
            >
              {player}
            </span>
            <span className="text-3xl text-gray-500 align-middle ml-1">
              {playerData.lolName}
            </span>
            <RankedPosition
              className="w-8 h-8 inline-block ml-2"
              tier={playerData.tier}
              pos={playerData.pos}
            ></RankedPosition>
          </div>
          <Links
            data={playerData}
            className="p-2"
            childClassName="h-5 inline-block m-1"
          ></Links>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-2 m-2">
        <div className="overflow-x-auto">
          <table className="text-center table-fixed w-0 mx-auto">
            <thead>
              <tr>
                <th className="p-1 w-36">챔피언</th>
                <th className="p-1 w-40">승률</th>
                <th className="p-1 w-44">KDA</th>
                <th className="p-1 w-12">CS</th>
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
                      {((stat.wins / stat.games) * 100).toFixed()}% (
                      {stat.games}전 {stat.wins}승 {stat.games - stat.wins}패)
                    </td>
                    <td>
                      {getKDA(stat)} ({(stat.kills / stat.games).toFixed(1)} /{" "}
                      {(stat.deaths / stat.games).toFixed(1)} /{" "}
                      {(stat.assists / stat.games).toFixed(1)})
                    </td>
                    <td>
                      {stat.csGames ? (stat.cs / stat.csGames).toFixed(1) : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {matches.map((m) => (
        <Match
          key={m.gameId}
          match={m}
          data={data.filter((d) => d.gameId === m.gameId)}
        ></Match>
      ))}
    </>
  );
}
