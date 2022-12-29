import {
  LoaderFunctionArgs,
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Tooltip, TooltipProvider } from "react-tooltip";
import { TEAMS } from "../team";
import PLAYERS from "../data/players.json";

import "react-tooltip/dist/react-tooltip.css";
import { useEffect } from "react";

export function loader({ request }: LoaderFunctionArgs) {
  return fetch("https://jnd-data.s3.ap-northeast-2.amazonaws.com/data.json", {
    cache: "no-cache",
    signal: request.signal,
  });
}

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const playerKeys = Object.keys(PLAYERS);
  const player = decodeURIComponent(location.pathname.split("/")[1] || "");
  useEffect(() => {
    document.title = `${player || "홈"} | 2023 자낳대 시즌 1 전적`;
  }, [player]);

  return (
    <TooltipProvider>
      <div className="container mx-auto p-2">
        <select
          className="px-4 py-2.5 rounded-full border text-2xl"
          value={player}
          onChange={({ target }) => navigate(target.value)}
        >
          <option value="">홈</option>
          {TEAMS.map((team, i) => (
            <optgroup key={team.name} label={team.name} className={team.color}>
              {playerKeys.slice(6 * i, 6 * i + 5).map((name) => (
                <option key={name}>{name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <Outlet />
        <div className="text-center text-sm text-gray-500">
          결과에서 제외하거나 관전 리플레이가 필요하신 경우{" "}
          <a href="mailto:tjebibot@gmail.com">tjebibot@gmail.com</a>으로 문의
          부탁드립니다.
        </div>
        <div className="text-center text-xs text-gray-400">
          jnd.twitchgg.tv isn't endorsed by Riot Games and doesn't reflect the
          views or opinions of Riot Games or anyone officially involved in
          producing or managing Riot Games properties. Riot Games, and all
          associated properties are trademarks or registered trademarks of Riot
          Games, Inc.
        </div>
      </div>
      <div className="text-sm md:text-base">
        <Tooltip />
      </div>
      <ScrollRestoration />
    </TooltipProvider>
  );
}
