import React, { useState } from "react";
import {
  Await,
  Link,
  LoaderFunctionArgs,
  defer,
  useLoaderData,
} from "react-router-dom";
import { TooltipWrapper } from "react-tooltip";
import Links from "./Links";
import RankedPosition from "./RankedPosition";
import { getTeam } from "../team";
import PLAYERS from "../data/players.json";

type Streams = {
  [name: string]: {
    title: string;
    game: string;
    thumbnail_url: string;
  };
};

export async function loader({ request }: LoaderFunctionArgs) {
  const params = new URLSearchParams();
  for (const p of Object.values(PLAYERS)) {
    params.append("user_login", p.twitchId);
  }
  return defer({
    streams: fetch(`https://api.twgg.workers.dev/streams?${params}`, {
      signal: request.signal,
    }).then((r) => r.json()),
  });
}

export default function Index() {
  const [multi, setMulti] = useState<Set<string>>(new Set());
  const { streams } = useLoaderData() as { streams: Promise<Streams> };
  return (
    <>
      <div className="mt-2">
        <a
          href={`https://multitwitch.tv/${Array.from(multi).join("/")}`}
          className={`inline-block px-3 py-2 m-1 rounded-lg text-white ${
            multi.size
              ? "bg-violet-500 hover:bg-violet-700"
              : "bg-violet-200 pointer-events-none"
          }`}
          target="_blank"
          rel="noreferrer noopener"
        >
          multitwitch.tv에서 같이 보기
        </a>
        <a
          href={`https://multistre.am/${Array.from(multi).join("/")}`}
          className={`inline-block px-3 py-2 m-1 rounded-lg text-white ${
            multi.size && multi.size < 9
              ? "bg-violet-500 hover:bg-violet-700"
              : "bg-violet-200 pointer-events-none"
          }`}
          target="_blank"
          rel="noreferrer noopener"
        >
          multistre.am에서 같이 보기
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1 m-1">
        {Object.entries(PLAYERS).map(([name, data]) => (
          <div
            key={name}
            className={`flex flex-col items-center rounded-md p-2 ${
              getTeam(name).bgColor
            }`}
          >
            <Link to={data.pos !== "coach" ? name : "#"}>
              <img
                className="w-24 h-24 rounded-lg m-2"
                src={data.profile}
                alt={name}
                title={name}
              ></img>
            </Link>
            <Link
              to={data.pos !== "coach" ? name : "#"}
              className="text-xl font-bold"
            >
              {name}
            </Link>
            {data.pos !== "coach" && (
              <div>
                <RankedPosition
                  className="w-4 h-4 inline-block mr-1"
                  tier={data.tier}
                  pos={data.pos}
                ></RankedPosition>
                <span className="align-middle">{data.lolName}</span>
              </div>
            )}
            <Links
              data={data}
              className="p-0.5"
              childClassName="h-4 inline-block m-0.5"
            ></Links>
            <div className="p-1 text-sm text-gray-400">
              <label>
                <input
                  type="checkbox"
                  className="mr-1"
                  name={data.twitchId}
                  checked={multi.has(data.twitchId)}
                  onChange={({ target }) => {
                    setMulti((old) => {
                      const newSet = new Set(old);
                      if (target.checked) {
                        newSet.add(target.name);
                      } else {
                        newSet.delete(target.name);
                      }
                      return newSet;
                    });
                  }}
                ></input>
                <React.Suspense fallback={"방송을 가져오는 중"}>
                  <Await resolve={streams} errorElement={"오류가 발생했습니다"}>
                    {(streams: Streams) =>
                      streams[data.twitchId] ? (
                        <TooltipWrapper
                          html={`<img class="w-80 aspect-video" src="${streams[
                            data.twitchId
                          ].thumbnail_url.replace(
                            "{width}x{height}",
                            "440x248",
                          )}" alt="Twitch"></img>`}
                        >
                          <span className="text-black">
                            {streams[data.twitchId].title}
                            {streams[data.twitchId].game
                              ? ` (${streams[data.twitchId].game})`
                              : ""}
                          </span>
                        </TooltipWrapper>
                      ) : (
                        <>방송 중이 아닙니다</>
                      )
                    }
                  </Await>
                </React.Suspense>
              </label>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
