import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { salesSchema } from "@/schema/sales-schema";
// import { calcPercent } from "@/lib/utils";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// TODO: Remove or change this later ↓↓↓
import { exampleTahun, exampleBulan, exampleKeterangan } from "@/data/userData";
import { Separator } from "@/components/ui/separator";

export const SalesModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [salesDetailDtoList, setSalesDetailDtoList] = useState([]);

  const salesForm = useForm({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      nik: "",
      targettotal: "",
      tercapaitotal: "",
      targetgadus: "",
      tercapaigadus: "",
      targetpremium: "",
      tercapaipremium: "",
      jumlahcustomer: "",
      jumlahvisit: "",
      salesDetailDtoList: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post(
        "http://localhost:8082/sales/createdatasales",
        formData
      );
    },
    onSuccess: () => {
      salesForm.reset();
      queryClient.invalidateQueries({ queryKey: ["get-all-sales"] });
      toast.success("Added successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to add!");
    },
  });

  function addSalesDetailDtoList() {
    const prev = salesForm.getValues("salesDetailDtoList");
    const monthIndex = salesDetailDtoList.length;
    if (monthIndex < 12) {
      const newDetail = {
        bulan: exampleBulan[monthIndex],
        targetblntotal: "",
        tercapaiitotal: "",
        targetblngadus: "",
        tercapaiigadus: "",
        targetblnpremium: "",
        tercapaiipremium: "",
        jumlahvisit: "",
      };
      setSalesDetailDtoList([...salesDetailDtoList, newDetail]);
      salesForm.setValue("salesDetailDtoList", [...prev, newDetail]);
    }
  }

  function onSubmit(formData) {
    const { nik, tahun, targettotal, tercapaitotal, targetgadus, tercapaigadus, targetpremium, tercapaipremium, jumlahcustomer, jumlahvisit, salesDetailDtoList } =
      formData;
    // const tercapaipersen = calcPercent(target, tercapai).toString() + "%";
    const newSalesDetailDtoList = salesDetailDtoList.map((obj) => {
      return obj;
    });

    const newFormData = {
      nik,
      tahun,
      targettotal,
      tercapaitotal,
      targetgadus,
      tercapaigadus,
      targetpremium,
      tercapaipremium,
      jumlahcustomer,
      jumlahvisit,
      salesDetailDtoList: newSalesDetailDtoList,
    };
    mutation.mutate(newFormData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Tambah Data Sales</DialogTitle>
        </DialogHeader>
        <Form {...salesForm}>
          <form
            onSubmit={salesForm.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormInput
              form={salesForm}
              label="Nik"
              id="nik"
              placeholder="Masukkan Nik"
              type="text"
            />
            <FormSelect
              form={salesForm}
              label="Tahun"
              id="tahun"
              selectItems={exampleTahun}
              placeholder="Pilih Tahun"
            />
            <FormInput
            form={salesForm}
            label="Achivement Total Target"
            id="targettotal"
            placeholder="0"
            type="number"
            />
            <FormInput
            form={salesForm}
            label="Achivement Gadus Target"
            id="targetgadus"
            placeholder="0"
            type="number"
            />
            <FormInput
              form={salesForm}
              label="Achivement Premium Target"
              id="targetpremium"
              placeholder="0"
              type="number"
            />
            <FormInput
              form={salesForm}
              label="Jumlah Customer"
              id="jumlahcustomer"
              placeholder="0"
              type="number"
            />

            {/* Additional form fields for sales detail */}
            {salesDetailDtoList.map((salesDetailDto, index) => (
              <div key={index}>
                <Separator className="h-1 bg-blue-950 my-2" />
                <FormSelect
                  form={salesForm}
                  label={`Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].bulan`}
                  placeholder="Pilih Bulan"
                  selectItems={exampleBulan}
                  type="text"
                />
                <FormInput
                  form={salesForm}
                  label={`Achivement Total Target Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].targetblntotal`}
                  placeholder="0"
                  type="number"
                />
                <FormInput
                  form={salesForm}
                  label={`Achivement Total Tercapai Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].tercapaiitotal`}
                  placeholder="0"
                  type="number"
                />
                <FormInput
                  form={salesForm}
                  label={`Achivement Gadus Target Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].targetblngadus`}
                  placeholder="0"
                  type="number"
                />
                <FormInput
                  form={salesForm}
                  label={`Achivement Gadus Tercapai Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].tercapaiigadus`}
                  placeholder="0"
                  type="number"
                />
                <FormInput
                  form={salesForm}
                  label={`Achivement Premium Target Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].targetblnpremium`}
                  placeholder="0"
                  type="number"
                />
                <FormInput
                  form={salesForm}
                  label={`Achivement Premium Tercapai Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].tercapaiipremium`}
                  placeholder="0"
                  type="number"
                />
                <FormInput
                  form={salesForm}
                  label={`Jumlah Visit per Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].jumlahvisit`}
                  placeholder="0"
                  type="number"
                />
              </div>
            ))}
            {/* Button to add new sales detail */}
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={addSalesDetailDtoList}>
                Tambah target per bulan
              </Button>
              <Button type="submit" variant="sky" disabled={mutation.isPending}>
                Tambah
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
