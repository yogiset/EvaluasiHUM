import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="text-xl font-semibold">Loading</p>
    </div>
  );
};
