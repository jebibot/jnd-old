import Champion from "./Champion";
import { getKDA } from "../utils";
import { MatchData } from "../types";

import items from "../data/items.json";

import twitch from "../icon/twitch.svg";
import youtube from "../icon/youtube.svg";

const NumberFormat = new Intl.NumberFormat();

type PlayerItemProps = {
  match: MatchData;
  totalKills: number;
  maxDamagesDealt: number;
  maxDamagesTaken: number;
};

export default function PlayerItem(props: PlayerItemProps) {
  const m = props.match;
  return (
    <tr key={m.summonerName}>
      <td className="p-1">
        <Champion championId={m.championId} className="w-8 h-8"></Champion>
      </td>
      <td className="p-1">{m.summonerName}</td>
      <td className="p-1">{m.level}</td>
      <td className="p-1">
        <div>
          <div>{getKDA(m)}</div>
          <div>
            {m.kills}/{m.deaths}/{m.assists} (
            {(((m.kills + m.assists) / props.totalKills) * 100).toFixed()}
            %)
          </div>
        </div>
      </td>
      <td className="p-1">
        <div>
          <div title={`총 피해량: ${NumberFormat.format(m.totalDamageDealt)}`}>
            {NumberFormat.format(m.totalDamageDealtToChampions)}
          </div>
          <div className="w-12 md:w-16 h-2">
            <div
              className="h-2 bg-red-500"
              style={{
                width: `${(
                  (m.totalDamageDealtToChampions / props.maxDamagesDealt) *
                  100
                ).toFixed(2)}%`,
              }}
            ></div>
          </div>
        </div>
      </td>
      <td className="p-1">
        <div>
          <div>{NumberFormat.format(m.totalDamageTaken)}</div>
          <div className="w-12 md:w-16 h-2">
            <div
              className="h-2 bg-orange-500"
              style={{
                width: `${(
                  (m.totalDamageTaken / props.maxDamagesTaken) *
                  100
                ).toFixed(2)}%`,
              }}
            ></div>
          </div>
        </div>
      </td>
      <td className="p-1">{NumberFormat.format(m.goldEarned)}</td>
      <td className="p-1">
        {m.minionsKilled} ({((m.minionsKilled / m.gameLength) * 60).toFixed(1)})
      </td>
      <td className="p-1">
        {m.wardPlaced} / {m.wardKilled}
      </td>
      <td className="p-1">{m.visionScore}</td>
      <td className="p-1">
        {m.items.map((i: number) => {
          if (i <= 0) {
            return null;
          }
          const item = items[i as unknown as keyof typeof items];
          return (
            <img
              key={i}
              className="w-6 h-6 inline-block mx-0.5"
              src={`http://ddragon.leagueoflegends.com/cdn/12.23.1/img/item/${i}.png`}
              alt={item.name}
              title={item.name}
            ></img>
          );
        })}
      </td>
      <td className="p-1">
        {m.replayUrl && (
          <a href={m.replayUrl} target="_blank" rel="noreferrer noopener">
            <img
              className="w-6"
              src={
                m.replayUrl.startsWith("https://www.twitch.tv/")
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
