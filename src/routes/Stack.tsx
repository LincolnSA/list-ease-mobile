import { createStackNavigator } from '@react-navigation/stack';

import { SignIn } from '../screens/SignIn';
import { SignUp } from '../screens/SignUp';
import { Dashboard } from '../screens/Dashboard';
import { useContext } from 'react';
import { AuthContext } from '../contexts/Authentication';

const Stack = createStackNavigator();

export function StackRoute() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator 
      initialRouteName="sign-in"
      screenOptions={{
        headerMode: "screen",
        headerShown: false
      }}
    >
      {
        user 
        ? (
          <Stack.Screen
            name="dashboard"
            component={Dashboard}
          />
        )
        : (
          <>
            <Stack.Screen
              name="sign-in"
              component={SignIn}
            />

            <Stack.Screen
              name="sign-up"
              component={SignUp}
            />
          </>
        )
      }
    </Stack.Navigator>
  );
}