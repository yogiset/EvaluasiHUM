import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import generateUniqueId from "generate-unique-id";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// TODO: Remove or change this later ↓↓↓
import { exampleDivisi } from "@/data/userData";

export const RuleModal = ({ open, onClose }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const queryClient = useQueryClient();
  const defaultKodeRule = generateUniqueId({ length: 8 });

  const [koderule, setKoderule] = useState("");
  const [rule, setRule] = useState("");
  const [divisi, setDivisi] = useState("");

  useEffect(() => {
    if (open) {
      setKoderule(defaultKodeRule);
    }
  }, [defaultKodeRule, open]);

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post(`${baseUrl}/rules`, formData); // TODO: Change this latter
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-rules"] });
      onClose();
    },
  });

  function onSubmit(e) {
    e.preventDefault();
    if (!koderule || !rule || !divisi) return;

    const formData = { koderule, rule, divisi };
    mutation.mutate(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Tambah Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <FormInput
            label="Kode rule"
            id="koderule"
            placeholder="Masukkan kode rule"
            type="text"
            defaultValue={defaultKodeRule}
            onChange={(e) => setKoderule(e.target.value)}
          />
          <FormInput
            label="Rule"
            id="rule"
            placeholder="Masukkan rule"
            type="text"
            onChange={(e) => setRule(e.target.value)}
          />
          <FormSelect
            label="Divisi"
            id="divisi"
            onValueChange={(e) => setDivisi(e)}
            selectItems={exampleDivisi}
            placeholder="Pilih Divisi"
          />
          <Button type="submit" variant="sky" disabled={mutation.isPending}>
            Tambah
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
