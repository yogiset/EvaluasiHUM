import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { picosSchema } from "@/schema/picos-schema";
// import { calcPercent } from "@/lib/utils";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// TODO: Remove or change this later ↓↓↓
import { exampleTahun, exampleBulan } from "@/data/userData";

export const PicosModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const picosForm = useForm({
    resolver: zodResolver(picosSchema),
    defaultValues: {
      nik: "",
      tahun: 0,
      bulan: "",
      pipelinestrength: 0,
      lowtouchratio: 0,
      crosssellratio: 0,
      premiumcontribution: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/picos/createpicos", formData);
    },
    onSuccess: () => {
      picosForm.reset();
      queryClient.invalidateQueries({ queryKey: ["get-all-picos"] });
      toast.success("Added successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to add!");
    },
  });

  function onSubmit(formData) {
    const {
      nik,
      tahun,
      bulan,
      pipelinestrength,
      lowtouchratio,
      crosssellratio,
      premiumcontribution,
    } = formData;

    const newFormData = {
      nik,
      tahun,
      bulan,
      pipelinestrength,
      lowtouchratio,
      crosssellratio,
      premiumcontribution,
    };
    mutation.mutate(newFormData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Tambah Data Picos</DialogTitle>
        </DialogHeader>
        <Form {...picosForm}>
          <form
            onSubmit={picosForm.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormInput
              form={picosForm}
              label="Nik"
              id="nik"
              placeholder="Masukkan Nik"
              type="text"
            />
            <FormSelect
              form={picosForm}
              label="Tahun"
              id="tahun"
              selectItems={exampleTahun}
              placeholder="Pilih Tahun"
            />
            <FormSelect
              form={picosForm}
              label="Bulan"
              id="bulan"
              selectItems={exampleBulan}
              placeholder="Pilih Bulan"
            />
            <FormInput
              form={picosForm}
              label="Pipelinestrength"
              id="pipelinestrength"
              placeholder="Masukkan Pipelinestrength"
              type="number"
            />
            <FormInput
              form={picosForm}
              label="Lowtouchratio"
              id="lowtouchratio"
              placeholder="Masukkan Lowtouchratio"
              type="number"
            />
            <FormInput
              form={picosForm}
              label="Crosssellratio"
              id="crosssellratio"
              placeholder="Masukkan crosssellratio"
              type="number"
            />
            <FormInput
              form={picosForm}
              label="Premiumcontribution"
              id="premiumcontribution"
              placeholder="Masukkan premiumcontribution"
              type="number"
            />
            <div className="flex flex-wrap gap-2">
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
