import { useState } from "react";
import { useCookies } from "react-cookie";
import { Bell, AlignJustify, UserCog, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import userImage from "@/assets/hum-transparent-logo.png";
import { useAuth } from "@/lib/useAuth";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";

export const AdminNav = () => {
  const { sub } = useAuth();
  const [open, setOpen] = useState(false); // State to open the sheet in mobile version
  const { pathname } = useLocation();

  function onClose() {
    setOpen(false);
  }
  return (
    <div className="w-full flex justify-between items-center sticky top-0 shadow p-2">
      <div className="flex items-center gap-x-2">
        {/* mobile version start */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen(true)}
          className="md:hidden"
        >
          <AlignJustify />
        </Button>

        <SidebarSheet open={open} onClose={onClose} />

        <Separator orientation="vertical" className="md:hidden h-10" />
        {/* mobile version end */}

        <h1 className="text-xl font-semibold">
          {pathname.split("/")[2].toUpperCase()}
        </h1>
      </div>
      <div className="flex items-center gap-0 md:gap-2">
        <Button variant="ghost" size="sm">
          <Bell />
        </Button>
        <UserPopover sideOffset={10}>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <img src={userImage} alt="img" width={30} height={30} />
            <p className="hidden md:inline font-medium">{sub}</p>
          </Button>
        </UserPopover>
      </div>
    </div>
  );
};

const UserPopover = ({ children, sideOffset }) => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  function handleLogout() {
    removeCookie("token");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={sideOffset}>
        <ul className="space-y-2 text-lg font-medium">
          <li className="hover:bg-neutral-300 rounded p-2">
            <Link to="/dashboard/akun" className="w-full flex">
              <UserCog className="mr-2" />
              Akun
            </Link>
          </li>
          <li className="hover:bg-neutral-300 rounded p-2">
            <Button
              onClick={handleLogout}
              className="w-full h-full flex justify-start text-black text-lg bg-transparent hover:bg-transparent p-0 m-0"
            >
              <LogOut className="mr-2" />
              Keluar
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export const SidebarSheet = ({ open, onClose }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="bg-blue-950 text-white md:hidden" side="left">
        <AdminSidebar onClose={onClose} />
      </SheetContent>
    </Sheet>
  );
};
