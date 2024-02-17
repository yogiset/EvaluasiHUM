import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/schema/register-schema";
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
const exampleRole = ["ADMIN", "USER"];

export const UserModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  // Define a form
  const regForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nik: "",
      kodeuser: "",
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/user/createaccount", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
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
          <DialogTitle>Buat User</DialogTitle>
        </DialogHeader>
        <Form {...regForm}>
          <form onSubmit={regForm.handleSubmit(onSubmit)} className="space-y-3">
            <FormInput
              form={regForm}
              label="NIK"
              id="nik"
              placeholder="Masukkan NIK"
              type="text"
            />
            <FormInput
              form={regForm}
              label="Kode user"
              id="kodeuser"
              placeholder="Kode user"
              type="text"
            />
            <FormInput
              form={regForm}
              label="Username"
              id="username"
              placeholder="Username"
              type="text"
            />
            <FormInput
              form={regForm}
              label="Password"
              id="password"
              placeholder="Password"
              type="password"
            />
            <FormSelect
              form={regForm}
              label="Role"
              id="role"
              selectItems={exampleRole}
              placeholder="Pilih Role"
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
