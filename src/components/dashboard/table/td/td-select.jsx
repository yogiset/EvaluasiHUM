import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const TdSelect = ({
  id,
  selectItems,
  value,
  placeholder,
  isEdit,
  onValueChange,
}) => {
  return (
    <td className="border border-slate-300 p-2">
      {isEdit ? (
        <Select id={id} name={id} onValueChange={onValueChange}>
          <SelectTrigger className="w-[280px]">
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
      ) : (
        <p>{value}</p>
      )}
    </td>
  );
};
