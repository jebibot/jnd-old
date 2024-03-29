import { useState } from "react";
import { TooltipWrapper } from "react-tooltip";
import Champion from "./Champion";
import PlayerStats from "./PlayerStats";
import { getTeam } from "../team";
import { getKDA, getRelativeTime } from "../utils";
import { MatchData } from "../types";

type MatchProps = {
  match: MatchData;
  data: MatchData[];
};

const MULTI_KILL: { [num: number]: string } = {
  2: "더블킬",
  3: "트리플킬",
  4: "쿼드라킬",
  5: "펜타킬",
};

export default function Match({ match, data }: MatchProps) {
  const [expanded, setExpanded] = useState(false);
  const myTeam = data.filter((d) => d.teamId === match.teamId);
  const otherTeam = data.filter((d) => d.teamId !== match.teamId);

  const myTeamKills = myTeam.reduce((prev, cur) => {
    prev += cur.kills;
    return prev;
  }, 0);
  const otherTeamKills = otherTeam.reduce((prev, cur) => {
    prev += cur.kills;
    return prev;
  }, 0);
  const maxDamagesDealt = Math.max(
    ...data.map((m) => m.totalDamageDealtToChampions),
  );
  const maxDamagesTaken = Math.max(...data.map((m) => m.totalDamageTaken));
  const isDetailed = match.totalDamageTaken !== 0;

  return (
    <div
      className={`rounded-lg p-2 m-2 ${
        match.win ? "bg-blue-100" : "bg-red-100"
      }`}
    >
      <div
        className="flex flex-row items-center justify-center m-2 cursor-pointer"
        onClick={() => {
          setExpanded((prev) => !prev);
        }}
      >
        <div className="p-2 sm:p-4">
          <div className="font-bold">{match.win ? "승리" : "패배"}</div>
          <div
            className={
              isDetailed
                ? match.teamId
                  ? "text-blue-900"
                  : "text-red-900"
                : ""
            }
          >
            {Math.floor(match.gameLength / 60)}분 {match.gameLength % 60}초
          </div>
          <TooltipWrapper
            content={new Date(match.gameStartTime).toLocaleString()}
          >
            {getRelativeTime(match.gameStartTime)}
          </TooltipWrapper>
        </div>
        <div>
          <Champion
            championId={match.championId}
            className="w-16 h-16"
          ></Champion>
        </div>
        <div className="w-32 m-2 text-center">
          <div className="font-medium">{getKDA(match)}</div>
          <div>
            {match.kills}/{match.deaths}/{match.assists} (
            {(((match.kills + match.assists) / myTeamKills) * 100).toFixed()}%)
          </div>
          {MULTI_KILL[match.multiKill] && (
            <div className="w-fit px-1 py-0.5 mx-auto my-0.5 rounded-lg bg-orange-500 text-white text-sm">
              {MULTI_KILL[match.multiKill]}
            </div>
          )}
        </div>
        <div className="w-16 break-keep text-sm">
          {myTeam.map((m) => (
            <div
              key={m.summonerName}
              className={`font-medium ${getTeam(m.summonerName).color}`}
            >
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
            <div
              key={m.summonerName}
              className={`font-medium ${getTeam(m.summonerName).color}`}
            >
              <Champion
                championId={m.championId}
                className="w-4 h-4 inline-block m-0.5"
              ></Champion>
              {m.summonerName}
            </div>
          ))}
        </div>
      </div>
      {expanded && (
        <div className="m-2 overflow-x-auto">
          <table
            className={`text-center table-fixed w-0 mx-auto text-xs md:text-base`}
          >
            <thead>
              <tr>
                <th className="p-1 w-10"></th>
                <th className="p-1 w-10 md:w-16"></th>
                <th className="p-1 w-6 md:w-8">Lv.</th>
                <th className="p-1 w-24 md:w-32">KDA</th>
                <th className="p-1 w-16 md:w-24">딜량</th>
                {isDetailed && <th className="p-1 w-16 md:w-24">피해량</th>}
                <th className="p-1 w-12 md:w-16">G</th>
                {isDetailed && (
                  <>
                    <th className="p-1 w-10 md:w-14">CS</th>
                    <th className="p-1 w-12 md:w-16">와드</th>
                    <th className="p-1 w-10 md:w-12">VS</th>
                    <th className="p-1 w-52">아이템</th>
                  </>
                )}
                <th className="p-1 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {myTeam.map((m) => (
                <PlayerStats
                  key={m.summonerName}
                  match={m}
                  totalKills={myTeamKills}
                  maxDamagesDealt={maxDamagesDealt}
                  maxDamagesTaken={maxDamagesTaken}
                ></PlayerStats>
              ))}
              <tr>
                <td colSpan={isDetailed ? 12 : 7}>
                  {myTeamKills} <span className="font-bold">vs</span>{" "}
                  {otherTeamKills}
                </td>
              </tr>
              {otherTeam.map((m) => (
                <PlayerStats
                  key={m.summonerName}
                  match={m}
                  totalKills={otherTeamKills}
                  maxDamagesDealt={maxDamagesDealt}
                  maxDamagesTaken={maxDamagesTaken}
                ></PlayerStats>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
