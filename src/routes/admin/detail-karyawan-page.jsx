import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronsRight, PencilLine, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { format, toDate } from "date-fns";
import { employeeSchema } from "@/schema/employee-schema";
import { Loading } from "@/components/dashboard/loading";
import { CustomAlert } from "@/components/dashboard/custom-alert";
import { DatePicker } from "@/components/dashboard/date-picker";
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
import { exampleDivisi, exampleJabatan } from "@/data/userData";

const DetailKaryawanPage = () => {
  const navigate = useNavigate();
  const { karId } = useParams();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false); // Edit state

  const [errorData, setErrorData] = useState([]);
  const [errorValidation, setErrorValidation] = useState(false);

  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [divisi, setDivisi] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [tanggalmasuk, setTanggalmasuk] = useState(Date.now());
  const [masakerja, setMasakerja] = useState("");
  const [tingkatan, setTingkatan] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-employee", karId],
    queryFn: fetchEmployee,
  });

  async function fetchEmployee() {
    const response = await axios.get(
      `http://localhost:8082/karyawan/findbyid/${karId}`
    );

    if (response.status === 200) {
      setNik(response.data.nik);
      setNama(response.data.nama);
      setDivisi(response.data.divisi);
      setJabatan(response.data.jabatan);
      setTanggalmasuk(toDate(response.data.tanggalmasuk));
      setMasakerja(response.data.masakerja);
      setTingkatan(response.data.tingkatan);
      return response.data;
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.put(
        `http://localhost:8082/karyawan/editkaryawan/${karId}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-employee", karId] });
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
      divisi,
      jabatan,
      tanggalmasuk: tanggalmasuk,
      masakerja,
      tingkatan,
    };
    console.log(formData);
    const { success, data, error } = employeeSchema.safeParse(formData);

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
        <Link to={"/dashboard/karyawan"} className="hover:underline">
          KARYAWAN
        </Link>
        <ChevronsRight />
        <p>{karId}</p>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full h-full">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="p-2 space-y-4 pb-20">
              <h1 className="text-lg md:text-xl font-semibold">
                Detail Karyawan
              </h1>
              {errorValidation && (
                <CustomAlert variant="destructive" data={errorData} />
              )}
              <table className="w-full border-collapse border border-slate-400">
                <tbody>
                  <TrText
                    id="nama"
                    title="Nama"
                    desc={data.nama}
                    isEdit={isEdit}
                    onChange={(e) => setNama(e.target.value)}
                  />
                  <TrText
                    id="nik"
                    title="NIK"
                    desc={data.nik}
                    isEdit={isEdit}
                    onChange={(e) => setNik(e.target.value)}
                  />
                  <TrSelect
                    id="divisi"
                    title="Divisi"
                    desc={data.divisi}
                    isEdit={isEdit}
                    selectItems={exampleDivisi}
                    placeholder={data.divisi}
                    onValueChange={(e) => setDivisi(e)}
                  />
                  <TrSelect
                    id="jabatan"
                    title="Jabatan"
                    desc={data.jabatan}
                    isEdit={isEdit}
                    selectItems={exampleJabatan}
                    placeholder={data.jabatan}
                    onValueChange={(e) => setJabatan(e)}
                  />
                  <TrDate
                    desc={tanggalmasuk}
                    isEdit={isEdit}
                    onSelect={setTanggalmasuk}
                  />
                  <TrText
                    id="masakerja"
                    title="Masakerja"
                    desc={data.masakerja}
                    onChange={(e) => setMasakerja(e.target.value)}
                  />
                  <TrText
                    id="tingkatan"
                    title="Tingkatan"
                    desc={data.tingkatan}
                    onChange={(e) => setTingkatan(e.target.value)}
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
                      onClick={() => navigate("/dashboard/karyawan")}
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
            <SelectTrigger className="w-full">
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

const TrDate = ({ desc, isEdit, onSelect }) => {
  return (
    <tr>
      <td className="font-medium border border-slate-300 px-2 py-2">
        Tanggal masuk
      </td>
      <td className="border border-slate-300 px-2 py-2">
        {isEdit ? (
          <DatePicker date={desc} onSelect={onSelect} />
        ) : (
          <p>{format(desc, "dd MMMM yyyy")}</p>
        )}
      </td>
    </tr>
  );
};

export default DetailKaryawanPage;
