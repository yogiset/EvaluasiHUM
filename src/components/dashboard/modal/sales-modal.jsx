import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { salesSchema } from "@/schema/sales-schema";
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
import { exampleTahun, exampleBulan, examplePersen } from "@/data/userData";

export const SalesModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [salesDetailDtoList, setSalesDetailDtoList] = useState([]);

  const salesForm = useForm({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      nik: "",
      target: 0,
      tercapai: 0,
      tercapaipersen: "",
      salesDetailDtoList: [], // Initialize salesDetailDtoList in the form
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

  function onSubmit(data) {
    // Include salesDetailDtoList in the formData
    const formData = { ...data, salesDetailDtoList };
    mutation.mutate(formData);
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
            <FormInput
              form={salesForm}
              label="Tercapai"
              id="tercapai"
              placeholder="Masukkan angka pencapaian"
              type="number"
            />
            <FormSelect
              form={salesForm}
              label="Tercapai %"
              id="tercapaipersen"
              selectItems={examplePersen}
              placeholder="Pilih Persentase"
            />

            {/* Additional form fields for sales detail */}
            {salesDetailDtoList.map((salesDetailDto, index) => (
              <div key={index}>
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
                  label={`Pencapaian pada bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].tercapaii`}
                  placeholder="Masukkan angka perncapaian"
                  type="number"
                />
                <FormSelect
                  form={salesForm}
                  label={`Persentase pencapaian pada bulan ${index + 1}`}
                  id={`salesDetailDtoList[${index}].tercapaipersenn`}
                  placeholder="Pilih Persentase"
                  selectItems={examplePersen}
                  type="text"
                />
              </div>
            ))}
            {/* Button to add new sales detail */}
            <Button
              type="button"
              onClick={() =>
                setSalesDetailDtoList([
                  ...salesDetailDtoList,
                  { bulan: "", targetbln: 0 },
                ])
              }
            >
              Tambah target per bulan
            </Button>
            <Button type="submit" variant="sky" disabled={mutation.isPending}>
              Tambah
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
