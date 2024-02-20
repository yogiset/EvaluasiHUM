import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import generateUniqueId from "generate-unique-id";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ruleSchema } from "@/schema/rule-schema";
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
import { exampleJabatan } from "@/data/userData";

export const RuleModal = ({ open, onClose }) => {
  // const baseUrl = import.meta.env.VITE_BASE_URL;
  const queryClient = useQueryClient();
  const defaultKodeRule = generateUniqueId({ length: 8 });

  // Define a form
  const ruleForm = useForm({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      koderule: defaultKodeRule,
      rule: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/rule/addrule", formData); // TODO: Change this latter
    },
    onSuccess: () => {
      ruleForm.reset({ koderule: defaultKodeRule, rule: "" });
      queryClient.invalidateQueries({ queryKey: ["get-rules"] });
      toast.success("Added successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to add!");
    },
  });

  function onSubmit(formData) {
    mutation.mutate(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Tambah Rule</DialogTitle>
        </DialogHeader>
        <Form {...ruleForm}>
          <form
            onSubmit={ruleForm.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormInput
              form={ruleForm}
              label="Kode rule"
              id="koderule"
              placeholder="Masukkan kode rule"
              type="text"
            />
            <FormInput
              form={ruleForm}
              label="Rule"
              id="rule"
              placeholder="Masukkan rule"
              type="text"
            />
            <FormSelect
              form={ruleForm}
              label="Jabatan"
              id="jabatan"
              selectItems={exampleJabatan}
              placeholder="Pilih Jabatan"
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
