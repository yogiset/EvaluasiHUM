import { useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schema/login-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);

  const token = cookies.token;

  useEffect(() => {
    if (token) return navigate("/dashboard/home");
  }, [token, navigate]);

  // Define form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData) => {
      return axios.post("http://localhost:8082/user/login", formData);
    },
    onSuccess: (response) => {
      setCookie("token", response.data.token);
      return redirect("/dashboard/home");
    },
  });

  function onSubmit(formData) {
    mutation.mutate(formData);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center px-2">
      <div className="w-full md:w-[700px] h-max flex bg-gray-100 shadow-2xl rounded-3xl">
        <section className="form w-full md:w-[350px] h-full p-4">
          <Form {...loginForm}>
            <form
              className="w-full h-full flex flex-col items-center justify-center gap-4"
              onSubmit={loginForm.handleSubmit(onSubmit)}
            >
              <h2 className="text-center font-bold w-full py-2 text-sky-800">
                Login
              </h2>
              {mutation.error && (
                <div className="border border-rose-500 rounded p-1 bg-rose-50 text-center">
                  {mutation.error.response.data.message}
                </div>
              )}
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel
                      htmlFor="username"
                      className="text-xl font-medium text-sky-800"
                    >
                      Username
                    </FormLabel>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      autoComplete="off"
                      placeholder="Username"
                      required
                    />
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel
                      htmlFor="password"
                      className="text-xl font-medium text-sky-800"
                    >
                      Password
                    </FormLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      autoComplete="off"
                      placeholder="password"
                      required
                    />
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                type="submit"
                variant="sky"
                disabled={mutation.isPending}
              >
                LOGIN
              </Button>
              <p className="text-sm">Forgot Your Password?</p>
            </form>
          </Form>
        </section>
        <section className="hero-login hidden md:inline w-[350px] min-h-full">
          <div className="w-full h-full flex flex-col justify-center items-center gap-4 bg-sky-800 text-white rounded-l-[100px] rounded-r-3xl">
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
