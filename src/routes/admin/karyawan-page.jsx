import { useState } from "react";
import { Info, Trash2, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { toast } from "sonner";
import { Loading } from "@/components/dashboard/loading";
import { KaryawanModal } from "@/components/dashboard/modal/karyawan-modal";
import { ForbiddenPage } from "@/components/dashboard/forbidden-page";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";

const KaryawanPage = () => {
  const { role } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false); // modal/dialog state

  const { data, isLoading } = useQuery({
    queryKey: ["get-all-employee"],
    queryFn: fetchAllEmployee,
  });

  async function fetchAllEmployee() {
    if (role !== "ADMIN") return [];

    const response = await axios.get("http://localhost:8082/karyawan/all");

    if (response.status === 200) {
      return response.data;
    }
  }

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

  if (role !== "ADMIN") {
    return <ForbiddenPage />;
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
      {isLoading ? <Loading /> : <KaryawanList data={data} />}
    </div>
  );
};

const KaryawanList = ({ data }) => {
  return (
    <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">Karyawan sedang ngopi☕</h1>
        </div>
      ) : (
        data.map((elem) => <KaryawanCard key={elem.idkar} data={elem} />)
      )}
    </div>
  );
};

const KaryawanCard = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { newModal } = useConfirmModal();

  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`http://localhost:8082/karyawan/hapuskaryawan/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-employee"] });
      toast.success("Deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete!");
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
