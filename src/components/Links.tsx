import twitch from "../icon/twitch.svg";
import youtube from "../icon/youtube.svg";
import squareYoutube from "../icon/square-youtube.svg";
import cafe from "../icon/cafe.svg";
import tgd from "../icon/tgd.svg";

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

type LinksProps = {
  data: {
    [key in keyof typeof LINKS]?: string;
  };
  className: string;
  childClassName: string;
};

export default function Links({ data, className, childClassName }: LinksProps) {
  return (
    <div className={className}>
      {Object.entries(LINKS).map(
        ([k, v]) =>
          k in data && (
            <a
              key={k}
              href={`${v.url}${data[k as keyof typeof data]}`}
              target="_blank"
              rel="noreferrer noopener"
              title={v.name}
            >
              <img src={v.logo} className={childClassName} alt={v.name}></img>
            </a>
          )
      )}
    </div>
  );
}
