import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const SearchBar = ({ onSubmit, onChange, placeholder }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full md:w-max h-min flex border-2 border-slate-500 rounded my-2"
    >
      <Input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full md:w-80 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button type="submit" variant="ghost" className="px-2 rounded-sm">
        <Search className="w-6 h-6" />
      </Button>
    </form>
  );
};
