import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronsRight, PencilLine, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { himpunankriteriaSchema } from "@/schema/himpunan-kriteria-schema";
import { Loading } from "@/components/dashboard/loading";
import { CustomAlert } from "@/components/dashboard/custom-alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// TODO: Remove or change this later ↓↓↓
import {
  exampleKriteria,
  exampleKeterangann,
  exampleNilai,
  exampleHimpunan,
} from "@/data/userData";
import { getApi, putApi } from "@/lib/fetcher";

const DetailHimpunanKriteriaPage = () => {
  const navigate = useNavigate();
  const { kriteriaId } = useParams();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false); // Edit state

  const [errorData, setErrorData] = useState([]);
  const [errorValidation, setErrorValidation] = useState(false);

  const [nmKriteria, setNmKriteria] = useState("");
  const [nmHimpunan, setNmHimpunan] = useState("");
  const [nilai, setNilai] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const { role } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-himpunan-kriteria", kriteriaId],
    queryFn: fetchHimpunankriteria,
  });

  async function fetchHimpunankriteria() {
    const response = await getApi(`/kriteria/findbyid/${kriteriaId}`);

    if (response) {
      setNmKriteria(response.nmkriteria);
      setNmHimpunan(response.nmhimpunan);
      setNilai(response.nilai);
      setKeterangan(response.keterangan);
      return response;
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) =>
      putApi(`/kriteria/edithim/${kriteriaId}`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-himpunan-kriteria", kriteriaId],
      });
      toast.success("Updated successfully!");
      setIsEdit(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function saveEditedData() {
    const formData = {
      nmkriteria: nmKriteria,
      nmhimpunan: nmHimpunan,
      nilai,
      keterangan,
    };

    const { success, data, error } = himpunankriteriaSchema.safeParse(formData);

    if (!success) {
      setErrorData(JSON.parse(error));
      setErrorValidation(true);
      return;
    }

    setErrorValidation(false);
    mutation.mutate(data);
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col text-center">
        <Info />
        <h1 className="text-xl font-semibold">Error!</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex items-center gap-x-2 font-medium p-2">
        <Link to={"/dashboard/himpunankriteria"} className="hover:underline">
          Kriteria Himpunan
        </Link>
        <ChevronsRight />
        <p>{kriteriaId}</p>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full h-full">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="p-2 space-y-4 pb-20">
              <h1 className="text-lg md:text-xl font-semibold">
                Detail Kriteria
              </h1>
              {errorValidation && (
                <CustomAlert variant="destructive" data={errorData} />
              )}
              <table className="w-full border-collapse bg-sky-50 border border-slate-400">
                <tbody>
                  <TrSelect
                    id="nmkriteria"
                    title="Nama Kriteria"
                    desc={data.nmkriteria}
                    isEdit={isEdit}
                    selectItems={exampleKriteria}
                    placeholder={data.nmkriteria}
                    onValueChange={(e) => setNmKriteria(e)}
                  />
                  <TrSelect
                    id="nmHimpunan"
                    title="Nama Himpunan"
                    desc={data.nmhimpunan}
                    isEdit={isEdit}
                    selectItems={exampleHimpunan}
                    placeholder={data.nmhimpunan}
                    onValueChange={(e) => setNmHimpunan(e)}
                  />
                  <TrSelect
                    id="nilai"
                    title="Nilai"
                    desc={data.nilai}
                    selectItems={exampleNilai}
                    placeholder={data.nilai}
                    isEdit={isEdit}
                    onValueChange={(e) => setNilai(e)}
                  />
                  <TrSelect
                    id="keterangan"
                    title="Keterangan"
                    desc={data.keterangan}
                    selectItems={exampleKeterangann}
                    placeholder={data.keterangan}
                    isEdit={isEdit}
                    onValueChange={(e) => setKeterangan(e)}
                  />
                </tbody>
              </table>
              <div className="flex gap-x-2">
                {isEdit ? (
                  <>
                    <Button
                      variant="sky"
                      onClick={saveEditedData}
                      disabled={mutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEdit(false);
                        setErrorValidation(false);
                      }}
                      disabled={mutation.isPending}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    {role !== "ADMIN" ? null : (
                      <Button variant="sky" onClick={() => setIsEdit(true)}>
                        <PencilLine className="mr-2 w-5 h-5" />
                        Edit
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard/himpunankriteria")}
                    >
                      Kembali
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrSelect = ({
  title,
  desc,
  isEdit,
  id,
  placeholder,
  selectItems,
  onValueChange,
}) => {
  return (
    <tr>
      <td className="font-medium border border-slate-300 px-2 py-2">{title}</td>
      <td className="border border-slate-300 px-2 py-2">
        {isEdit ? (
          <Select id={id} name={id} onValueChange={onValueChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {selectItems.map((position, index) => (
                <SelectItem key={index} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>{desc}</p>
        )}
      </td>
    </tr>
  );
};

export default DetailHimpunanKriteriaPage;
