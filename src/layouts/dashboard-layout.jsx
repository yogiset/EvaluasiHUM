import { Outlet } from "react-router-dom";
import { AdminNav } from "@/components/dashboard/admin-nav";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

const DashboardLayout = () => {
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
