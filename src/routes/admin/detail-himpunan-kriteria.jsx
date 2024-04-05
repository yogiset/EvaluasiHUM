import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronsRight, PencilLine, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { himpunankriteriaSchema } from "@/schema/himpunan-kriteria-schema";
import { Loading } from "@/components/dashboard/loading";
import { CustomAlert } from "@/components/dashboard/custom-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// TODO: Remove or change this later ↓↓↓
import { exampleKriteria, exampleKeterangann, exampleNilai, exampleHimpunan } from "@/data/userData";

const DetailHimpunanKriteriaPage = () => {
  const navigate = useNavigate();
  const { kriteriaId } = useParams();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false); // Edit state

  const [errorData, setErrorData] = useState([]);
  const [errorValidation, setErrorValidation] = useState(false);

  const [nmkriteria, setNmkriteria] = useState("");
  const [nmhimpunan, setNmHimpunan] = useState("");
  const [nilai, setNilai] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-himpunan-kriteria", kriteriaId],
    queryFn: fetchHimpunankriteria,
  });

  async function fetchHimpunankriteria() {
    const response = await axios.get(
      `http://localhost:8082/kriteria/findbyid/${kriteriaId}`
    );

    if (response.status === 200) {
      setNmkriteria(response.data.nmkriteria);
      setNmHimpunan(response.data.nmhimpunan);
      setNilai(response.data.nilai);
      setKeterangan(response.data.keterangan);
      return response.data;
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.put(
        `http://localhost:8082/kriteria/edithim/${kriteriaId}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-himpunan-kriteria", kriteriaId],
      });
      toast.success("Updated successfully!");
      setIsEdit(false);
    },
    onError: () => {
      toast.error("Failed to update!");
    },
  });

  function saveEditedData() {
    const formData = {
      nmkriteria,
      nmhimpunan,
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
                    onValueChange={(e) => setNmkriteria(e)}
                  />
                  <TrText
                    id="nmhimpunan"
                    title="Nama Himpunan"
                    desc={data.nmhimpunan}
                    selectItems={exampleHimpunan}
                    isEdit={isEdit}
                    placeholder={data.nmhimpunan}
                    onChange={(e) => setNmHimpunan(e.target.value)}
                  />
                  <TrNumber
                    id="nilai"
                    title="Nilai"
                    desc={data.nilai}
                    isEdit={isEdit}
                    onChange={(e) => setNilai(e.target.value)}
                  />
                  <TrSelect
                    id="keterangan"
                    title="Keterangan"
                    desc={data.keterangan}
                    selectItems={exampleKeterangann}
                    placeholder={data.keterangan}
                    isEdit={isEdit}
                    onChange={(e) => setKeterangan(e.target.value)}
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
                    <Button variant="sky" onClick={() => setIsEdit(true)}>
                      <PencilLine className="mr-2 w-5 h-5" />
                      Edit
                    </Button>
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

const TrNumber = ({ id, title, desc, isEdit, onChange }) => {
  return (
    <tr>
      <td className="font-medium border border-slate-300 px-2 py-2">{title}</td>
      <td className="border border-slate-300 px-2 py-2">
        {isEdit ? (
          <Input
            type="number"
            id={id}
            defaultValue={desc}
            onChange={onChange}
          />
        ) : (
          <p>{desc}</p>
        )}
      </td>
    </tr>
  );
};

const TrText = ({ id, title, desc, isEdit, onChange }) => {
  return (
    <tr>
      <td className="font-medium border border-slate-300 px-2 py-2">{title}</td>
      <td className="border border-slate-300 px-2 py-2">
        {isEdit ? (
          <Input id={id} defaultValue={desc} onChange={onChange} />
        ) : (
          <p>{desc}</p>
        )}
      </td>
    </tr>
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
