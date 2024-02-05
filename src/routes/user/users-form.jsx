import HomeLayout from "@/layouts/home-layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const exampleUsers = [
  { name: "Ahmad Arifin", nik: "P1374" },
  { name: "Asep Syarifudin", nik: "K2390" },
  { name: "Mail bin Mail", nik: "P5971" },
];

const positions = ["Sales", "Manager", "Direktur"];

const UsersForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [position, setPosition] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    const formData = { username, regNumber, position };

    console.log(formData);

    // TODO: Redirect to evaluation page
    navigate("/evaluasi");
  }
  return (
    <HomeLayout>
      <div className="w-full h-screen flex justify-center items-center px-2">
        <div className="w-full md:w-[700px] h-auto flex bg-gray-100 shadow-2xl rounded-3xl">
          <section className="form w-full md:w-[350px] h-full p-4">
            <form
              className="w-full h-full flex flex-col items-center justify-center gap-4"
              onSubmit={handleLogin}
            >
              <h2 className="text-center font-bold w-full py-2 text-sky-800">
                Form Data
              </h2>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="username"
                  className="text-xl font-medium text-sky-800"
                >
                  Username
                </label>
                <Select
                  name="username"
                  onValueChange={(value) => setUsername(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select username" />
                  </SelectTrigger>
                  <SelectContent>
                    {exampleUsers.map((user) => (
                      <SelectItem key={user.nik} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="positions"
                  className="text-xl font-medium text-sky-800"
                >
                  Jabatan
                </label>
                <Select
                  name="positions"
                  onValueChange={(value) => setPosition(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select positions" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position, index) => (
                      <SelectItem key={index} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex flex-col gap-2">
                <label
                  htmlFor="regNumber"
                  className="text-xl font-medium text-sky-800"
                >
                  No Induk
                </label>
                <Input
                  id="regNumber"
                  type="text"
                  autoComplete="off"
                  placeholder="No Induk"
                  onChange={(e) => setRegNumber(e.target.value)}
                  required
                />
              </div>

              <Button variant="sky" className="w-full" type="submit">
                NEXT
              </Button>
            </form>
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
      </div>
    </HomeLayout>
  );
};

export default UsersForm;
