import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRound, AlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import { MobileNavbar } from "./mobile-navbar";

const routes = [
  { path: "/", title: "BERANDA" },
  { path: "/about", title: 'APA ITU "SEH"?' },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const { id } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // open the sheet in mobile version
  function onOpen() {
    setIsOpen(true);
  }

  // close the sheet in mobile version
  function onClose() {
    setIsOpen(false);
  }
  return (
    <header className="w-full bg-white shadow flex justify-between items-center py-4 px-2 fixed top-0 z-50">
      <h1 className="font-bold text-xl md:text-2xl">SISTEM EVALUASI HUM</h1>
      <nav className="hidden sm:flex items-center gap-x-4">
        <ul className="flex items-center gap-x-4 font-medium">
          {routes.map((route, index) => (
            <li key={index}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  isActive
                    ? "hover:text-sky-500 transition duration-300 text-sky-500"
                    : "hover:text-sky-500 transition duration-300"
                }
                end
              >
                {route.title}
              </NavLink>
            </li>
          ))}
        </ul>
        <Button variant="sky" onClick={() => navigate("/adm-login")}>
          <UserRound className="w-4 h-4 mr-2" />
          {id ? "Dashboard" : "Login"}
        </Button>
      </nav>

      {/* mobile navigation */}
      <Button variant="ghost" className="sm:hidden" onClick={onOpen}>
        <AlignJustify />
      </Button>

      <MobileNavbar onClose={onClose} open={isOpen} routes={routes} />
    </header>
  );
};
