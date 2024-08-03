import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { salesDetailSchema } from "@/schema/sales-detail-schema";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { calcPercent } from "@/lib/utils";
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
      targetblntotal: 0,
      tercapaiitotal: 0,
      targetblngadus: 0,
      tercapaiigadus: 0,
      targetblnpremium: 0,
      tercapaiipremium: 0,
      jumlahvisit: 0,
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
    const { bulan, targetblntotal, tercapaiitotal, targetblngadus, tercapaiigadus, targetblnpremium, tercapaiipremium, jumlahvisit } = salesTargetForm.getValues();
    if (bulan.length === 0) return;

    const formData = {
      idsales: parseInt(idsales),
      bulan,
      targetblntotal: parseInt(targetblntotal),
      tercapaiitotal: parseInt(tercapaiitotal),
      targetblngadus: parseInt(targetblngadus),
      tercapaiigadus: parseInt(tercapaiigadus),
      targetblnpremium: parseInt(targetblnpremium),
      tercapaiipremium: parseInt(tercapaiipremium),
      jumlahvisit: parseFloat(jumlahvisit)

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
              label="Target Total per Bulan"
              id="targetblntotal"
              placeholder="Masukkan total target /bulan"
              type="number"
            />
            <FormInput
              form={salesTargetForm}
              label="Tercapaitotal"
              id="tercapaiitotal"
              placeholder="Masukkan total tercapai/bulan"
              type="number"
            />
            <FormInput
              form={salesTargetForm}
              label="Target gadus Bulan"
              id="targetblngadus"
              placeholder="Masukkan target gadus/bulan"
              type="number"
            />
            <FormInput
              form={salesTargetForm}
              label="Tercapaigadus"
              id="tercapaiigadus"
              placeholder="Masukkan gadus tercapai/bulan"
              type="number"
            />
            <FormInput
              form={salesTargetForm}
              label="Target premium Bulan"
              id="targetblnpremium"
              placeholder="Masukkan target premium/bulan"
              type="number"
            />
            <FormInput
              form={salesTargetForm}
              label="Tercapaipremium"
              id="tercapaiipremium"
              placeholder="Masukkan premium tercapai/bulan"
              type="number"
            />
            <FormInput
              form={salesTargetForm}
              label="Jumlahvisit"
              id="jumlahvisit"
              placeholder="Masukkan jumlahvisit/bulan"
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
