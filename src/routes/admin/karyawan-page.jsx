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
import { deleteApi, getApi } from "@/lib/fetcher";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { toast } from "sonner";
import { Loading } from "@/components/dashboard/loading";
import { KaryawanModal } from "@/components/dashboard/modal/karyawan-modal";
import { ForbiddenPage } from "@/components/dashboard/forbidden-page";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";

const KaryawanPage = () => {
  const { role } = useAuth();
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false); // modal/dialog state

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["get-all-employee"],
    queryFn: ({ pageParam }) => fetchAllEmployee(pageParam, searchValue),
    initialPageParam: 1,
    getNextPageParam: (lastPage, lastPageParam) =>
      lastPage.length === 0 ||
      lastPage.totalPages === lastPageParam.length ||
      lastPage.content.length === 0
        ? undefined
        : lastPageParam.length + 1,
  });

  async function fetchAllEmployee(pageParam, searchValue) {
    if (role !== "ADMIN") return [];
    return getApi("/karyawan/showall", { page: pageParam, nama: searchValue });
  }

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  // close modal ↓↓↓
  function onClose() {
    setOpen(false);
  }

  // onSubmit event ↓↓↓
  function onSearch(e) {
    e.preventDefault();
    refetch();
  }

  if (role !== "ADMIN") {
    return <ForbiddenPage />;
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
          placeholder="Cari karyawan..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {/* modal start */}
        <Button variant="sky" onClick={() => setOpen(true)}>
          Tambah
        </Button>
        <KaryawanModal open={open} onClose={onClose} />
        {/* modal end */}
      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          {data.pages.map((group, i) => (
            <KaryawanList key={i} data={group.content} />
          ))}

          {hasNextPage && (
            <div ref={ref}>{isFetchingNextPage ? <Loading /> : null}</div>
          )}
        </div>
      )}
    </div>
  );
};

const KaryawanList = ({ data }) => {
  return (
    <>
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">Tidak ada data karyawan.</h1>
        </div>
      ) : (
        <Fragment>
          {data?.map((elem) => (
            <KaryawanCard key={elem.idkar} data={elem} />
          ))}
        </Fragment>
      )}
    </>
  );
};

const KaryawanCard = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { newModal } = useConfirmModal();

  const mutation = useMutation({
    mutationFn: (id) => deleteApi(`/karyawan/hapuskaryawan/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-employee"] });
      toast.success("Deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function deleteEmployee() {
    newModal({
      title: "Peringatan!",
      message:
        "Semua data yang terkait dengan karyawan ini akan dihapus. Apakah anda yakin ingin menghapusnya?",
    }).then((res) => {
      if (res) {
        mutation.mutate(data.idkar);
      }
    });
  }

  return (
    <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
      <div className="space-y-1 truncate">
        <Link
          to={`/dashboard/karyawan/${data.idkar}`}
          className="text-2xl font-semibold hover:underline"
        >
          {data.nama}
        </Link>
        <h1 className="text-sm text-neutral-600">{data.divisi}</h1>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          variant="sky"
          onClick={() => navigate(`/dashboard/karyawan/${data.idkar}`)}
        >
          <Info className="mr-0 md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">Info</span>
        </Button>
        <Button
          variant="destructive"
          onClick={deleteEmployee}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-0 md:mr-2 w-5 h-5 animate-spin" />
          ) : (
            <Trash2 className="mr-0 md:mr-2 w-5 h-5" />
          )}
          <span className="hidden md:inline">Hapus</span>
        </Button>
      </div>
    </div>
  );
};

export default KaryawanPage;
