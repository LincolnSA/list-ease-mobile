import { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import { TOKEN_LOCAL_STORAGE } from '@env'; 
import { setLocalStorage, getLocalStorage, deleteLocalStorage } from '../hooks/useLocalStorage';

interface UserDto {
  name: string;
  email: string;
}

interface SignInDto {
  email: string;
  password: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextDto {
  user: UserDto | null;
  handleSignIn: (data: SignInDto) => Promise<void>
  handleLogout: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextDto);

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  const navigation = useNavigation();
  const [ user, setUser ] = useState<UserDto | null>(null);

  useEffect(() => {
    handleGetUpdatedUser();
  }, []);

  async function handleSignIn(input: SignInDto) {
    const { email, password } = input;

    const response = await api.post("/login", {
      email,
      password
    });

    const { token, user } = response.data.data;

    await setLocalStorage({
      key: TOKEN_LOCAL_STORAGE,
      value: token
    });

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    setUser(user);

    navigation.navigate("dashboard");
  };

  async function handleLogout() {

    await deleteLocalStorage({
      key: TOKEN_LOCAL_STORAGE
    });

    setUser(null);

    navigation.navigate("sign-in");
  };

  async function handleGetUpdatedUser() {
    try {
      const token = await getLocalStorage({
        key: TOKEN_LOCAL_STORAGE,
      });
      
      if(!token){
        
        setUser(null);

        navigation.navigate("sign-in");

        return;
      };

      const response = await api.get("/users");

      setUser(response.data.data);

      navigation.navigate("dashboard");
    } catch (error) {

      await handleLogout();
    };
  };

  return (
    <AuthContext.Provider value={{ user, handleSignIn, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};