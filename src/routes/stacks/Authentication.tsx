import { createStackNavigator } from '@react-navigation/stack';
import { SignIn } from '../../screens/SignIn';
import { SignUp } from '../../screens/SignUp';

const Stack = createStackNavigator();

export function AuthenticationStack() {
  return (
    <Stack.Navigator 
      initialRouteName="sign-in"
      screenOptions={{
        headerMode: "screen",
        headerShown: false
      }}
    >
      <Stack.Screen
        name="sign-in"
        component={SignIn}
      />

      <Stack.Screen
        name="sign-up"
        component={SignUp}
      />
    </Stack.Navigator>
  );
}