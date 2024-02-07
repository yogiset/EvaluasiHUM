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
const exampleRole = ["ADMIN", "USER"];

export const UserModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [nik, setNik] = useState("");
  const [kodeUser, setKodeUser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/user/createaccount", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-users"] });
      onClose();
    },
  });

  function onSubmit(e) {
    e.preventDefault();

    const formData = { nik, username, password, role, kodeuser: kodeUser };
    mutation.mutate(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>Buat User</DialogTitle>
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
            label="Kode user"
            id="kodeUser"
            placeholder="Kode user"
            type="text"
            onChange={(e) => setKodeUser(e.target.value)}
          />
          <FormInput
            label="Username"
            id="username"
            placeholder="Username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormInput
            label="Password"
            id="password"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormSelect
            label="Role"
            id="role"
            onValueChange={(e) => setRole(e)}
            selectItems={exampleRole}
            placeholder="Pilih Role"
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
