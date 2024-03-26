import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salesDetailSchema } from "@/schema/sales-detail-schema";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { calcPercent } from "@/lib/utils";
import { toast } from "sonner";
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
import { exampleBulan } from "@/data/userData";

export const SalesTargetModal = ({ open, onClose, idsales }) => {
  const queryClient = useQueryClient();

  const salesTargetForm = useForm({
    resolver: zodResolver(salesDetailSchema),
    defaultValues: {
      bulan: "",
      targetbln: 0,
      tercapaii: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post(
        "http://localhost:8082/salesdetail/createsalesdetail",
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-sales", idsales] });
      toast.success("Updated successfully!");
      salesTargetForm.reset();
      onClose();
    },
    onError: () => {
      toast.error("Failed to update!");
    },
  });

  function onSubmit(e) {
    e.preventDefault();
    const { bulan, targetbln, tercapaii } = salesTargetForm.getValues();
    if (bulan.length === 0) return;

    const formData = {
      idsales: parseInt(idsales),
      bulan,
      targetbln: parseInt(targetbln),
      tercapaii: parseInt(tercapaii),
    };

    mutation.mutate(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Target Sales</DialogTitle>
        </DialogHeader>
        <Form {...salesTargetForm}>
          <form onSubmit={(e) => onSubmit(e)} className="space-y-4">
            <FormSelect
              form={salesTargetForm}
              label="Bulan"
              id="bulan"
              placeholder="Masukkan bulan"
              selectItems={exampleBulan}
              type="text"
            />
            <FormInput
              form={salesTargetForm}
              label="Target Bulan"
              id="targetbln"
              placeholder="Masukkan target/bulan"
              type="number"
            />
            <FormInput
              form={salesTargetForm}
              label="Tercapai"
              id="tercapaii"
              placeholder="Masukkan tercapai/bulan"
              type="number"
            />
            <div className="flex gap-x-2">
              <Button type="submit" variant="sky" disabled={mutation.isPending}>
                Tambah
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
