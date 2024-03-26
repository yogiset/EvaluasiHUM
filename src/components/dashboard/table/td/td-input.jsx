import { Input } from "@/components/ui/input";

export const TdInput = ({ id, value, desc, isEdit, type, onChange }) => {
  return (
    <td className="border border-slate-300 p-2">
      {isEdit ? (
        <Input id={id} type={type} defaultValue={value} onChange={onChange} />
      ) : (
        <p>
          {value} {desc}
        </p>
      )}
    </td>
  );
};
