import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { CookiesProvider } from "react-cookie";
import { QueryProvider } from "@/providers/query-provider";
import { SonnerProvider } from "@/providers/sonner-provider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <QueryProvider>
        <SonnerProvider>
          <RouterProvider router={router} />
        </SonnerProvider>
      </QueryProvider>
    </CookiesProvider>
  </React.StrictMode>
);
