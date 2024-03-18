import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
import { exampleTahun } from "@/data/userData";

export const SalesModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  // Define a form
  const salesForm = useForm({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      target: "",
      tahun: "",
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

  function onSubmit({ nik, target, tahun }) {
    const formData = {
      nik,
      target,
      tahun,
    };
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
              type="text"
            />
            <FormSelect
              form={salesForm}
              label="Tahun"
              id="tahun"
              selectItems={exampleTahun}
              placeholder="Pilih Tahun"
            />
            <Button type="submit" variant="sky" disabled={mutation.isPending}>
              Tambah
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
