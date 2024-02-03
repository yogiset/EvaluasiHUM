import { useState } from "react";
import { Bell, AlignJustify } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import userImage from "@/assets/hum-transparent-logo.png";
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
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  function onClose() {
    setOpen(false);
  }
  return (
    <div className="w-full flex justify-between items-center sticky top-0 shadow p-2">
      <div className="flex items-center gap-x-2">
        {/* mobile sidebar */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen(true)}
          className="md:hidden"
        >
          <AlignJustify />
        </Button>

        {/* <SidebarSheet open={open} onClose={onClose} /> */}
        <SidebarSheet open={open} onClose={onClose} />

        <Separator orientation="vertical" className="md:hidden h-10" />
        <h1 className="text-xl font-semibold">
          {pathname.split("/").reverse()[0].toUpperCase()}
        </h1>
      </div>
      <div className="flex items-center gap-0 md:gap-2">
        <Button variant="ghost">
          <Bell />
        </Button>
        <UserPopover sideOffset={10}>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <img src={userImage} alt="img" width={30} height={30} />
            <p className="hidden md:inline font-medium">Asep Syaipulloh</p>
          </Button>
        </UserPopover>
      </div>
    </div>
  );
};

const UserPopover = ({ children, sideOffset }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={sideOffset}>
        <ul className="space-y-2">
          <li className="hover:bg-neutral-300 rounded p-2">
            <Link to="#" className="w-full">
              User settings
            </Link>
          </li>
          <li className="hover:bg-neutral-300 rounded p-2">
            <Link to="#" className="w-full">
              Sign out
            </Link>
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
