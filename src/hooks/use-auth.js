import { useCookies } from "react-cookie";
import { redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  // get token from cookie
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(["token"]);

  const token = cookies.token;

  // if not exist redirect to login page
  if (!token) return redirect("/adm-login");

  // decode token
  const decoded = jwtDecode(token);

  // return data
  return decoded;
};
