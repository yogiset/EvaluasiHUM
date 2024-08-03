import { useState, useEffect } from "react";
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
  const [targettotal, setTargettotal] = useState(0);
  const [tercapaitotal, setTercapaitotal] = useState(0);
  const [tercapaipersentotal, setTercapaipersentotal] = useState(0);
  const [targetgadus, setTargetgadus] = useState(0);
  const [tercapaigadus, setTercapaigadus] = useState(0);
  const [tercapaipersengadus, setTercapaipersengadus] = useState(0);
  const [targetpremium, setTargetpremium] = useState(0);
  const [tercapaipremium, setTercapaipremium] = useState(0);
  const [tercapaipersenpremium, setTercapaipersenpremium] = useState(0);
  const [jumlahcustomer, setJumlahcustomer] = useState(0);
  const [jumlahvisit, setJumlahvisit] = useState(0);
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
      setTahun(response.data.tahun);
      setTargettotal(response.data.targettotal);
      setTercapaitotal(response.data.tercapaitotal);
      setTercapaipersentotal(response.data.tercapaipersentotal);
      setTargetgadus(response.data.targetgadus);
      setTercapaigadus(response.data.tercapaigadus);
      setTercapaipersengadus(response.data.tercapaipersengadus);
      setTargetpremium(response.data.targetpremium);
      setTercapaipremium(response.data.tercapaipremium);
      setTercapaipersenpremium(response.data.tercapaipersenpremium);
      setJumlahcustomer(response.data.jumlahcustomer);
      setJumlahvisit(response.data.jumlahvisit);
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
      tahun,
      targettotal,
      tercapaitotal,
      tercapaipersentotal,
      targetgadus,
      tercapaigadus,
      tercapaipersengadus,
      targetpremium,
      tercapaipremium,
      tercapaipersenpremium,
      jumlahcustomer,
      jumlahvisit,
      salesDetailDtoList: salesDetails,
    };
    const { success, data, error } = salesSchema.safeParse(formData);

    if (!success) {
      setErrorData(JSON.parse(error));
      setErrorValidation(true);
      return;
    }

    setErrorValidation(false);
    mutation.mutate({ ...data, tercapaipersentotal, tercapaipersengadus, tercapaipersenpremium, jumlahvisit });
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
                  <TrSelect
                    id="tahun"
                    title="Tahun"
                    desc={data.tahun}
                    isEdit={isEdit}
                    selectItems={exampleTahun}
                    placeholder={data.tahun}
                    onValueChange={(e) => setTahun(e)}
                  />
                  <TrText
                    id="targettotal"
                    title="Achivement Total Target"
                    desc={data.targettotal}
                    isEdit={isEdit}
                    onChange={(e) => setTargettotal(parseInt(e.target.value))}
                  />
                  <TrText
                    id="tercapaitotal"
                    title="Achivement Total Tercapai"
                    desc={data.tercapaitotal}
                    isEdit={isEdit}
                    onChange={(e) => setTercapaitotal(parseInt(e.target.value))}
                  />
                  <tr>
                    <td className="font-medium border border-slate-300 px-2 py-2">
                      Achivement Total Tercapai(%)
                    </td>
                    <td className="border border-slate-300 px-2 py-2">
                      {data.tercapaipersentotal + " % "}
                    </td>
                  </tr>
                  <TrText
                    id="targetgadus"
                    title="Achivement Gadus Target"
                    desc={data.targetgadus}
                    isEdit={isEdit}
                    onChange={(e) => setTargetgadus(parseInt(e.target.value))}
                  />
                  <TrText
                    id="tercapaigadus"
                    title="Achivement Gadus Tercapai"
                    desc={data.tercapaigadus}
                    isEdit={isEdit}
                    onChange={(e) => setTercapaigadus(parseInt(e.target.value))}
                  />
                  <tr>
                    <td className="font-medium border border-slate-300 px-2 py-2">
                      Achivement Gadus Tercapai(%)
                    </td>
                    <td className="border border-slate-300 px-2 py-2">
                      {data.tercapaipersengadus + " % "}
                    </td>
                  </tr>
                  <TrText
                    id="targetpremium"
                    title="Achivement Premium Target"
                    desc={data.targetpremium}
                    isEdit={isEdit}
                    onChange={(e) => setTargetpremium(parseInt(e.target.value))}
                  />
                  <TrText
                    id="tercapaipremium"
                    title="Achivement Premium Tercapai"
                    desc={data.tercapaipremium}
                    isEdit={isEdit}
                    onChange={(e) => setTercapaipremium(parseInt(e.target.value))}
                  />
                  <tr>
                    <td className="font-medium border border-slate-300 px-2 py-2">
                      Achivement Premium Tercapai(%)
                    </td>
                    <td className="border border-slate-300 px-2 py-2">
                      {data.tercapaipersenpremium + " % "}
                    </td>
                  </tr>
                  <TrText
                    id="jumlahcustomer"
                    title="Jumlah Customer"
                    desc={data.jumlahcustomer}
                    isEdit={isEdit}
                    onChange={(e) => setJumlahcustomer(parseInt(e.target.value))}
                  />
                  <TrText
                    id="jumlahvisit"
                    title="Jumlah Visit(%)"
                    desc={data.jumlahvisit}
                    isEdit={isEdit}
                    onChange={(e) => setJumlahvisit(parseFloat(e.target.value))}
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
                    <th className="border border-slate-400 p-2">Achivement Total Target</th>
                    <th className="border border-slate-400 p-2">Achivement Total Tercapai</th>
                    <th className="border border-slate-400 p-2">Achivement Total Tercapai(%)</th>
                    <th className="border border-slate-400 p-2">Achivement Gadus Target</th>
                    <th className="border border-slate-400 p-2">Achivement Gadus Tercapai</th>
                    <th className="border border-slate-400 p-2">Achivement Gadus Tercapai(%)</th>
                    <th className="border border-slate-400 p-2">Achivement Premium Target</th>
                    <th className="border border-slate-400 p-2">Achivement Premium Tercapai</th>
                    <th className="border border-slate-400 p-2">Achivement Premium Tercapai(%)</th>
                    <th className="border border-slate-400 p-2">Jumlah Visit(%)</th>
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
  const [targetblntotal, setTargetblntotal] = useState(list.targetblntotal);
  const [tercapaiitotal, setTercapaiitotal] = useState(list.tercapaiitotal);
  const [targetblngadus, setTargetblngadus] = useState(list.targetblngadus);
  const [tercapaiigadus, setTercapaiigadus] = useState(list.tercapaiigadus);
  const [targetblnpremium, setTargetblnpremium] = useState(list.targetblnpremium);
  const [tercapaiipremium, setTercapaiipremium] = useState(list.tercapaiipremium);
  const [jumlahvisit, setJumlahvisit] = useState(list.jumlahvisit);
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
    const formData = { bulan, targetblntotal, tercapaiitotal, targetblngadus, tercapaiigadus, targetblnpremium, tercapaiipremium, jumlahvisit};
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
        id={`targetblntotal${list.id}`}
        value={list.targetblntotal}
        desc=""
        type="number"
        isEdit={listEdit}
        onChange={(e) => setTargetblntotal(parseInt(e.target.value))}
      />
      <TdInput
        id={`tercapaiitotal${list.id}`}
        value={list.tercapaiitotal}
        desc=""
        type="number"
        isEdit={listEdit}
        onChange={(e) => setTercapaiitotal(parseInt(e.target.value))}
      />
      <td className="border border-slate-300 p-2">{list.tercapaipersenntotal}</td>
      <TdInput
        id={`targetblngadus${list.id}`}
        value={list.targetblngadus}
        desc=""
        type="number"
        isEdit={listEdit}
        onChange={(e) => setTargetblngadus(parseInt(e.target.value))}
      />
      <TdInput
        id={`tercapaiigadus${list.id}`}
        value={list.tercapaiigadus}
        desc=""
        type="number"
        isEdit={listEdit}
        onChange={(e) => setTercapaiigadus(parseInt(e.target.value))}
      />
      <td className="border border-slate-300 p-2">{list.tercapaipersenngadus}</td>
      <TdInput
        id={`targetblnpremium${list.id}`}
        value={list.targetblnpremium}
        desc=""
        type="number"
        isEdit={listEdit}
        onChange={(e) => setTargetblnpremium(parseInt(e.target.value))}
      />
      <TdInput
        id={`tercapaiipremium${list.id}`}
        value={list.tercapaiipremium}
        desc=""
        type="number"
        isEdit={listEdit}
        onChange={(e) => setTercapaiipremium(parseInt(e.target.value))}
      />
      <td className="border border-slate-300 p-2">{list.tercapaipersennpremium}</td>
      <TdInput
        id={`jumlahvisit${list.id}`}
        value={list.jumlahvisit}
        desc=""
        type="number"
        isEdit={listEdit}
        onChange={(e) => setJumlahvisit(parseFloat(e.target.value))}
      />
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