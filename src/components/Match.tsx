import { useState } from "react";
import { MatchData } from "../types";
import { getKDA, getRelativeTime } from "../utils";
import Champion from "./Champion";
import PlayerItem from "./PlayerItem";

type MatchProps = {
  match: MatchData;
  myTeam: MatchData[];
  otherTeam: MatchData[];
};

export default function Match({ match, myTeam, otherTeam }: MatchProps) {
  const [shown, show] = useState(false);

  const myTeamKills = myTeam.reduce((prev, cur) => {
    prev += cur.kills;
    return prev;
  }, 0);
  const otherTeamKills = otherTeam.reduce((prev, cur) => {
    prev += cur.kills;
    return prev;
  }, 0);
  const maxDamagesDealt = Math.max(
    ...myTeam.map((m) => m.totalDamageDealtToChampions),
    ...otherTeam.map((m) => m.totalDamageDealtToChampions)
  );
  const maxDamagesTaken = Math.max(
    ...myTeam.map((m) => m.totalDamageTaken),
    ...otherTeam.map((m) => m.totalDamageTaken)
  );

  return (
    <div
      key={match.gameId}
      className={`${
        match.win ? "bg-blue-100" : "bg-red-100"
      } rounded-lg p-2 m-2`}
    >
      <div
        className="flex flex-row items-center justify-center m-2 cursor-pointer"
        onClick={() => {
          show((prev) => !prev);
        }}
      >
        <div className="p-4">
          <div className="font-bold">{match.win ? "승리" : "패배"}</div>
          <div>
            {Math.floor(match.gameLength / 60)}분 {match.gameLength % 60}초
          </div>
          <div title={new Date(match.gameStartTime).toLocaleString()}>
            {getRelativeTime(match.gameStartTime)}
          </div>
        </div>
        <div>
          <Champion
            championId={match.championId}
            className="w-16 h-16"
          ></Champion>
        </div>
        <div className="w-32 m-2 text-center">
          <div>{getKDA(match)}</div>
          <div>
            {match.kills}/{match.deaths}/{match.assists} (
            {(((match.kills + match.assists) / myTeamKills) * 100).toFixed()}%)
          </div>
        </div>
        <div className="w-16 break-keep text-sm">
          {myTeam.map((m) => (
            <div key={m.summonerName}>
              <Champion
                championId={m.championId}
                className="w-4 h-4 inline-block m-0.5"
              ></Champion>
              {m.summonerName}
            </div>
          ))}
        </div>
        <div className="p-2">vs</div>
        <div className="w-16 break-keep text-sm">
          {otherTeam.map((m) => (
            <div key={m.summonerName}>
              <Champion
                championId={m.championId}
                className="w-4 h-4 inline-block m-0.5"
              ></Champion>
              {m.summonerName}
            </div>
          ))}
        </div>
      </div>
      {shown && (
        <div className="m-2 overflow-x-auto">
          <table className="text-center table-fixed w-[48rem] md:w-[60rem] text-xs md:text-base mx-auto">
            <thead>
              <tr>
                <th className="p-1 w-10"></th>
                <th className="p-1 w-18 md:w-24"></th>
                <th className="p-1 w-6 md:w-8">Lv.</th>
                <th className="p-1 w-24 md:w-32">KDA</th>
                <th className="p-1 w-16 md:w-24">딜량</th>
                <th className="p-1 w-16 md:w-24">피해량</th>
                <th className="p-1 w-12 md:w-16">G</th>
                <th className="p-1 w-10 md:w-14">CS</th>
                <th className="p-1 w-12 md:w-16">와드</th>
                <th className="p-1 w-10 md:w-12">VS</th>
                <th className="p-1 w-52">아이템</th>
                <th className="p-1 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {myTeam.map((m) => (
                <PlayerItem
                  key={m.summonerName}
                  match={m}
                  totalKills={myTeamKills}
                  maxDamagesDealt={maxDamagesDealt}
                  maxDamagesTaken={maxDamagesTaken}
                ></PlayerItem>
              ))}
              <tr>
                <td colSpan={11}>vs</td>
              </tr>
              {otherTeam.map((m) => (
                <PlayerItem
                  key={m.summonerName}
                  match={m}
                  totalKills={otherTeamKills}
                  maxDamagesDealt={maxDamagesDealt}
                  maxDamagesTaken={maxDamagesTaken}
                ></PlayerItem>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
