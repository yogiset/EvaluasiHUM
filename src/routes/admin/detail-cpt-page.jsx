import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronsRight, PencilLine, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { cptSchema } from "@/schema/cpt-schema";
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

const DetailCptPage = () => {
  const navigate = useNavigate();
  const { cptId } = useParams();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false); // Edit state

  const [errorData, setErrorData] = useState([]);
  const [errorValidation, setErrorValidation] = useState(false);

  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [tahun, setTahun] = useState("");
  const [panolcustomer, setPanolCustomer] = useState("");
  const [coverage, setCoverage] = useState("");
  const [coveragepersen, setCoveragepersen] = useState("");
  const [penetration, setPenetration] = useState("");
  const [throughput, setThroughput] = useState("");
  const [hitrate, setHitrate] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-cpt", cptId],
    queryFn: fetchCpt,
  });

  async function fetchCpt() {
    const response = await axios.get(
      `http://localhost:8082/cpt/findbyid/${cptId}`
    );

    if (response.status === 200) {
      setNik(response.data.nik);
      setNama(response.data.nama);
      setTahun(response.data.tahun);
      setPanolCustomer(response.data.panolcustomer);
      setCoverage(response.data.coverage);
      setCoveragepersen(response.data.coveragepersen);
      setPenetration(response.data.penetration);
      setThroughput(response.data.throughput);
      setHitrate(response.data.hitrate);
      return response.data;
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.put(`http://localhost:8082/cpt/editcpt/${cptId}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cpt", cptId] });
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
      nama,
      tahun,
      panolcustomer,
      coverage,
      coveragepersen,
      penetration,
      throughput,
      hitrate,
    };
    const { success, data, error } = cptSchema.safeParse(formData);

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
        <Link to={"/dashboard/cpt"} className="hover:underline">
          CPT
        </Link>
        <ChevronsRight />
        <p>{cptId}</p>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full h-full">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="p-2 space-y-4 pb-20">
              <h1 className="text-lg md:text-xl font-semibold">Detail Cpt</h1>
              {errorValidation && (
                <CustomAlert variant="destructive" data={errorData} />
              )}
              <table className="w-full border-collapse bg-sky-50 border border-slate-400">
                <tbody>
                  <TrText
                    id="nik"
                    title="NIK"
                    desc={data.nik}
                    onChange={(e) => setNik(e.target.value)}
                  />
                  <TrText
                    id="nama"
                    title="Nama"
                    desc={data.nama}
                    onChange={(e) => setNama(e.target.value)}
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
                  <TrNumber
                    id="panolcustomer"
                    title="Panolcustomer"
                    desc={data.panolcustomer}
                    isEdit={isEdit}
                    onChange={(e) => setPanolCustomer(e.target.value)}
                  />
                  <TrNumber
                    id="coverage"
                    title="Coverage"
                    desc={data.coverage}
                    isEdit={isEdit}
                    onChange={(e) => setCoverage(e.target.value)}
                  />
                  <TrText
                    id="coverage"
                    title="Coverage %"
                    desc={data.coveragepersen + " % "}
                    onChange={(e) => setCoveragepersen(e.target.value)}
                  />
                  <TrNumber
                    id="penetration"
                    title="Penetration"
                    desc={data.penetration}
                    isEdit={isEdit}
                    onChange={(e) => setPenetration(e.target.value)}
                  />
                  <TrNumber
                    id="throughput"
                    title="Throughput"
                    desc={data.throughput}
                    isEdit={isEdit}
                    onChange={(e) => setThroughput(e.target.value)}
                  />
                  <TrText
                    id="hitrate"
                    title="Hitrate"
                    desc={data.hitrate + " % "}
                    isEdit={isEdit}
                    onChange={(e) => setHitrate(e.target.value)}
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
                      onClick={() => navigate("/dashboard/cpt")}
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

export default DetailCptPage;
