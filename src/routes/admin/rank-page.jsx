import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getApi } from "@/lib/fetcher";
import { Loading } from "@/components/dashboard/loading";
import { SearchBar } from "@/components/dashboard/search-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { exampleTahun } from "@/data/userData";
import { generatePDFTable } from "@/lib/generate-pdf-table";

const RankPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [pageParam, setPageParam] = useState(1);
  const [selectValue, setSelectValue] = useState("rank");
  const [selectedYear, setSelectedYear] = useState("");

  function fetchAllRank(page, searchValue, selectValue, selectedYear) {
    let params = {
      page,
      limit: 20,
      nama: searchValue,
    };

    if (selectedYear) {
      params.tahun = selectedYear;
    }

    switch (selectValue) {
      case "penilaiansales":
        return getApi("/sales/penilaiansales", params);
      case "matriks":
        return getApi("/sales/matrikskeputusan", params);
      case "normalisasiMatriks":
        return getApi("/sales/normalisasimatrikskeputusan", params);
      default:
        return getApi("/sales/perangkingan", params);
    }
  }

  const { status, data, error, refetch } = useQuery({
    queryKey: ["get-all-rank", pageParam, selectValue, searchValue, selectedYear],
    queryFn: () => fetchAllRank(pageParam, searchValue, selectValue, selectedYear),
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [refetch, selectValue, pageParam, selectedYear]);

  function onSearch(e) {
    e.preventDefault();
    refetch();
  }

  function fetchNextPage(currentPage) {
    setPageParam(currentPage + 1);
  }

  function fetchPrevPage(currentPage) {
    setPageParam(currentPage - 1);
  }

  function exportTableToPdf() {
    const tabelData = [];
    const mainTabelColumns = [
      "No",
      "Nama",
      "Tahun",
      "Achiev Total",
      "Achiev Gadus",
      "Achiev Premium",
      "Jumlah Customer",
      "Jumlah Visit",
    ];
    let columns;

    if (selectValue === "rank") {
      columns = [...mainTabelColumns, "Hasil", "Rank"];

      data.content.forEach((item, index) => {
        tabelData.push([
          index + 1,
          item.nama,
          item.tahun,
          parseFloat(item.achivementtotal.toFixed(2)),
          parseFloat(item.achivementgadus.toFixed(2)),
          parseFloat(item.achivementpremium.toFixed(2)),
          parseFloat(item.jumcustomer.toFixed(2)),
          parseFloat(item.jumvisit.toFixed(2)),
          parseFloat(item.hasil.toFixed(2)),
          item.rank,
        ]);
      });
    } else {
      columns = mainTabelColumns;
      data.content.forEach((item, index) => {
        tabelData.push([
          index + 1,
          item.nama,
          item.tahun,
          parseFloat(item.achievtotal.toFixed(2)),
          parseFloat(item.achievgadus.toFixed(2)),
          parseFloat(item.achievpremium.toFixed(2)),
          parseFloat(item.jumcustomer.toFixed(2)),
          parseFloat(item.jumvisit.toFixed(2)),
        ]);
      });
    }

    generatePDFTable(tabelData, columns, selectValue);
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-xl font-semibold">Error!</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex justify-end items-center gap-x-2 p-2">
        <Button variant="sky" onClick={exportTableToPdf}>
          Export to PDF
        </Button>
        <Select
          onValueChange={(value) => setSelectValue(value)}
          defaultValue={selectValue}
        >
          <SelectTrigger className="w-max space-x-2 bg-sky-700 text-white">
            <SelectValue placeholder="Ranking" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rank">Ranking</SelectItem>
            <SelectItem value="penilaiansales">Penilaian Sales</SelectItem>
            <SelectItem value="matriks">Matriks Keputusan</SelectItem>
            <SelectItem value="normalisasiMatriks">
              Normalisasi Matriks Keputusan
            </SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setSelectedYear(value)}
          defaultValue={selectedYear}
        >
          <SelectTrigger className="w-max space-x-2 bg-sky-700 text-white">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent>
            {exampleTahun.map((tahun) => (
              <SelectItem key={tahun} value={tahun}>
                {tahun}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SearchBar
          onSubmit={onSearch}
          placeholder="Cari nama..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          {selectValue === "rank" ? (
            <RankTable items={data} />
          ) : (
            <MatriksTable items={data} />
          )}
          <div className="w-full flex items-center justify-between">
            {data.pageable.pageNumber > 0 && (
              <Button
                variant="sky"
                size="sm"
                onClick={() => fetchPrevPage(data.pageable.pageNumber + 1)}
              >
                Prev
              </Button>
            )}
            <p className="text-md font-semibold text-slate-600">
              Page {data.pageable.pageNumber + 1} of {data.totalPages}
            </p>
            {data.pageable.pageNumber + 1 < data.totalPages && (
              <Button
                variant="sky"
                size="sm"
                onClick={() => fetchNextPage(data.pageable.pageNumber + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MatriksTable = ({ items }) => {
  return (
    <Table className="table-auto md:table-fixed">
      <TableHeader>
        <TableRow className="sticky">
          <TableHead className="w-14">No</TableHead>
          <TableHead className="w-40">Nama</TableHead>
          <TableHead className="w-16 text-center">Tahun</TableHead>
          <TableHead className="text-center">Achievement total</TableHead>
          <TableHead className="text-center">Achievement gadus</TableHead>
          <TableHead className="text-center">Achievement premium</TableHead>
          <TableHead className="text-center">Jumlah customer</TableHead>
          <TableHead className="text-center">Jumlah visit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.content.map((elem, index) => (
          <TableRow key={elem.idsales}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{elem.nama}</TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {elem.tahun}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {elem.achievtotal}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {elem.achievgadus}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {elem.achievpremium}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {elem.jumcustomer}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {elem.jumvisit}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const RankTable = ({ items }) => {
  return (
    <Table className="table-auto md:table-fixed">
      <TableHeader>
        <TableRow className="sticky">
          <TableHead className="w-14">No</TableHead>
          <TableHead className="w-40">Nama</TableHead>
          <TableHead className="w-16 text-center">Tahun</TableHead>
          <TableHead className="text-center">Achievement total</TableHead>
          <TableHead className="text-center">Achievement gadus</TableHead>
          <TableHead className="text-center">Achievement premium</TableHead>
          <TableHead className="text-center">Jumlah customer</TableHead>
          <TableHead className="text-center">Jumlah visit</TableHead>
          <TableHead className="text-center">Hasil</TableHead>
          <TableHead className="w-16 text-center">Rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.content.map((elem, index) => (
          <TableRow key={elem.idsales}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{elem.nama}</TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {elem.tahun}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {parseFloat(elem.achivementtotal.toFixed(2))}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {parseFloat(elem.achivementgadus.toFixed(2))}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {parseFloat(elem.achivementpremium.toFixed(2))}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {parseFloat(elem.jumcustomer.toFixed(2))}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {parseFloat(elem.jumvisit.toFixed(2))}
            </TableCell>
            <TableCell className="truncate hover:cursor-default text-center">
              {parseFloat(elem.hasil.toFixed(2))}
            </TableCell>
            <TableCell className="text-center">{elem.rank}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RankPage;
