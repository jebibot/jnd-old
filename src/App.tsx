import { useEffect, useState } from "react";
import Match from "./components/Match";
import Champion from "./components/Champion";
import { getKDA } from "./utils";
import { MatchData } from "./types";

import players from "./data/players.json";

import twitch from "./icon/twitch.svg";
import youtube from "./icon/youtube.svg";
import squareYoutube from "./icon/square-youtube.svg";
import cafe from "./icon/cafe.svg";
import tgd from "./icon/tgd.svg";

const LINKS = {
  twitchId: {
    name: "트위치",
    url: "https://www.twitch.tv/",
    logo: twitch,
  },
  youtube: {
    name: "유튜브",
    url: "https://www.youtube.com/channel/",
    logo: youtube,
  },
  youtubeFull: {
    name: "다시보기 유튜브",
    url: "https://www.youtube.com/channel/",
    logo: squareYoutube,
  },
  cafe: {
    name: "네이버 카페",
    url: "https://cafe.naver.com/",
    logo: cafe,
  },
  tgd: {
    name: "트게더",
    url: "https://tgd.kr/s/",
    logo: tgd,
  },
};

type Stats = {
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
};

function App() {
  const playerKeys = Object.keys(players);
  const [player, setPlayer] = useState(playerKeys[0]);
  const [data, setData] = useState<MatchData[]>([]);
  const playerData = players[player as keyof typeof players];

  useEffect(() => {
    const abortController = new AbortController();
    fetch("https://jnd-data.s3.ap-northeast-2.amazonaws.com/data.json", {
      signal: abortController.signal,
    })
      .then((r) => r.json())
      .then(setData);
    return () => {
      abortController.abort();
    };
  }, []);

  const playerStats: { [champ: string]: Stats } = {
    "0": {
      games: 0,
      wins: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
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
    playerStats[m.championId].cs += m.minionsKilled;
  }
  for (const c in playerStats) {
    if (c === "0") {
      continue;
    }
    playerStats["0"].games += playerStats[c].games;
    playerStats["0"].wins += playerStats[c].wins;
    playerStats["0"].kills += playerStats[c].kills;
    playerStats["0"].deaths += playerStats[c].deaths;
    playerStats["0"].assists += playerStats[c].assists;
    playerStats["0"].cs += playerStats[c].cs;
  }

  return (
    <div className="container mx-auto p-2">
      <select
        className="px-4 py-3 rounded-full border"
        onChange={(e) => {
          setPlayer(e.currentTarget.value);
        }}
      >
        {Object.keys(players).map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <div className="flex flex-row items-center bg-gray-200 rounded-lg p-2 m-2">
        <img
          className="w-32 h-32 rounded-lg m-2"
          src={playerData.profile}
          alt={player}
          title={player}
        ></img>
        <div>
          <div className="p-2">
            <span className="text-4xl font-bold align-middle">{player}</span>
            <span className="text-3xl text-gray-500 align-middle ml-1">
              {playerData.lolName}
            </span>
            <img
              className="w-8 h-8 inline-block mx-2"
              src={`images/ranked-positions/Position_${playerData.tier}-${playerData.pos}.png`}
              alt={`${playerData.tier} ${playerData.pos}`}
              title={`${playerData.tier} ${playerData.pos}`}
            ></img>
          </div>
          <div className="p-2">
            {Object.entries(LINKS).map(
              ([k, v]) =>
                k in playerData && (
                  <a
                    key={k}
                    href={`${v.url}${playerData[k as keyof typeof playerData]}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    title={v.name}
                  >
                    <img
                      src={v.logo}
                      className="h-5 inline-block m-1"
                      alt={v.name}
                    ></img>
                  </a>
                )
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-2 m-2">
        <div className="overflow-x-auto">
          <table className="text-center table-fixed w-[33rem] mx-auto">
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
                .map(([championId, stat]) => {
                  return (
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
                      <td>{(stat.cs / stat.games).toFixed(1)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {matches.map((m) => (
        <Match
          key={m.gameId}
          match={m}
          myTeam={data.filter(
            (e) => e.gameId === m.gameId && e.teamId === m.teamId
          )}
          otherTeam={data.filter(
            (e) => e.gameId === m.gameId && e.teamId !== m.teamId
          )}
        ></Match>
      ))}
      <div className="text-center text-sm text-gray-500">
        결과에서 제외하거나 관전 리플레이가 필요하신 경우{" "}
        <a href="mailto:tjebibot@gmail.com">tjebibot@gmail.com</a>으로 문의
        부탁드립니다.
      </div>
      <div className="text-center text-sm text-gray-400">
        jnd.twitchgg.tv isn't endorsed by Riot Games and doesn't reflect the
        views or opinions of Riot Games or anyone officially involved in
        producing or managing Riot Games properties. Riot Games, and all
        associated properties are trademarks or registered trademarks of Riot
        Games, Inc.
      </div>
    </div>
  );
}

export default App;
