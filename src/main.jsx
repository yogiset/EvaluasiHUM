import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "@/components/error-page";
import Root from "@/routes/root";
import UsersForm from "./routes/users-form";

import "./index.css";
import EvaluationPage from "./routes/evaluations";
import ResultsPage from "./routes/results-page";

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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
