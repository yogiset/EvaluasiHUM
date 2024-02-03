import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import ErrorPage from "@/components/error-page";
import Root from "@/routes/root";
import UsersForm from "./routes/users-form";

import "./index.css";
import EvaluationPage from "./routes/evaluations";
import ResultsPage from "./routes/results-page";
import Login from "./routes/admin/login-page";
import DashboardLayout from "./layouts/dashboard-layout";
import EvaluasiPage from "./routes/admin/evaluasi-page";
import HomeDashboard from "./routes/admin/home-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/evaluasi/user-form",
    element: <UsersForm />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/evaluasi",
    element: <EvaluationPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/results",
    element: <ResultsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/adm-login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard/",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <HomeDashboard />,
      },
      {
        path: "evaluasi",
        element: <EvaluasiPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <RouterProvider router={router} />
    </CookiesProvider>
  </React.StrictMode>
);
