import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bobotkriteriaSchema } from "@/schema/bobot-kriteria-schema";
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
} from "@/data/userData";

export const BobotKriteriaModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const bobotForm = useForm({
    resolver: zodResolver(bobotkriteriaSchema),
    defaultValues: {
      nmkriteria: "",
      bobot: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/bobotkriteria/createbobot", formData);
    },
    onSuccess: () => {
      bobotForm.reset();
      queryClient.invalidateQueries({
        queryKey: ["get-all-bobot-kriteria"],
      });
      toast.success("Added successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to add!");
    },
  });

  function onSubmit(formData) {
    const { nmkriteria, bobot } = formData;

    const newFormData = {
      nmkriteria,
        bobot,
    };
    mutation.mutate(newFormData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Tambah Data Bobot</DialogTitle>
        </DialogHeader>
        <Form {...bobotForm}>
          <form
            onSubmit={bobotForm.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormSelect
              form={bobotForm}
              label="Nama Kriteria"
              id="nmkriteria"
              selectItems={exampleKriteria}
              placeholder="Pilih Kriteria"
            />
            <FormInput
              form={bobotForm}
              label="Bobot"
              id="bobot"
              placeholder="Masukan Bobot"
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
