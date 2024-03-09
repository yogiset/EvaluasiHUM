import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DatePicker = ({ date, onSelect }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd MMMM yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto h-[300px] overflow-y-scroll p-0">
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={onSelect}
          captionLayout="dropdown-buttons"
          fromYear={1990}
          toYear={new Date().getFullYear()}
          classNames={{
            caption_dropdowns: "flex font-semibold gap-x-2",
            vhidden: "hidden",
            caption_label: "hidden",
            dropdown: "hover:bg-sky-50 py-0.5 rounded cursor-pointer",
          }}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
