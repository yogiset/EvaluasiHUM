import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const FormInput = ({
  form,
  label,
  id,
  placeholder,
  defaultValue,
  type,
}) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="w-full space-y-2">
          <FormLabel htmlFor={id} className="font-semibold">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              id={id}
              name={id}
              placeholder={placeholder}
              defaultValue={defaultValue}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
