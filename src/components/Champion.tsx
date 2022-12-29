import CHAMPIONS from "../data/champions.json";

type ChampionProps = {
  championId: string | number;
  className: string;
  showName?: boolean;
};

export default function Champion(props: ChampionProps) {
  const champion = CHAMPIONS[props.championId as keyof typeof CHAMPIONS];
  const img = (
    <img
      className={props.className}
      src={`https://ddragon.leagueoflegends.com/cdn/12.23.1/img/champion/${champion.id}.png`}
      alt={champion.name}
      title={champion.name}
    ></img>
  );
  return props.showName ? (
    <div>
      {img}
      {champion.name}
    </div>
  ) : (
    img
  );
}
