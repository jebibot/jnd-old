import champions from "../data/champions.json";

type ChampionProps = {
  championId: string | number;
  className: string;
  showName?: boolean;
};

export default function Champion(props: ChampionProps) {
  const champion = champions[props.championId as keyof typeof champions];
  return props.showName ? (
    <div>
      <img
        className={props.className}
        src={`https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champion.id}.png`}
        alt={champion.name}
        title={champion.name}
      ></img>
      {champion.name}
    </div>
  ) : (
    <img
      className={props.className}
      src={`https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champion.id}.png`}
      alt={champion.name}
      title={champion.name}
    ></img>
  );
}
