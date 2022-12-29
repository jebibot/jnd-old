import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error | Response;

  return (
    <div>
      <div className="p-2 font-bold text-3xl">오류가 발생했습니다!</div>
      <div className="p-2">
        {"statusText" in error ? error.statusText : error.message}
      </div>
      <div className="p-2 font-bold">
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    </div>
  );
}
