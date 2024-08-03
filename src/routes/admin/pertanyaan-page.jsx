import { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Info, Trash2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import {
  useQueryClient,
  useMutation,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { toast } from "sonner";
import { ForbiddenPage } from "@/components/dashboard/forbidden-page";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Loading } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";

const PertanyaanPage = () => {
  // const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { role } = useAuth();
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
    queryKey: ["get-questions"],
    queryFn: ({ pageParam }) => fetchQuestions(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, lastPageParam) =>
      lastPage.length === 0 ||
      lastPage.totalPages === lastPageParam.length ||
      lastPage.content.length === 0
        ? undefined
        : lastPageParam.length + 1,
  });

  async function fetchQuestions(pageParam) {
    if (role !== "ADMIN") return [];

    const response = await axios.get(
      "http://localhost:8082/pertanyaan/showall",
      {
        params: {
          page: pageParam,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }
  }

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  // TODO: Handle search Question ↓↓↓
  function searchQuestion(e) {
    e.preventDefault();
    alert(searchValue);
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
          placeholder="Cari pertanyaan..."
          onChange={(e) => setSearchValue(e.target.value)}
          onSubmit={searchQuestion}
        />
        <Button
          variant="sky"
          onClick={() => navigate("/dashboard/pertanyaan/add")}
        >
          Tambah
        </Button>
      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          {data.pages.map((group, i) => (
            <QuestionList key={i} data={group.content} />
          ))}

          {hasNextPage && (
            <div ref={ref}>{isFetchingNextPage ? <Loading /> : null}</div>
          )}
        </div>
      )}
    </div>
  );
};

const QuestionList = ({ data }) => {
  return (
    <>
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">Tidak ada pertanyaan.</h1>
        </div>
      ) : (
        <Fragment>
          {data.map((elem) => (
            <QuestionCard key={elem.idper} data={elem} />
          ))}
        </Fragment>
      )}
    </>
  );
};

const QuestionCard = ({ data }) => {
  // const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { newModal } = useConfirmModal();

  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`http://localhost:8082/pertanyaan/deleteall/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-questions"] });
      toast.success("Deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete!");
    },
  });

  function deleteQuestion() {
    newModal({
      title: "Peringatan!",
      message: "Anda yakin ingin menghapusnya?",
    }).then((res) => {
      if (res) {
        mutation.mutate(data.idper);
      }
    });
  }
  return (
    <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
      <div className="space-y-1 truncate">
        <Link
          to={`/dashboard/pertanyaan/${data.idper}`}
          className="text-2xl font-semibold hover:underline"
        >
          {data.pertanyaan}
        </Link>
        <h1 className="text-sm text-neutral-600">{data.jabatan}</h1>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          variant="sky"
          onClick={() => navigate(`/dashboard/pertanyaan/${data.idper}`)}
        >
          <Info className="mr-0 md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">Detail</span>
        </Button>

        <Button variant="destructive" onClick={deleteQuestion}>
          <Trash2 className="mr-0 md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">Hapus</span>
        </Button>
      </div>
    </div>
  );
};

export default PertanyaanPage;
