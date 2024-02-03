import { NavLink, Link } from "react-router-dom";
import {
  Home,
  UsersRound,
  UserRound,
  MessageCircleQuestion,
  ClipboardList,
  BookMarked,
  Settings,
  LockKeyhole,
} from "lucide-react";
import logo from "@/assets/hum-transparent-logo.png";

const navigations = [
  { title: "Home", path: "/dashboard/home", icon: <Home /> },
  {
    title: "Evaluasi",
    path: "/dashboard/evaluasi",
    icon: <ClipboardList />,
  },
  { title: "Karyawan", path: "/karyawan", icon: <UsersRound /> },
  { title: "Rule", path: "/rule", icon: <BookMarked /> },
  { title: "Pertanyaan", path: "/pertanyaan", icon: <MessageCircleQuestion /> },
  { title: "User", path: "/user", icon: <UserRound /> },
];

export const AdminSidebar = ({ onClose }) => {
  const user = "user";
  const adminPath = ["/rule", "/karyawan", "/pertanyaan"];
  return (
    <div className="w-full h-full overflow-y-auto relative">
      <div className="flex items-center gap-x-4 mb-10">
        <img src={logo} alt="logo" width={50} height={50} />
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <ul className="space-y-2">
        {navigations.map((nav, index) => (
          <li key={index}>
            <NavLink
              to={
                user !== "admin" && adminPath.includes(nav.path)
                  ? "/forbidden"
                  : nav.path
              }
              className={({ isActive }) =>
                isActive
                  ? "w-full flex justify-between p-2 bg-white/15 hover:bg-white/15 rounded transition duration-200"
                  : "w-full flex justify-between p-2  hover:bg-white/15 rounded transition duration-200"
              }
              onClick={onClose}
            >
              <div className="flex gap-2">
                {nav.icon}
                {nav.title}
              </div>
              {user !== "admin" && adminPath.includes(nav.path) && (
                <LockKeyhole />
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      <Link
        to="#"
        className="w-full absolute bottom-0 flex p-2 hover:bg-white/15 rounded"
      >
        <Settings className="mr-2" /> Settings
      </Link>
    </div>
  );
};
