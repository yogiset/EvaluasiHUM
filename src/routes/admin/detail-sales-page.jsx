import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronsRight, PencilLine, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { salesSchema } from "@/schema/sales-schema";
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
import { exampleTahun } from "@/data/userData";

const DetailSalesPage = () => {
  const navigate = useNavigate();
  const { salesId } = useParams();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false); // Edit state

  const [errorData, setErrorData] = useState([]);
  const [errorValidation, setErrorValidation] = useState(false);

  const [nik, setNik] = useState("");
  const [target, setTarget] = useState("");
  const [tahun, setTahun] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-sales", salesId],
    queryFn: fetchSales,
  });

  async function fetchSales() {
    const response = await axios.get(
      `http://localhost:8082/sales/findbyid/${salesId}`
    );

    if (response.status === 200) {
      setNik(response.data.nik);
      setTarget(response.data.target);
      setTahun(response.data.tahun);
      return response.data;
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.put(
        `http://localhost:8082/sales/editdatasales/${salesId}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-sales", salesId] });
      toast.success("Updated successfully!");
      setIsEdit(false);
    },
    onError: () => {
      toast.error("Failed to update!");
    },
  });

  function saveEditedData() {
    const formData = {
      nik,
      target,
      tahun,
    };
    const { success, data, error } = salesSchema.safeParse(formData);

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
        <Link to={"/dashboard/sales"} className="hover:underline">
          Data Sales
        </Link>
        <ChevronsRight />
        <p>{salesId}</p>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full h-full">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="p-2 space-y-4 pb-20">
              <h1 className="text-lg md:text-xl font-semibold">
                Detail Data Sales
              </h1>
              {errorValidation && (
                <CustomAlert variant="destructive" data={errorData} />
              )}
              <table className="w-full border-collapse bg-sky-50 border border-slate-400">
                <tbody>
                  <TrText
                    id="nik"
                    title="Nik"
                    desc={data.nik}
                    onChange={(e) => setNik(e.target.value)}
                  />
                  <TrText
                    id="target"
                    title="Target"
                    desc={data.target}
                    isEdit={isEdit}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  <TrSelect
                    id="tahun"
                    title="Tahun"
                    desc={data.tahun}
                    isEdit={isEdit}
                    selectItems={exampleTahun}
                    placeholder={data.tahun}
                    onValueChange={(e) => setTahun(e)}
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
                      onClick={() => navigate("/dashboard/sales")}
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

export default DetailSalesPage;
