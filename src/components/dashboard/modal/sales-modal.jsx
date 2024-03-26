import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { salesSchema } from "@/schema/sales-schema";
import { calcPercent } from "@/lib/utils";
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
import { exampleTahun, exampleBulan } from "@/data/userData";
import { Separator } from "@/components/ui/separator";

export const SalesModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [salesDetailDtoList, setSalesDetailDtoList] = useState([]);

  const salesForm = useForm({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      nik: "",
      target: 0,
      tercapai: 0,
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
    setSalesDetailDtoList([
      ...salesDetailDtoList,
      { bulan: "", targetbln: 0, tercapaii: 0 },
    ]);
    salesForm.setValue("salesDetailDtoList", [
      ...prev,
      { bulan: "", targetbln: 0, tercapaii: 0 },
    ]);
  }

  function onSubmit(formData) {
    const { nik, tahun, target, tercapai, salesDetailDtoList } = formData;
    const tercapaipersen = calcPercent(target, tercapai).toString() + "%";
    const newSalesDetailDtoList = salesDetailDtoList.map((obj) => {
      return obj;
    });

    const newFormData = {
      nik,
      tahun,
      target,
      tercapai,
      tercapaipersen: tercapaipersen,
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
            <FormInput
              form={salesForm}
              label="Target"
              id="target"
              placeholder="Masukkan Target"
              type="number"
            />
            <FormSelect
              form={salesForm}
              label="Tahun"
              id="tahun"
              selectItems={exampleTahun}
              placeholder="Pilih Tahun"
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
                  label={`Target pencapaian pada Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].targetbln`}
                  placeholder="Masukkan Target per bulan"
                  type="number"
                />
                <FormInput
                  form={salesForm}
                  label={`Target tercapai per Bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].tercapaii`}
                  placeholder="Masukkan Target tarcapai per bulan"
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
