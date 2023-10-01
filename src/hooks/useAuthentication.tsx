import { useContext } from "react";
import { AuthContext } from "../contexts/Authentication";

export function useAuthentication(){
  const authContext = useContext(AuthContext);

  return authContext;
}