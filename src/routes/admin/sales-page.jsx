import { useState, useEffect, Fragment } from "react";
import { Info, Trash2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { toast } from "sonner";
import { Loading } from "@/components/dashboard/loading";
import { SalesModal } from "@/components/dashboard/modal/sales-modal";
import { ForbiddenPage } from "@/components/dashboard/forbidden-page";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SalesPage = () => {
  // const { role } = useAuth();
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
  } = useInfiniteQuery({
    queryKey: ["get-all-sales"],
    queryFn: ({ pageParam }) => fetchAllSales(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, lastPageParam) =>
      lastPage.length === 0 ||
      lastPage.totalPages === lastPageParam.length ||
      lastPage.content.length === 0
        ? undefined
        : lastPageParam.length + 1,
  });

  async function fetchAllSales(pageParam) {
    // if (role !== "ADMIN") return [];
    const response = await axios.get("http://localhost:8082/sales/showall", {
      params: {
        page: pageParam,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
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

    // TODO: Handle on search
    alert(searchValue);
  }

  // if (role !== "ADMIN") {
  //   return <ForbiddenPage />;
  // }

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
          placeholder="Cari sales..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {/* modal start */}
        <Button variant="sky" onClick={() => setOpen(true)}>
          Tambah
        </Button>
        <SalesModal open={open} onClose={onClose} />
        {/* modal end */}
      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          {data.pages.map((group, i) => (
            <SalesList key={i} data={group.content} />
          ))}

          {hasNextPage && (
            <div ref={ref}>{isFetchingNextPage ? <Loading /> : null}</div>
          )}
        </div>
      )}
    </div>
  );
};

const SalesList = ({ data }) => {
  return (
    <>
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">Sales sedang ngopi☕</h1>
        </div>
      ) : (
        <Fragment>
          {data?.map((elem) => (
            <SalesCard key={elem.idsales} data={elem} />
          ))}
        </Fragment>
      )}
    </>
  );
};

const SalesCard = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { newModal } = useConfirmModal();
  const { role } = useAuth();

  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`http://localhost:8082/sales/deletedatasales/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-sales"] });
      toast.success("Deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete!");
    },
  });

  function deleteSales() {
    newModal({
      title: "Peringatan!",
      message:
        "Semua data yang terkait dengan sales ini akan dihapus. Apakah anda yakin ingin menghapusnya?",
    }).then((res) => {
      if (res) {
        mutation.mutate(data.idsales);
      }
    });
  }

  return (
    <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
      <div className="space-y-1 truncate">
        <Link
          to={`/dashboard/sales/${data.idsales}`}
          className="text-2xl font-semibold hover:underline"
        >
          {data.nama}
        </Link>
        <div className="flex gap-x-2 h-[20px]">
          <h1 className="text-sm font-medium text-neutral-600">
            Target: {data.target} Liter
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
          onClick={() => navigate(`/dashboard/sales/${data.idsales}`)}
        >
          <Info className="mr-0 md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">Info</span>
        </Button>
        {role !== "ADMIN" ? null : (
        <Button
          variant="destructive"
          onClick={deleteSales}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-0 md:mr-2 w-5 h-5 animate-spin" />
          ) : (
            <Trash2 className="mr-0 md:mr-2 w-5 h-5" />
          )}
          <span className="hidden md:inline">Hapus</span>
        </Button>)}
      </div>
    </div>
  );
};

export default SalesPage;
