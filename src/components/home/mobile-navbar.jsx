import { NavLink } from "react-router-dom";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export const MobileNavbar = ({ onClose, open, routes }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <h1 className="font-semibold text-xl">Menu</h1>
        <hr />
        <nav className="flex flex-col gap-y-4 mt-4">
          <ul className="flex flex-col gap-y-4">
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
          <Button variant="sky" className="w-fit">
            <UserRound className="w-4 h-4 mr-2" />
            Login
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
