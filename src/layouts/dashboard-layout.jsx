import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminNav } from "@/components/dashboard/admin-nav";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { token } = cookies;

  useEffect(() => {
    if (!token) return navigate("/adm-login");
  }, [token, navigate]);

  return (
    <main className="w-full h-screen overflow-hidden flex">
      <div
        id="sidebar"
        className="hidden md:inline w-[400px] h-screen bg-blue-950 text-white p-2"
      >
        <AdminSidebar />
      </div>
      <div className="w-full">
        <AdminNav />
        <div className="pl-2 h-full">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
