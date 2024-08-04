import { useState } from "react";
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

const RankPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [pageParam, setPageParam] = useState(1);
  const { status, data, error, refetch } = useQuery({
    queryKey: ["get-all-rank", pageParam],
    queryFn: () => fetchAllRank(pageParam),
    placeholderData: keepPreviousData,
  });

  function fetchAllRank(page) {
    return getApi("/sales/perangkingan", {
      page: page,
      limit: 20,
      nama: searchValue,
    });
  }

  function onSearch(e) {
    e.preventDefault();
    refetch();
  }

  function fetchNextPage(currentPage) {
    setPageParam(currentPage + 1);
    refetch();
  }

  function fetchPrevPage(currentPage) {
    setPageParam(currentPage - 1);
    refetch();
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
        <SearchBar
          onSubmit={onSearch}
          placeholder="Cari Rank"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          <RankTable items={data} />
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

const RankTable = ({ items }) => {
  return (
    <Table className="table-auto md:table-fixed">
      <TableHeader>
        <TableRow className="sticky">
          <TableHead className="w-14">No</TableHead>
          <TableHead className="w-40">Nama</TableHead>
          <TableHead className="w-16">Tahun</TableHead>
          <TableHead>Achievement total</TableHead>
          <TableHead>Achievement gadus</TableHead>
          <TableHead>Achievement premium</TableHead>
          <TableHead>Jumlah customer</TableHead>
          <TableHead>Jumlah visit</TableHead>
          <TableHead>Hasil</TableHead>
          <TableHead className="w-16">Rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.content.map((elem, index) => (
          <TableRow key={elem.idsales}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{elem.nama}</TableCell>
            <TableCell className="truncate hover:cursor-default">
              {elem.tahun}
            </TableCell>
            <TableCell className="truncate hover:cursor-default">
              {elem.achivementtotal}
            </TableCell>
            <TableCell className="truncate hover:cursor-default">
              {elem.achivementgadus}
            </TableCell>
            <TableCell className="truncate hover:cursor-default">
              {elem.achivementpremium}
            </TableCell>
            <TableCell className="truncate hover:cursor-default">
              {elem.jumcustomer}
            </TableCell>
            <TableCell className="truncate hover:cursor-default">
              {elem.jumvisit}
            </TableCell>
            <TableCell className="truncate hover:cursor-default">
              {elem.hasil}
            </TableCell>
            <TableCell>{elem.rank}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RankPage;
