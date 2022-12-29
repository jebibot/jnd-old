type RankedPositionProps = {
  className: string;
  tier: string;
  pos: string;
};

export default function RankedPosition({
  className,
  tier,
  pos,
}: RankedPositionProps) {
  return (
    <img
      className={className}
      src={`/images/ranked-positions/Position_${tier}-${pos}.png`}
      alt={`${tier} ${pos}`}
      title={`${tier} ${pos}`}
    ></img>
  );
}
