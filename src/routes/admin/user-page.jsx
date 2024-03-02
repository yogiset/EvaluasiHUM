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
import { UserModal } from "@/components/dashboard/modal/user-modal";
import { ForbiddenPage } from "@/components/dashboard/forbidden-page";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Button } from "@/components/ui/button";

const UserPage = () => {
  const { role } = useAuth();
  const { ref, inView } = useInView();
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false); // modal/dialog state

  const { status, data, error, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["get-users"],
      queryFn: ({ pageParam }) => fetchUsers(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, lastPageParam) =>
        lastPage.length === 0 ? undefined : lastPageParam.length + 1,
    });

  async function fetchUsers(pageParam) {
    if (role !== "ADMIN") return [];

    const response = await axios.get("http://localhost:8082/user/showall", {
      params: {
        page: pageParam,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  }

  useEffect(() => {
    if (inView && data.pageParams.length < data.pages[0].totalPages) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, data]);

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
          placeholder="Cari user..."
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {/* modal start */}
        <Button variant="sky" onClick={() => setOpen(true)}>
          Tambah
        </Button>
        <UserModal open={open} onClose={onClose} />
        {/* modal end */}
      </div>
      {status === "pending" ? (
        <Loading />
      ) : (
        <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
          {data.pages.map((group, i) => (
            <UsersList
              key={i}
              data={group.content}
              isFetchingNextPage={isFetchingNextPage}
              refer={ref}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const UsersList = ({ data, isFetchingNextPage, refer }) => {
  return (
    <>
      {data.length < 1 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-lg font-semibold">User sedang ngopi☕</h1>
        </div>
      ) : (
        <Fragment>
          {data.map((elem) => (
            <UserCard key={elem.iduser} data={elem} />
          ))}
        </Fragment>
      )}
      <>
        {data.length !== 0 && (
          <div ref={refer}>{isFetchingNextPage ? <Loading /> : null}</div>
        )}
      </>
    </>
  );
};

const UserCard = ({ data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { newModal } = useConfirmModal();

  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`http://localhost:8082/user/hapususer/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
      toast.success("Deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete!");
    },
  });

  function deleteUser() {
    newModal({
      title: "Peringatan!",
      message:
        "Data karyawan yang terkait dengan user ini tidak akan dihapus. Apakah anda ingin menghapusnya?",
    }).then((res) => {
      if (res) {
        mutation.mutate(data.iduser);
      }
    });
  }

  return (
    <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
      <div className="space-y-1 truncate">
        <Link
          to={`/dashboard/users/${data.iduser}`}
          className="text-2xl font-semibold hover:underline"
        >
          {data.username}
        </Link>
        <h1 className="text-sm text-neutral-600">{data.role}</h1>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          variant="sky"
          onClick={() => navigate(`/dashboard/users/${data.iduser}`)}
        >
          <Info className="mr-0 md:mr-2 w-5 h-5" />
          <span className="hidden md:inline">Info</span>
        </Button>
        <Button
          variant="destructive"
          onClick={deleteUser}
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

export default UserPage;
