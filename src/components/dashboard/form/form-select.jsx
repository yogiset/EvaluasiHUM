import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const FormSelect = ({
  label,
  id,
  onValueChange,
  selectItems,
  placeholder,
}) => {
  return (
    <div className="w-full space-y-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <Select id={id} name={id} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {selectItems.map((position, index) => (
            <SelectItem key={index} value={position}>
              {position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
