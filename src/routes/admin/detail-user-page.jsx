import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ChevronsRight, PencilLine, Info } from "lucide-react";
import { toast } from "sonner";
import { userSchema } from "@/schema/user-schema";
import { CustomAlert } from "@/components/dashboard/custom-alert";
import { Loading } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// TODO: Remove or change this later ↓↓↓
import { exampleRole } from "@/data/userData";

const DetailUserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false); // Edit state

  const [errorData, setErrorData] = useState([]);
  const [errorValidation, setErrorValidation] = useState(false);

  const [nik, setNik] = useState("");
  const [kodeuser, setKodeuser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-user", userId],
    queryFn: fetchUser,
  });

  async function fetchUser() {
    const response = await axios.get(
      `http://localhost:8082/user/findById/${userId}`
    );

    if (response.status === 200) {
      console.table(response.data);
      setNik(response.data.nik);
      setKodeuser(response.data.kodeuser);
      setUsername(response.data.username);
      setRole(response.data.role);
      setStatus(response.data.status);
      return response.data;
    }
  }

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.put(
        `http://localhost:8082/user/edituser/${userId}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user", userId] });
      toast.success("Updated successfully!");
      setIsEdit(false);
    },
    onError: () => {
      toast.error("Failed to update!");
    },
  });

  function saveEditedUser() {
    const formData = {
      username,
      kodeuser,
      password,
      role,
      status,
      nik,
    };
    const { success, data, error } = userSchema.safeParse(formData);

    if (!success) {
      setErrorData(JSON.parse(error));
      setErrorValidation(true);
      return;
    }

    if (password.length > 0 && password.length < 6) {
      setErrorData([{ message: "Password must be at least 6 characters" }]);
      setErrorValidation(true);
      return;
    }

    setErrorValidation(false);
    mutation.mutate(data);
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col text-center">
        <Info />
        <h1 className="text-xl font-semibold">Error!</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex items-center gap-x-2 font-medium p-2">
        <Link to={"/dashboard/users"} className="hover:underline">
          USER
        </Link>
        <ChevronsRight />
        <p>{userId}</p>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full h-full">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="p-2 space-y-4 pb-20">
              <h1 className="text-lg md:text-xl font-semibold">Detail User</h1>
              {errorValidation && (
                <CustomAlert variant="destructive" data={errorData} />
              )}
              <table className="w-full border-collapse bg-sky-50 border border-slate-400">
                <tbody>
                  <tr>
                    <td className="font-medium border border-slate-300 px-2 py-2">
                      NIK
                    </td>
                    <td className="border border-slate-300 px-2 py-2">
                      <p>{data.nik}</p>
                    </td>
                  </tr>
                  <TrText
                    id="kodeuser"
                    title="Kode user"
                    desc={data.kodeuser}
                    isEdit={isEdit}
                    onChange={(e) => setKodeuser(e.target.value)}
                  />
                  <TrText
                    id="username"
                    title="Username"
                    desc={data.username}
                    isEdit={isEdit}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TrSelect
                    id="role"
                    title="Role"
                    desc={data.role}
                    isEdit={isEdit}
                    selectItems={exampleRole}
                    placeholder={data.role}
                    onValueChange={(e) => setRole(e)}
                  />
                  <TrSelect
                    id="status"
                    title="Status"
                    desc={data.status ? "Aktif" : "Nonaktif"}
                    isEdit={isEdit}
                    selectItems={["Aktif", "Nonaktif"]}
                    placeholder={data.status ? "Aktif" : "Nonaktif"}
                    onValueChange={(e) =>
                      setStatus(e === "Aktif" ? true : false)
                    }
                  />
                  <TrText
                    id="password"
                    type="password"
                    title="Password"
                    desc="123456"
                    isEdit={isEdit}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </tbody>
              </table>
              <div className="flex gap-x-2">
                {isEdit ? (
                  <>
                    <Button
                      variant="sky"
                      onClick={saveEditedUser}
                      disabled={mutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEdit(false)}
                      disabled={mutation.isPending}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="sky" onClick={() => setIsEdit(true)}>
                      <PencilLine className="mr-2 w-5 h-5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard/users")}
                    >
                      Kembali
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrText = ({ id, type = "text", title, desc, isEdit, onChange }) => {
  return (
    <tr>
      <td className="font-medium border border-slate-300 px-2 py-2">{title}</td>
      <td className="border border-slate-300 px-2 py-2">
        {isEdit ? (
          <Input type={type} id={id} defaultValue={desc} onChange={onChange} />
        ) : (
          <p>{type === "password" ? "••••••" : desc}</p>
        )}
      </td>
    </tr>
  );
};

const TrSelect = ({
  title,
  desc,
  isEdit,
  id,
  placeholder,
  selectItems,
  onValueChange,
}) => {
  return (
    <tr>
      <td className="font-medium border border-slate-300 px-2 py-2">{title}</td>
      <td className="border border-slate-300 px-2 py-2">
        {isEdit ? (
          <Select id={id} name={id} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {selectItems.map((item, index) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>{desc}</p>
        )}
      </td>
    </tr>
  );
};

export default DetailUserPage;
