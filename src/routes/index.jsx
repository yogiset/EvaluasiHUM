import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "@/layouts/dashboard-layout";
import ErrorPage from "@/components/error-page";

import Login from "./admin/login-page";
import Root from "./user/root";
import UsersForm from "./user/users-form";
import HimpunanKriteriaPage from "./admin/himpunan-kriteria-page";
import BobotKriteriaPage from "./admin/bobot-kriteria-page";
import EvaluationPage from "./user/evaluations";
import ResultsPage from "./user/results-page";
import EvaluasiPage from "./admin/evaluasi-page";
import DetailEvaluasiPage from "./admin/detail-evaluasi-page";
import HomeDashboard from "./admin/home-page";
import KaryawanPage from "./admin/karyawan-page";
// import RulePage from "./admin/rule-page";
import CptPage from "./admin/cpt-page";
import SalesPage from "./admin/sales-page";
import PicosPage from "./admin/picos-page";
import DetailHimpunanKriteriaPage from "./admin/detail-himpunan-kriteria";
import DetailBobotKriteriaPage from "./admin/detail-bobot-kriteria";
import DetailPicosPage from "./admin/detail-picos-page";
import DetailCptPage from "./admin/detail-cpt-page";
import DetailSalesPage from "./admin/detail-sales-page";
import PertanyaanPage from "./admin/pertanyaan-page";
import UserPage from "./admin/user-page";
import DetailKaryawanPage from "./admin/detail-karyawan-page";
import DetailUserPage from "./admin/detail-user-page";
import AccountPage from "./admin/account-page";
import AddQuestionPage from "./admin/add-pertanyaan-page";
import DetailQuestionPage from "./admin/detail-pertanyaan-page";

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
      // {
      //   path: "rule",
      //   element: <RulePage />,
      // },
      {
        path: "sales",
        element: <SalesPage />,
      },
      {
        path: "picos",
        element: <PicosPage />,
      },
      {
        path: "picos/:picosId",
        element: <DetailPicosPage />,
      },
      {
        path: "himpunankriteria",
        element: <HimpunanKriteriaPage />,
      },
      {
        path: "himpunankriteria/:kriteriaId",
        element: <DetailHimpunanKriteriaPage />,
      },
      {
        path: "bobotkriteria",
        element: <BobotKriteriaPage />,
      },
      {
        path: "bobotkriteria/:bobotId",
        element: <DetailBobotKriteriaPage />,
      },
      {
        path: "cpt",
        element: <CptPage />,
      },
      {
        path: "cpt/:cptId",
        element: <DetailCptPage />,
      },
      {
        path: "sales/:salesId",
        element: <DetailSalesPage />,
      },
      {
        path: "pertanyaan",
        element: <PertanyaanPage />,
      },
      {
        path: "pertanyaan/add",
        element: <AddQuestionPage />,
      },
      {
        path: "pertanyaan/:questionId",
        element: <DetailQuestionPage />,
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
