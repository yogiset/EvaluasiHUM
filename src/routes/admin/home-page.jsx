import { useMemo } from "react";
import { LayoutGrid, LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Chart } from "react-charts";
import { chartsData } from "@/data/charts";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const HomeDashboard = () => {
  const { role } = useAuth();
  const datumColors = chartsData.map((e) => e.color);
  const newChartsDatum = useMemo(() => chartsData, []);

  const primaryAxis = useMemo(
    () => ({
      getValue: (datum) => format(datum.primary, "dd/MM/yyyy"),
    }),
    []
  );

  const secondaryAxes = useMemo(
    () => [
      {
        getValue: (datum) => datum.result,
        elementType: "line",
      },
    ],
    []
  );

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex items-center p-4">
        <LayoutGrid className="mr-2" />
        <h1 className="text-2xl font-medium">Board</h1>
      </div>
      <div className="px-2 md:px-4">
        <BoardList role={role} />
      </div>
      {role === "ADMIN" && (
        <div className="p-4">
          <div className="flex items-center">
            <LineChart className="mr-2" />
            <h1 className="text-2xl font-medium">Hasil Evaluasi</h1>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-4 pb-20">
            <div className="w-full h-[300px] mt-2">
              <Chart
                options={{
                  data: newChartsDatum,
                  defaultColors: datumColors,
                  primaryAxis,
                  secondaryAxes,
                }}
              />
            </div>
            <ul className="space-y-1">
              <li className="w-max text-sm font-medium">
                Tanggal: {format(new Date(), "dd MMMM yyyy", { locale: id })}
              </li>
              <Separator />
              {chartsData.map((e, index) => (
                <li
                  key={index}
                  className="w-max flex items-center text-sm font-medium"
                >
                  <div
                    style={{ backgroundColor: e.color }}
                    className="w-3 h-3 rounded-full mr-2"
                  />
                  {e.label}: {e.currentResult}
                </li>
              ))}
              <Separator />
              <li className="w-max text-sm font-medium">
                Total karyawan: 1127 karyawan
              </li>
              <li className="w-max text-sm font-medium">
                Total evaluasi: 1040 evaluasi
              </li>
              <li className="w-max text-sm font-medium">
                Total user: 1083 user
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const BoardList = ({ role }) => {
  const allBoards = [
    { title: "Test Evaluasi", path: "/evaluasi/user-form", bg: "bg-black-400" },
    { title: "Evaluasi", path: "/dashboard/evaluasi", bg: "bg-rose-400" },
    { title: "Karyawan", path: "/dashboard/karyawan", bg: "bg-sky-500" },
    { title: "Pertanyaan", path: "/dashboard/pertanyaan", bg: "bg-orange-500" },
  ];

  const boards =
    role !== "ADMIN"
      ? allBoards.filter(
          (board) => board.title !== "Karyawan" && board.title !== "Pertanyaan"
        )
      : allBoards;

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

export default HomeDashboard;
