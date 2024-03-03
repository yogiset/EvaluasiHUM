import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  UsersRound,
  MessageCircleQuestion,
  ClipboardList,
  Settings,
  LockKeyhole,
  UserCog,
} from "lucide-react";
import logo from "@/assets/hum-transparent-logo.png";
import { cn } from "@/lib/utils";

const navigations = [
  { title: "Home", path: "/dashboard/home", icon: <Home /> },
  {
    title: "Evaluasi",
    path: "/dashboard/evaluasi",
    icon: <ClipboardList />,
  },
  { title: "Karyawan", path: "/dashboard/karyawan", icon: <UsersRound /> },
  // { title: "Rule", path: "/dashboard/rule", icon: <BookMarked /> },
  {
    title: "Pertanyaan",
    path: "/dashboard/pertanyaan",
    icon: <MessageCircleQuestion />,
  },
  { title: "User", path: "/dashboard/users", icon: <UsersRound /> },
  { title: "Akun", path: "/dashboard/akun", icon: <UserCog /> },
];

export const AdminSidebar = ({ onClose }) => {
  const { role } = useAuth(); // get user data
  const adminPath = [
    "/dashboard/karyawan",
    "/dashboard/pertanyaan",
    "/dashboard/users",
  ];

  return (
    <>
      <div className="w-full h-full overflow-y-auto relative px-2 pt-2 pb-10">
        <div className="flex items-center gap-x-4 mb-10">
          <img src={logo} alt="logo" width={50} height={50} />
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <ul className="space-y-2">
          {navigations.map((nav, index) => (
            <li
              key={index}
              className={cn(
                role !== "ADMIN" && adminPath.includes(nav.path) && "hidden"
              )}
            >
              <NavLink
                to={nav.path}
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
                {role !== "ADMIN" && adminPath.includes(nav.path) && (
                  <LockKeyhole />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Link
        to="#"
        className="w-max md:w-full absolute bottom-0 flex p-2 bg-blue-950 hover:bg-white/15 rounded"
      >
        <Settings className="mr-2" /> Settings
      </Link>
    </>
  );
};
