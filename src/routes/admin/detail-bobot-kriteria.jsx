import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronsRight, PencilLine, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { bobotkriteriaSchema } from "@/schema/bobot-kriteria-schema";
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
import {
  exampleKriteria,
} from "@/data/userData";

const DetailBobotKriteriaPage = () => {
  const navigate = useNavigate();
  const { bobotId } = useParams();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false); // Edit state

  const [errorData, setErrorData] = useState([]);
  const [errorValidation, setErrorValidation] = useState(false);

  const [nmKriteria, setNmKriteria] = useState("");
  const [bobot, setBobot] = useState("");
  const { role } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-bobot-kriteria", bobotId],
    queryFn: fetchBobotkriteria,
  });

  async function fetchBobotkriteria() {
    const response = await axios.get(
      `http://localhost:8082/bobotkriteria/findbyid/${bobotId}`
    );

    if (response.status === 200) {
      setNmKriteria(response.data.nmkriteria);
      setBobot(response.data.bobot);
      return response.data;
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.put(
        `http://localhost:8082/bobotkriteria/editbobot/${bobotId}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-bobot-kriteria", bobotId],
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
      nmkriteria: nmKriteria,
      bobot,
    };

    const { success, data, error } = bobotkriteriaSchema.safeParse(formData);

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
        <Link to={"/dashboard/bobotkriteria"} className="hover:underline">
          Bobot Kriteria
        </Link>
        <ChevronsRight />
        <p>{bobotId}</p>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full h-full">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="p-2 space-y-4 pb-20">
              <h1 className="text-lg md:text-xl font-semibold">
                Detail Bobot
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
                  <TrNumber
                    id="bobot"
                    title="Bobot"
                    desc={data.bobot}
                    isEdit={isEdit}
                    onChange={(e) => setBobot(e.target.value)}
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
                      onClick={() => navigate("/dashboard/bobotkriteria")}
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

export default DetailBobotKriteriaPage;
