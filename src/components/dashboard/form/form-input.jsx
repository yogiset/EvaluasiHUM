import { Input } from "@/components/ui/input";

export const FormInput = ({
  label,
  id,
  placeholder,
  defaultValue,
  type,
  onChange,
}) => {
  return (
    <div className="w-full space-y-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <Input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
};
