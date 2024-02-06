import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ChevronsRight, PencilLine, Info } from "lucide-react";
import { Loading } from "@/components/dashboard/loading";
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

  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [divisi, setDivisi] = useState("");
  const [jabatan, setJabatan] = useState("");

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
      setIsEdit(false);
    },
  });

  function saveEditedData() {
    if (!nama || !nik || !divisi || !jabatan) return;

    const formData = { nik, nama, divisi, jabatan };
    mutation.mutate(formData);
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
                </tbody>
              </table>
              <div className="flex gap-x-2">
                {isEdit ? (
                  <>
                    <Button variant="sky" onClick={saveEditedData}>
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEdit(false)}>
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
      <td className="font-medium border border-slate-300 px-2 py-4">{title}</td>
      <td className="border border-slate-300 px-2 py-4">
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
      <td className="font-medium border border-slate-300 px-2 py-4">{title}</td>
      <td className="border border-slate-300 px-2 py-4">
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

export default DetailKaryawanPage;
