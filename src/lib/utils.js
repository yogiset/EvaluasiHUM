import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export function calcPercent(target, achieved) {
//   if (target == 0 && achieved == 0) return 0;
//   return ~~(achieved / (target / 100));
// }
