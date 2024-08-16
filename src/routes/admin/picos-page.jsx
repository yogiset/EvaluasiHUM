import { useState, useEffect, Fragment } from "react";
import { Info, Trash2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useInView } from "react-intersection-observer";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { toast } from "sonner";
import { Loading } from "@/components/dashboard/loading";
import { PicosModal } from "@/components/dashboard/modal/picos-modal";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deleteApi, getApi } from "@/lib/fetcher";
import {
  exampleTahun
} from "@/data/userData";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const PicosPage = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false); // modal/dialog state
  const { role } = useAuth();
  const [selectedYear, setSelectedYear] = useState("");
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["get-all-picos"],
    queryFn: ({ pageParam }) => fetchAllPicos(pageParam, searchValue),
    initialPageParam: 1,
    getNextPageParam: (lastPage, lastPageParam) =>
      lastPage.length === 0 ||
      lastPage.totalPages === lastPageParam.length ||
      lastPage.content.length === 0
        ? undefined
        : lastPageParam.length + 1,
  });

  async function fetchAllPicos(pageParam, searchValue) {
    const params = { page: pageParam, nama: searchValue };

    if (selectedYear) {
      params.tahun = selectedYear;
    }

    return getApi("/picos/showall", params);
  }

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  useEffect(() => {
    refetch();
  }, [refetch, selectedYear]);

  // close modal ↓↓↓
  function onClose() {
    setOpen(false);
  }

  function onSearch(e) {
    e.preventDefault();
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
          placeholder="Cari picos..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {/* modal start */}
        {role !== "ADMIN" ? null : (
          <Button variant="sky" onClick={() => setOpen(true)}>
            Tambah
          </Button>
        )}
        <PicosModal open={open} onClose={onClose} />

        <Select onValueChange={(value) => setSelectedYear(value)} defaultValue={selectedYear}>
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

      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          {data.pages.map((group, i) => (
            <PicosList key={i} data={group.content} />
          ))}

          {hasNextPage && (
            <div ref={ref}>{isFetchingNextPage ? <Loading /> : null}</div>
          )}
        </div>
      )}
    </div>
  );
};

const PicosList = ({ data }) => {
  return (
    <>
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">Data picos tidak ada.</h1>
        </div>
      ) : (
        <Fragment>
          {data?.map((elem) => (
            <PicosCard key={elem.idpicos} data={elem} />
          ))}
        </Fragment>
      )}
    </>
  );
};

const PicosCard = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { newModal } = useConfirmModal();
  const { role } = useAuth();

  const mutation = useMutation({
    mutationFn: (id) => deleteApi(`/picos/deletepicos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-picos"] });
      toast.success("Deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function deletePicos() {
    newModal({
      title: "Peringatan!",
      message:
        "Semua data yang terkait dengan picos ini akan dihapus. Apakah anda yakin ingin menghapusnya?",
    }).then((res) => {
      if (res) {
        mutation.mutate(data.idpicos);
      }
    });
  }

  return (
    <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
      <div className="space-y-1 truncate">
        <Link
          to={`/dashboard/picos/${data.idpicos}`}
          className="text-2xl font-semibold hover:underline"
        >
          {data.nama}
        </Link>
        <div className="flex gap-x-2 h-[20px]">
          <h1 className="text-sm font-medium text-neutral-600">
            Pipeline Strength: {data.pipelinestrength}
          </h1>
          <Separator orientation="vertical" />
          <h1 className="text-sm font-medium text-neutral-600">
            Low Touch Ratio: {data.lowtouchratio} %
          </h1>
          <Separator orientation="vertical" />
          <h1 className="text-sm font-medium text-neutral-600">
            Tahun: {data.tahun}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          variant="sky"
          onClick={() => navigate(`/dashboard/picos/${data.idpicos}`)}
        >
          <Info className="mr-0 md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">Info</span>
        </Button>
        {role !== "ADMIN" ? null : (
          <Button
            variant="destructive"
            onClick={deletePicos}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-0 md:mr-2 w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="mr-0 md:mr-2 w-5 h-5" />
            )}
            <span className="hidden md:inline">Hapus</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PicosPage;
