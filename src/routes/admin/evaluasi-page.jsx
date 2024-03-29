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
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";

const EvaluasiPage = () => {
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["get-evaluation-results"],
    queryFn: ({ pageParam }) => fetchEvaluationResults(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, lastPageParam) =>
      lastPage.length === 0 ||
      lastPage.totalPages === lastPageParam.length ||
      lastPage.content.length === 0
        ? undefined
        : lastPageParam.length + 1,
  });

  async function fetchEvaluationResults(pageParam) {
    const response = await axios.get("http://localhost:8082/evaluasi/showall", {
      params: {
        page: pageParam,
      },
    });

    if (response.status === 200) {
      // console.log(response);
      return response.data;
    }
  }

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  // onSubmit event ↓↓↓
  function onSearch(e) {
    e.preventDefault();

    // TODO: Handle on search
    alert(searchValue);
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
          placeholder="Cari hasil evaluasi..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          {data.pages.map((group, i) => (
            <EvaluationList key={i} data={group.content} />
          ))}
          {hasNextPage && (
            <div ref={ref}>{isFetchingNextPage ? <Loading /> : null}</div>
          )}
        </div>
      )}
    </div>
  );
};

const EvaluationList = ({ data }) => {
  return (
    <>
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">Ngopi dulu guys☕</h1>
        </div>
      ) : (
        <Fragment>
          {data.map((elem) => (
            <EvaluationCard key={elem.ideva} data={elem} />
          ))}
        </Fragment>
      )}
    </>
  );
};

const EvaluationCard = ({ data }) => {
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { newModal } = useConfirmModal();

  const mutation = useMutation({
    mutationFn: (id) => {
      if (role !== "ADMIN") return [];
      return axios.delete(`http://localhost:8082/evaluasi/hapusevaluasi/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-evaluation-results"] });
      toast.success("Deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete!");
    },
  });

  function deleteEvaluation() {
    newModal({
      title: "Peringatan!",
      message: "Apakah anda ingin menghapusnya?",
    }).then((res) => {
      if (res) {
        mutation.mutate(data.ideva);
      }
    });
  }

  return (
    <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
      <div className="space-y-1 truncate">
        <Link
          to={`/dashboard/evaluasi/${data.ideva}`}
          className="text-2xl font-semibold hover:underline"
        >
          {data.nama}
        </Link>
        <h1 className="text-sm text-neutral-600">{data.hasilevaluasi}</h1>
        <h1 className="text-sm text-neutral-600">{data.tanggalevaluasi}</h1>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          variant="sky"
          onClick={() => navigate(`/dashboard/evaluasi/${data.ideva}`)}
        >
          <Info className="mr-0 md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">Detail</span>
        </Button>
        {role !== "ADMIN" ? null : (
          <Button
            variant="destructive"
            onClick={deleteEvaluation}
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

export default EvaluasiPage;
