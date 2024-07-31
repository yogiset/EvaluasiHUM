import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';  // Adjust this path as necessary
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';  // Adjust this path as necessary

const CustomDropdownMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button onClick={() => setOpen(!open)} aria-haspopup="true" aria-expanded={open}>
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
        >
          <DropdownMenuItem asChild>
            <Link to="/path1" className="block px-4 py-2 text-sm text-gray-700">
              Item 1
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/path2" className="block px-4 py-2 text-sm text-gray-700">
              Item 2
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/path3" className="block px-4 py-2 text-sm text-gray-700">
              Item 3
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { CustomDropdownMenu }