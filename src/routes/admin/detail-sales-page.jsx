import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronsRight, PencilLine, Info, Trash2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { salesSchema } from "@/schema/sales-schema";
// import { calcPercent } from "@/lib/utils";
import { Loading } from "@/components/dashboard/loading";
import { CustomAlert } from "@/components/dashboard/custom-alert";
import { SalesTargetModal } from "@/components/dashboard/modal/sales-target-modal";
import { TdInput } from "@/components/dashboard/table/td/td-input";
import { TdSelect } from "@/components/dashboard/table/td/td-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// TODO: Remove or change this later ↓↓↓
import { exampleTahun, exampleBulan, exampleKeterangan } from "@/data/userData";

const DetailSalesPage = () => {
  const navigate = useNavigate();
  const { salesId } = useParams();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false); // Edit state
  const [errorData, setErrorData] = useState([]);
  const [errorValidation, setErrorValidation] = useState(false);
  const [open, setOpen] = useState(false);
  const [nik, setNik] = useState("");
  const [target, setTarget] = useState(0);
  const [keterangan, setKeterangan] = useState(0);
  const [tercapai, setTercapai] = useState(0);
  const [tercapaipersen, setTercapaipersen] = useState(0);
  const [tahun, setTahun] = useState("");
  const [salesDetails, setSalesDetails] = useState([]);
  const { role } = useAuth();

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
      setTercapai(response.data.tercapai);
      setTercapaipersen(response.data.tercapaipersen);
      setKeterangan(response.data.keterangan);
      setSalesDetails(response.data.salesDetailDtoList);
      return response.data;
    }
  }

  // update sales
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
      // nama,
      target,
      tercapai,
      tahun,
      tercapaipersen,
      keterangan,
      salesDetailDtoList: salesDetails,
    };
    const { success, data, error } = salesSchema.safeParse(formData);

    if (!success) {
      setErrorData(JSON.parse(error));
      setErrorValidation(true);
      return;
    }

    setErrorValidation(false);
    mutation.mutate({ ...data, tercapaipersen });
  }

  function onClose() {
    setOpen(false);
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
      {/* sales detail modal */}
      <SalesTargetModal open={open} onClose={onClose} idsales={salesId} />

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
                  <tr>
                    <td className="font-medium border border-slate-300 px-2 py-2">
                      Nama
                    </td>
                    <td className="border border-slate-300 px-2 py-2">
                      {data.nama}
                    </td>
                  </tr>
                  <TrText
                    id="nik"
                    title="Nik"
                    desc={data.nik}
                    onChange={(e) => setNik(e.target.value)}
                  />
                  <TrText
                    id="target"
                    title="Target"
                    desc={data.target + " Liter"}
                    isEdit={isEdit}
                    onChange={(e) => setTarget(parseInt(e.target.value))}
                  />
                  <TrText
                    id="tercapai"
                    title="Tercapai"
                    desc={data.tercapai + " Liter"}
                    onChange={(e) => setTercapai(parseInt(e.target.value))}
                  />
                  <tr>
                    <td className="font-medium border border-slate-300 px-2 py-2">
                      Tercapai(%)
                    </td>
                    <td className="border border-slate-300 px-2 py-2">
                      {data.tercapaipersen + " % "}
                    </td>
                  </tr>
                  <TrSelect
                    id="tahun"
                    title="Tahun"
                    desc={data.tahun}
                    isEdit={isEdit}
                    selectItems={exampleTahun}
                    placeholder={data.tahun}
                    onValueChange={(e) => setTahun(e)}
                  />
                  <TrSelect
                    id="keterangan"
                    title="Keterangan"
                    desc={data.keterangan}
                    isEdit={isEdit}
                    selectItems={exampleKeterangan}
                    placeholder={data.keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                  />
                </tbody>
              </table>
              <div className="flex gap-x-2">
                {isEdit ? (
                  <>
                    <Button
                      size="sm"
                      variant="sky"
                      onClick={saveEditedData}
                      disabled={mutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
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
                      <Button
                        size="sm"
                        variant="sky"
                        onClick={() => setIsEdit(true)}
                      >
                        <PencilLine className="mr-2 w-5 h-5" />
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/dashboard/sales")}
                    >
                      Kembali ke halaman sebelumnya
                    </Button>
                  </>
                )}
              </div>

              <Separator className="bg-slate-400" />

              <div className="flex justify-between items-center">
                <h1 className="text-lg md:text-xl font-semibold">
                  Detail Target
                </h1>
                {role !== "ADMIN" ? null : (
                  <Button size="sm" onClick={() => setOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Target
                  </Button>
                )}
              </div>
              <table className="w-full border-collapse bg-sky-50 border border-slate-400">
                <thead className="w-full border-collapse bg-sky-200 border border-slate-400">
                  <tr>
                    <th className="border border-slate-400 p-2">Bulan</th>
                    <th className="border border-slate-400 p-2">Target</th>
                    <th className="border border-slate-400 p-2">Tercapai</th>
                    <th className="border border-slate-400 p-2">Tercapai(%)</th>
                    {role !== "ADMIN" ? null : (
                      <th className="w-1/6 border border-slate-400 p-2">
                        Opsi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.salesDetailDtoList.map((list) => (
                    <DetailTargetList
                      key={list.id}
                      list={list}
                      salesId={salesId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailTargetList = ({ list, salesId }) => {
  const queryClient = useQueryClient();
  const [listEdit, setListEdit] = useState(false);
  const [bulan, setBulan] = useState(list.bulan);
  const [targetbln, setTargetbln] = useState(list.targetbln);
  const [tercapaii, setTercapaii] = useState(list.tercapaii);
  const { role } = useAuth();

  // edit sales detail dto list by id
  const mutationEdit = useMutation({
    mutationFn: (formData) => {
      return axios.put(
        `http://localhost:8082/salesdetail/editsalesdetail/${list.id}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-sales", salesId] });
      toast.success("Edited successfully!");
      setListEdit(false);
    },
    onError: () => {
      toast.error("Failed to edit!");
    },
  });

  // delete sales detail by id
  const mutationDel = useMutation({
    mutationFn: (id) => {
      return axios.delete(
        `http://localhost:8082/salesdetail/deletesalesdetail/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-sales", salesId] });
      toast.success("Deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete!");
    },
  });

  function saveEditedData() {
    const formData = { bulan, targetbln, tercapaii };
    //    const tercapaipersenn = calcPercent(targetbln, tercapaii).toString() + "%";
    mutationEdit.mutate({ ...formData });
  }

  function deleteSalesDetail(id) {
    mutationDel.mutate(id);
  }
  return (
    <tr>
      <TdSelect
        id={`bln${list.id}`}
        value={list.bulan}
        placeholder={list.bulan}
        selectItems={exampleBulan}
        isEdit={listEdit}
        onValueChange={(value) => setBulan(value)}
      />
      <TdInput
        id={`targetbln${list.id}`}
        value={list.targetbln}
        desc="liter"
        type="number"
        isEdit={listEdit}
        onChange={(e) => setTargetbln(parseInt(e.target.value))}
      />
      <TdInput
        id={`tercapaii${list.id}`}
        value={list.tercapaii}
        desc="liter"
        type="number"
        isEdit={listEdit}
        onChange={(e) => setTercapaii(parseInt(e.target.value))}
      />
      <td className="border border-slate-300 p-2">{list.tercapaipersenn}</td>
      <td className="border border-slate-300 p-2">
        <div className="flex justify-evenly gap-x-2">
          {listEdit ? (
            <>
              <Button
                variant="sky"
                size="sm"
                onClick={saveEditedData}
                disabled={mutationEdit.isPending}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setListEdit(false)}
                disabled={mutationEdit.isPending}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              {role !== "ADMIN" ? null : (
                <Button
                  variant="sky"
                  size="sm"
                  onClick={() => setListEdit(true)}
                >
                  <PencilLine className="sm:mr-2 w-4 h-4" />
                  <p className="hidden sm:inline">Edit</p>
                </Button>
              )}

              {role !== "ADMIN" ? null : (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSalesDetail(list.id)}
                >
                  <Trash2 className="w-4 h-4 sm:mr-2" />
                  <p className="hidden sm:inline">Hapus</p>
                </Button>
              )}
            </>
          )}
        </div>
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

export default DetailSalesPage;