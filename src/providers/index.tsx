import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from '../contexts/Authentication';
import Toast from "react-native-toast-message";

interface ProvidersProps{
  children: React.ReactNode
}

export function AppProviders(props:ProvidersProps){
  const { children } = props;

  return(
    <NavigationContainer>
      <AuthProvider>
        {children}
      </AuthProvider>

      <Toast 
        visibilityTime={3000}
      />
    </NavigationContainer>
  );
};