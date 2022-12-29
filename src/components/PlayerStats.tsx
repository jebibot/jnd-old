import { TooltipWrapper } from "react-tooltip";
import Champion from "./Champion";
import { getTeam } from "../team";
import { getKDA } from "../utils";
import { MatchData } from "../types";

import ITEMS from "../data/items.json";

import twitch from "../icon/twitch.svg";
import youtube from "../icon/youtube.svg";

const NumberFormat = new Intl.NumberFormat();

type PlayerStatsProps = {
  match: MatchData;
  totalKills: number;
  maxDamagesDealt: number;
  maxDamagesTaken: number;
};

export default function PlayerStats(props: PlayerStatsProps) {
  const match = props.match;
  const isDetailed = match.totalDamageTaken !== 0;
  const getPerMinute = (val: number) =>
    ((val / match.gameLength) * 60).toFixed(1);
  return (
    <tr key={match.summonerName}>
      <td className="p-1">
        <Champion championId={match.championId} className="w-8 h-8"></Champion>
      </td>
      <td className={`p-1 font-medium ${getTeam(match.summonerName).color}`}>
        {match.summonerName}
      </td>
      <td className="p-1">{match.level}</td>
      <td className="p-1">
        <div>{getKDA(match)}</div>
        <div>
          {match.kills}/{match.deaths}/{match.assists} (
          {(((match.kills + match.assists) / props.totalKills) * 100).toFixed()}
          %)
        </div>
      </td>
      <td className="p-1">
        <TooltipWrapper
          html={`${
            isDetailed
              ? `총 딜량: ${NumberFormat.format(match.totalDamageDealt)}<br />`
              : ""
          }${getPerMinute(match.totalDamageDealtToChampions)} DPM<br />${(
            match.totalDamageDealtToChampions / match.goldEarned
          ).toFixed(2)} DPG`}
        >
          {NumberFormat.format(match.totalDamageDealtToChampions)}
        </TooltipWrapper>
        <div className="w-12 md:w-16 h-2">
          <div
            className="h-2 bg-red-500"
            style={{
              width: `${(
                (match.totalDamageDealtToChampions / props.maxDamagesDealt) *
                100
              ).toFixed(2)}%`,
            }}
          ></div>
        </div>
      </td>
      {isDetailed && (
        <td className="p-1">
          <div>{NumberFormat.format(match.totalDamageTaken)}</div>
          <div className="w-12 md:w-16 h-2">
            <div
              className="h-2 bg-orange-500"
              style={{
                width: `${(
                  (match.totalDamageTaken / props.maxDamagesTaken) *
                  100
                ).toFixed(2)}%`,
              }}
            ></div>
          </div>
        </td>
      )}
      <td className="p-1">
        <TooltipWrapper content={`${getPerMinute(match.goldEarned)} GPM`}>
          {NumberFormat.format(match.goldEarned)}
        </TooltipWrapper>
      </td>
      {isDetailed && (
        <>
          <td className="p-1">
            <div>{match.minionsKilled}</div>
            <div>({getPerMinute(match.minionsKilled)})</div>
          </td>
          <td className="p-1">
            {match.wardPlaced} / {match.wardKilled}
          </td>
          <td className="p-1">
            <TooltipWrapper content={`${getPerMinute(match.visionScore)} VSPM`}>
              {NumberFormat.format(match.visionScore)}
            </TooltipWrapper>
          </td>
          <td className="p-1">
            {match.items.map((i: number) => {
              if (i <= 0) {
                return null;
              }
              const item = ITEMS[i.toString() as keyof typeof ITEMS];
              return (
                <img
                  key={i}
                  className="w-6 h-6 inline-block mx-0.5"
                  src={`https://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${i}.png`}
                  alt={item.name}
                  title={item.name}
                ></img>
              );
            })}
          </td>
        </>
      )}
      <td className="p-1">
        {match.replayUrl && (
          <a href={match.replayUrl} target="_blank" rel="noreferrer noopener">
            <img
              className="w-6"
              src={
                match.replayUrl.startsWith("https://www.twitch.tv/")
                  ? twitch
                  : youtube
              }
              alt="다시보기"
              title="다시보기"
            ></img>
          </a>
        )}
      </td>
    </tr>
  );
}
