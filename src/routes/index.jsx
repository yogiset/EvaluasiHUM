import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "@/layouts/dashboard-layout";
import ErrorPage from "@/components/error-page";

import Login from "./admin/login-page";
import Root from "./user/root";
import UsersForm from "./user/users-form";
import EvaluationPage from "./user/evaluations";
import ResultsPage from "./user/results-page";
import EvaluasiPage from "./admin/evaluasi-page";
import DetailEvaluasiPage from "./admin/detail-evaluasi-page";
import HomeDashboard from "./admin/home-page";
import KaryawanPage from "./admin/karyawan-page";
import RulePage from "./admin/rule-page";
import PertanyaanPage from "./admin/pertanyaan-page";
import UserPage from "./admin/user-page";
import DetailKaryawanPage from "./admin/detail-karyawan-page";
import DetailUserPage from "./admin/detail-user-page";
import AccountPage from "./admin/account-page";

export const router = createBrowserRouter([
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
      {
        path: "evaluasi/:evId",
        element: <DetailEvaluasiPage />,
      },
      {
        path: "karyawan",
        element: <KaryawanPage />,
      },
      {
        path: "karyawan/:karId",
        element: <DetailKaryawanPage />,
      },
      {
        path: "rule",
        element: <RulePage />,
      },
      {
        path: "Pertanyaan",
        element: <PertanyaanPage />,
      },
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "users/:userId",
        element: <DetailUserPage />,
      },
      {
        path: "akun",
        element: <AccountPage />,
      },
    ],
  },
]);
