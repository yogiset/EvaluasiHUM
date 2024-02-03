import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const formData = { username, password };
    try {
      const response = await axios.post(
        "http://localhost:8082/user/login",
        formData
      );

      await setCookie("token", response.data.token);

      if (response.status === 200) navigate("/dashboard/home");
    } catch (err) {
      // TODO: Error handling
      console.log(err);
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center px-2">
      <div className="w-full md:w-[700px] h-[400px] flex bg-gray-100 shadow-2xl rounded-3xl">
        <section className="form w-full md:w-[350px] h-full p-4">
          <form
            className="w-full h-full flex flex-col items-center justify-center gap-4"
            onSubmit={handleLogin}
          >
            <h2 className="text-center font-bold w-full py-2 text-sky-800">
              Login
            </h2>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-xl font-medium text-sky-800"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                autoComplete="off"
                placeholder="Asep Syaipulloh"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xl font-medium text-sky-800"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="off"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" variant="sky">
              LOGIN
            </Button>
            <p className="text-sm">Forgot Your Password?</p>
          </form>
        </section>
        <section className="hero-login hidden md:inline w-[350px] h-full">
          <div className="w-full h-full flex flex-col justify-center items-center gap-4 bg-sky-800 text-white rounded-l-[150px] rounded-r-3xl">
            <h2 className="text-center text-4xl font-bold">Hi, Admin!</h2>
            <p className="text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              corporis!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
