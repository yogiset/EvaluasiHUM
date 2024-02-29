import { useState } from "react";
import { Info, Trash2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { toast } from "sonner";
import { Loading } from "@/components/dashboard/loading";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";

const EvaluasiPage = () => {
  const { role } = useAuth();
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-evaluation-results"],
    queryFn: fetchEvaluationResults,
  });

  async function fetchEvaluationResults() {
    let url;

    role === "ADMIN" ? (url = "evaluasi/showall") : (url = `evaluasi/showall`); // Find by nik if not admin

    const response = await axios.get(`http://localhost:8082/${url}`);

    if (response.status === 200) {
      return response.data;
    }
  }

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
      {isLoading ? <Loading /> : <EvaluationList data={data.content} />}
    </div>
  );
};

const EvaluationList = ({ data }) => {
  return (
    <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">Ngopi dulu guys☕</h1>
        </div>
      ) : (
        data.map((elem) => <EvaluationCard key={elem.ideva} data={elem} />)
      )}
    </div>
  );
};

const EvaluationCard = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { newModal } = useConfirmModal();

  const mutation = useMutation({
    mutationFn: (id) => {
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
          {data.hasilevaluasi}
        </Link>
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
      </div>
    </div>
  );
};

export default EvaluasiPage;
