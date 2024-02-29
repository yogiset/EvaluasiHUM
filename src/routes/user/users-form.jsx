// import { useEffect } from "react";
import HomeLayout from "@/layouts/home-layout";
import { useNavigate } from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userFormSchema } from "@/schema/user-form-schema";
import { Loading } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { exampleJabatan } from "@/data/userData";

const UsersForm = () => {
  const navigate = useNavigate();
  const [value, setValue] = useLocalStorageState("evData", {
    defaultValue: {},
  });

  // Define the form
  const userForm = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: value.username,
      jabatan: value.jabatan,
      nik: value.nik || "",
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-all-users"],
    queryFn: fetchUsers,
  });

  async function fetchUsers() {
    const response = await axios.get("http://localhost:8082/user/all");

    if (response.status === 200) {
      return response.data;
    }
  }

  function onSubmit(formData) {
    setValue(formData);
    navigate("/evaluasi");
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-xl font-semibold">Error!</h1>
      </div>
    );
  }

  return (
    <HomeLayout>
      <div className="w-full h-screen flex justify-center items-center px-2">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="w-full md:w-[700px] h-auto flex bg-gray-100 shadow-2xl rounded-3xl">
            <section className="form w-full md:w-[350px] h-full p-4">
              <Form {...userForm}>
                <form
                  className="w-full h-full flex flex-col items-center justify-center gap-4"
                  onSubmit={userForm.handleSubmit(onSubmit)}
                >
                  <h2 className="text-center font-bold w-full py-2 text-sky-800">
                    Form Data
                  </h2>

                  <FormSelect
                    id="username"
                    form={userForm}
                    title="Username"
                    data={data}
                    placeholder={
                      value.username ? value.username : "Select username"
                    }
                  />

                  <FormSelect
                    id="jabatan"
                    form={userForm}
                    title="Jabatan"
                    data={exampleJabatan}
                    placeholder={
                      value.jabatan ? value.jabatan : "Select positions"
                    }
                  />

                  <FormInput
                    id="nik"
                    form={userForm}
                    type="text"
                    label="No Induk"
                    placeholder="No Induk"
                  />

                  <Button variant="sky" className="w-full" type="submit">
                    NEXT
                  </Button>
                </form>
              </Form>
            </section>
            <section className="hero-login hidden md:inline w-[350px] min-h-full">
              <div className="w-full h-full flex flex-col justify-center items-center gap-4 bg-sky-800 text-white rounded-l-[150px] rounded-r-3xl">
                <h2 className="text-center text-2xl font-bold">PERINGATAN!</h2>
                <ul className="w-full list-disc ps-20 pe-4">
                  <li>Username harus diisi!</li>
                  <li>Jabatan harus diisi!</li>
                  <li>Nomor Induk harus valid!</li>
                </ul>
              </div>
            </section>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export const FormInput = ({ form, label, id, placeholder, type }) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col gap-2">
          <FormLabel className="text-xl font-medium text-sky-800">
            {label}
          </FormLabel>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

const FormSelect = ({ id, title, form, data, placeholder }) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col gap-2">
          <FormLabel className="text-xl font-medium text-sky-800">
            {title}
          </FormLabel>
          <Select
            id={id}
            name={id}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {data.map((item, index) => (
                <SelectItem
                  key={index}
                  value={id === "username" ? item.username : item}
                >
                  {id === "username" ? item.username : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default UsersForm;
