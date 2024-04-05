import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { himpunankriteriaSchema } from "@/schema/himpunan-kriteria-schema";
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
import {
  exampleKriteria,
  exampleKeterangann,
  exampleNilai,
  exampleHimpunan,
} from "@/data/userData";

export const HimpunanKriteriaModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const himpunanForm = useForm({
    resolver: zodResolver(himpunankriteriaSchema),
    defaultValues: {
      nmkriteria: "",
      nmhimpunan: "",
      nilai: 0,
      keterangan: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/kriteria/createhim", formData);
    },
    onSuccess: () => {
      himpunanForm.reset();
      queryClient.invalidateQueries({
        queryKey: ["get-all-himpunan-kriteria"],
      });
      toast.success("Added successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to add!");
    },
  });

  function onSubmit(formData) {
    const { nmkriteria, nmhimpunan, nilai, keterangan } = formData;

    const newFormData = {
      nmkriteria,
      nmhimpunan,
      nilai,
      keterangan,
    };
    mutation.mutate(newFormData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Tambah Data Kriteria</DialogTitle>
        </DialogHeader>
        <Form {...himpunanForm}>
          <form
            onSubmit={himpunanForm.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormSelect
              form={himpunanForm}
              label="Nama Kriteria"
              id="nmkriteria"
              selectItems={exampleKriteria}
              placeholder="Pilih Kriteria"
            />
            <FormSelect
              form={himpunanForm}
              label="Nama Himpunan"
              id="nmhimpunan"
              placeholder="Pilih Himpunan"
              selectItems={exampleHimpunan}
            />
            <FormSelect
              form={himpunanForm}
              label="Nilai"
              id="nilai"
              placeholder="Pilih nilai"
              selectItems={exampleNilai}
            />
            <FormSelect
              form={himpunanForm}
              label="Keterangan"
              id="keterangan"
              selectItems={exampleKeterangann}
              placeholder="Pilih Keterangan"
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
