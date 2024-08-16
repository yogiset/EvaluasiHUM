import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cptSchema } from "@/schema/cpt-schema";
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
import { exampleTahun } from "@/data/userData";

export const CptModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const cptForm = useForm({
    resolver: zodResolver(cptSchema),
    defaultValues: {
      nik: "",
      tahun: "",
      panolcustomer: "",
      coverage: "",
      penetration: "",
      premiumcontribution: "",
      throughput: "",
      hitrate: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/cpt/createcpt", formData);
    },
    onSuccess: () => {
      cptForm.reset();
      queryClient.invalidateQueries({ queryKey: ["get-all-cpt"] });
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
      panolcustomer,
      coverage,
      penetration,
      throughput,
      hitrate,
    } = formData;

    const newFormData = {
      nik,
      tahun,
      panolcustomer,
      coverage,
      penetration,
      throughput,
      hitrate,
    };
    mutation.mutate(newFormData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Tambah Data CPT</DialogTitle>
        </DialogHeader>
        <Form {...cptForm}>
          <form onSubmit={cptForm.handleSubmit(onSubmit)} className="space-y-3">
            <FormInput
              form={cptForm}
              label="Nik"
              id="nik"
              placeholder="Masukkan Nik"
              type="text"
            />
            <FormSelect
              form={cptForm}
              label="Tahun"
              id="tahun"
              selectItems={exampleTahun}
              placeholder="Pilih Tahun"
            />
            <FormInput
              form={cptForm}
              label="Panolcustomer"
              id="panolcustomer"
              placeholder="0"
              type="number"
            />
            <FormInput
              form={cptForm}
              label="Coverage"
              id="coverage"
              placeholder="0"
              type="number"
            />
            <FormInput
              form={cptForm}
              label="Penetration"
              id="penetration"
              placeholder="0"
              type="number"
            />
            <FormInput
              form={cptForm}
              label="Throughput"
              id="throughput"
              placeholder="0"
              type="number"
            />
            <FormInput
              form={cptForm}
              label="Hitrate"
              id="hitrate"
              placeholder="0"
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
