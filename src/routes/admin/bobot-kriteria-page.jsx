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
import { BobotKriteriaModal } from "@/components/dashboard/modal/bobot-kriteria-modal";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const BobotKriteriaPage = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false); // modal/dialog state
  const { role } = useAuth();

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["get-all-bobot-kriteria"],
    queryFn: ({ pageParam }) => fetchAllBobotKriteria(pageParam, searchValue),
    initialPageParam: 1,
    getNextPageParam: (lastPage, lastPageParam) =>
      lastPage.length === 0 ||
      lastPage.totalPages === lastPageParam.length ||
      lastPage.content.length === 0
        ? undefined
        : lastPageParam.length + 1,
  });

  async function fetchAllBobotKriteria(pageParam, searchValue) {
    return getApi(`/bobotkriteria/showall`, {
      page: pageParam,
      nmkriteria: searchValue,
    });
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
          placeholder="Cari Kriteria..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {/* modal start */}
        {role !== "ADMIN" ? null : (
          <Button variant="sky" onClick={() => setOpen(true)}>
            Tambah
          </Button>
        )}

        <BobotKriteriaModal open={open} onClose={onClose} />
        {/* modal end */}
      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          {data.pages.map((group, i) => (
            <BobotKriteriaList key={i} data={group.content} />
          ))}

          {hasNextPage && (
            <div ref={ref}>{isFetchingNextPage ? <Loading /> : null}</div>
          )}
        </div>
      )}
    </div>
  );
};

const BobotKriteriaList = ({ data }) => {
  return (
    <>
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">Bobot sedang ngopi☕</h1>
        </div>
      ) : (
        <Fragment>
          {data?.map((elem) => (
            <BobotCard key={elem.idbobot} data={elem} />
          ))}
        </Fragment>
      )}
    </>
  );
};

const BobotCard = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { newModal } = useConfirmModal();
  const { role } = useAuth();

  const mutation = useMutation({
    mutationFn: (id) => deleteApi(`/bobotkriteria/deletebobot/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-bobot-kriteria"],
      });
      toast.success("Deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function deleteBobot() {
    newModal({
      title: "Peringatan!",
      message:
        "Semua data yang terkait dengan Kriteria bobot ini akan dihapus. Apakah anda yakin ingin menghapusnya?",
    }).then((res) => {
      if (res) {
        mutation.mutate(data.idbobot);
      }
    });
  }

  return (
    <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
      <div className="space-y-1 truncate">
        <Link
          to={`/dashboard/bobotkriteria/${data.idbobot}`}
          className="text-2xl font-semibold hover:underline"
        >
          {data.nmkriteria}
        </Link>
        <div className="flex gap-x-2 h-[20px]">
          <Separator orientation="vertical" />
          <h1 className="text-sm font-medium text-neutral-600">
            Bobot: {data.bobot}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          variant="sky"
          onClick={() => navigate(`/dashboard/bobotkriteria/${data.idbobot}`)}
        >
          <Info className="mr-0 md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">Info</span>
        </Button>
        {role !== "ADMIN" ? null : (
          <Button
            variant="destructive"
            onClick={deleteBobot}
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

export default BobotKriteriaPage;
