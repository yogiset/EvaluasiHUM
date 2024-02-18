import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const FormSelect = ({ form, label, id, selectItems, placeholder }) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="w-full space-y-2">
          <FormLabel htmlFor={id} className="font-semibold">
            {label}
          </FormLabel>
          <Select
            id={id}
            name={id}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectItems.map((position, index) => (
                <SelectItem key={index} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
