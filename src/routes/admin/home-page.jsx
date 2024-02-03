import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

const boards = [
  { title: "Evaluasi", path: "/dashboard/evaluasi", bg: "bg-rose-400" },
  { title: "Karyawan", path: "/dashboard/karyawan", bg: "bg-sky-500" },
  { title: "Rule", path: "/dashboard/rule", bg: "bg-green-500" },
  { title: "Pertanyaan", path: "/dashboard/pertanyaan", bg: "bg-orange-500" },
];

const BoardList = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {boards.map((board, index) => (
        <Link
          key={index}
          to={board.path}
          className={cn(
            "group relative aspect-video rounded-sm w-full h-full p-2 overflow-hidden",
            board.bg
          )}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
          <p className="relative font-semibold text-white">{board.title}</p>
        </Link>
      ))}
    </div>
  );
};

const HomeDashboard = () => {
  return (
    <div className="w-full h-full">
      <div className="flex items-center p-4">
        <LayoutGrid className="mr-2" />
        <h1 className="text-2xl font-medium">Board</h1>
      </div>
      <div className="px-2 md:px-4">
        <BoardList />
      </div>
    </div>
  );
};

export default HomeDashboard;