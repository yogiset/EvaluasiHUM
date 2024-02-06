import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// TODO: Remove or change this later ↓↓↓
import { exampleDivisi, exampleJabatan } from "@/data/userData";

export const KaryawanModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [nik, setNik] = useState("");
  const [nama, setNama] = useState("");
  const [divisi, setDivisi] = useState("");
  const [jabatan, setJabatan] = useState("");

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/karyawan/addkaryawan", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-employee"] });
      onClose();
    },
  });

  function onSubmit(e) {
    e.preventDefault();

    const formData = { nik, nama, divisi, jabatan };
    mutation.mutate(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b">
          <DialogTitle>Tambah Karyawan</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <FormInput
            label="NIK"
            id="nik"
            placeholder="Masukkan NIK"
            type="text"
            onChange={(e) => setNik(e.target.value)}
          />
          <FormInput
            label="Nama"
            id="name"
            placeholder="Masukkan Nama"
            type="text"
            onChange={(e) => setNama(e.target.value)}
          />
          <FormSelect
            label="Divisi"
            id="divisi"
            onValueChange={(e) => setDivisi(e)}
            selectItems={exampleDivisi}
            placeholder="Pilih Divisi"
          />
          <FormSelect
            label="Jabatan"
            id="jabatan"
            onValueChange={(e) => setJabatan(e)}
            selectItems={exampleJabatan}
            placeholder="Pilih Jabatan"
          />
          <Button type="submit" variant="sky" disabled={mutation.isPending}>
            Tambah
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const FormInput = ({ label, id, placeholder, type, onChange }) => {
  return (
    <div className="w-full space-y-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <Input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

const FormSelect = ({ label, id, onValueChange, selectItems, placeholder }) => {
  return (
    <div className="w-full space-y-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <Select id={id} name={id} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {selectItems.map((position, index) => (
            <SelectItem key={index} value={position}>
              {position}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
