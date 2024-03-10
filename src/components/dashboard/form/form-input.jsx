import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const FormInput = ({ form, label, id, placeholder, type }) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="w-full space-y-2">
          <FormLabel className="font-semibold">{label}</FormLabel>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} required />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
