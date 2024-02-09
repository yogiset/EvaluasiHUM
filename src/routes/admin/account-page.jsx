import { useState } from "react";
import { useCookies } from "react-cookie";
import { useAuth } from "@/lib/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserCog, PencilLine, Trash2, X, Info } from "lucide-react";
import { Loading } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const AccountPage = () => {
  const { id: userId } = useAuth();
  const queryClient = useQueryClient();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditPass, setIsEditPass] = useState(false);

  const [username, setUsername] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-user", userId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8082/user/findById/${userId}`
      );
      return response.data;
    },
  });

  const mutationName = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/user/changeusername", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user", userId] });
      setIsEditName(false);
    },
  });

  function changeUsername() {
    if (!username) return;

    const formData = {
      id: userId,
      oldusername: data.username,
      newusername: username,
    };

    mutationName.mutate(formData);
  }

  const mutationPass = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/user/changepassword", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user", userId] });
      removeCookie("token");
    },
  });

  function changePass() {
    if (!oldPass || !newPass || oldPass === newPass) return;

    const formData = { id: userId, oldpassword: oldPass, newpassword: newPass };

    mutationPass.mutate(formData);
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-xl font-semibold">Error!</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto pt-2 pb-20 space-y-4">
      <div className="space-y-2">
        <h1 className="flex items-center text-2xl md:text-4xl font-semibold">
          <UserCog className="mr-2 w-8 h-8" />
          Pengaturan Akun
        </h1>
        <p className="md:text-lg">Kelola informasi akun Anda</p>
      </div>
      <div className="w-full space-y-2">
        <h1 className="text-lg md:text-xl font-semibold">Profil</h1>
        <Separator />
        <div className="w-full flex justify-between items-center p-2 rounded border border-sky-200 gap-x-2">
          {isEditName ? (
            <Input
              type="text"
              defaultValue={data.username}
              onChange={(e) => setUsername(e.target.value)}
            />
          ) : (
            <h1 className="text-lg font-semibold">{data.username}</h1>
          )}
          {isEditName ? (
            <>
              <Button
                variant="sky"
                onClick={changeUsername}
                disabled={mutationName.isPending}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                className="px-1"
                onClick={() => setIsEditName(false)}
                disabled={mutationName.isPending}
              >
                <X />
              </Button>
            </>
          ) : (
            <Button variant="sky" onClick={() => setIsEditName(true)}>
              <PencilLine className="mr-2 w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
      </div>
      <div className="w-full space-y-2">
        <h1 className="text-lg md:text-xl font-semibold">Security</h1>
        <Separator />
        <div className="w-full space-y-2 p-2">
          <div className="truncate">
            <h1 className="text-lg font-semibold">Password</h1>
            <p className="truncate">
              Pastikan minimal 15 karakter ATAU minimal 8 karakter termasuk
              angka dan huruf kecil.
            </p>
            {mutationPass.isError && (
              <div className="w-full flex items-center p-2 rounded border border-rose-700 bg-rose-50">
                <Info className="w-4 h-4 mr-2" />
                <p>{mutationPass.error.response.data.error}</p>
              </div>
            )}
          </div>
          {isEditPass ? (
            <>
              <div className="w-max">
                <label htmlFor="oldPass">Password Lama:</label>
                <Input
                  name="oldPass"
                  id="oldPass"
                  type="password"
                  className="mb-3"
                  onChange={(e) => setOldPass(e.target.value)}
                />
                <label htmlFor="newPass">Password Baru:</label>
                <Input
                  name="newass"
                  id="newPass"
                  type="password"
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-x-2">
                <Button size="sm" onClick={changePass}>
                  Save
                </Button>
                <Button
                  variant="ghost"
                  className="px-1"
                  onClick={() => setIsEditPass(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditPass(true)}>
              Change Password
            </Button>
          )}
        </div>
      </div>
      <div className="w-full space-y-2">
        <h1 className="text-lg md:text-xl font-semibold">Danger</h1>
        <Separator />
        <div className="w-full flex justify-between items-center bg-rose-50 p-2 rounded border border-rose-700">
          <div className="truncate">
            <h1 className="text-lg font-semibold">Hapus Akun</h1>
            <p className="truncate">
              Hapus akun Anda dan semua data terkaitnya
            </p>
          </div>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
