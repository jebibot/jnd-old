import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Index, { loader as indexLoader } from "./components/Index";
import Overview from "./components/Overview";
import Root from "./components/Root";
import Stats from "./components/Stats";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    id: "root",
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index />, loader: indexLoader },
          { path: "overview", element: <Overview /> },
          { path: ":player", element: <Stats /> },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

serviceWorkerRegistration.register();
