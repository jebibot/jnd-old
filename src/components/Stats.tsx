import { useParams } from "react-router-dom";
import ChampionStats from "./ChampionStats";
import Links from "./Links";
import Match from "./Match";
import RankedPosition from "./RankedPosition";
import { getTeam } from "../team";

import PLAYERS from "../data/players.json";
import MATCHES from "../data/matches.json";

import "react-tooltip/dist/react-tooltip.css";

export default function Stats() {
  const { player } = useParams();
  if (player == null || !(player in PLAYERS)) {
    throw new Error("스트리머를 찾을 수 없습니다!");
  }
  const playerData = PLAYERS[player as keyof typeof PLAYERS];
  if (playerData.pos === "coach") {
    throw new Error("스트리머를 찾을 수 없습니다!");
  }

  const matches = MATCHES.filter((s) => s.summonerName === player);
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
          <ChampionStats matches={matches} showCs></ChampionStats>
        </div>
      </div>
      {matches.map((m) => (
        <Match
          key={m.gameId}
          match={m}
          data={MATCHES.filter((d) => d.gameId === m.gameId)}
        ></Match>
      ))}
    </>
  );
}
