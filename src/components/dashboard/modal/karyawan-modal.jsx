import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { employeeSchema } from "@/schema/employee-schema";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { FormDate } from "../form/form-date";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// TODO: Remove or change this later ↓↓↓
import { exampleDivisi, exampleJabatan } from "@/data/userData";

export const KaryawanModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  // Define a form
  const employeeForm = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      nik: "",
      nama: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/karyawan/addkaryawan", formData);
    },
    onSuccess: () => {
      employeeForm.reset();
      queryClient.invalidateQueries({ queryKey: ["get-all-employee"] });
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
          <DialogTitle>Tambah Karyawan</DialogTitle>
        </DialogHeader>
        <Form {...employeeForm}>
          <form
            onSubmit={employeeForm.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormInput
              form={employeeForm}
              label="NIK"
              id="nik"
              placeholder="Masukkan NIK"
              type="text"
            />
            <FormInput
              form={employeeForm}
              label="Nama"
              id="nama"
              placeholder="Masukkan Nama"
              type="text"
            />
            <FormSelect
              form={employeeForm}
              label="Divisi"
              id="divisi"
              selectItems={exampleDivisi}
              placeholder="Pilih Divisi"
            />
            <FormSelect
              form={employeeForm}
              label="Jabatan"
              id="jabatan"
              selectItems={exampleJabatan}
              placeholder="Pilih Jabatan"
            />
            <FormDate
              form={employeeForm}
              id="tanggalmasuk"
              label="Tanggal masuk"
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
