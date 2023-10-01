import { createStackNavigator } from '@react-navigation/stack';
import { Dashboard } from '../../screens/Dashboard';

const Stack = createStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerMode: "screen",
        headerShown: false
      }}
    >
      <Stack.Screen
        name="dashboard"
        component={Dashboard}
      />
    </Stack.Navigator>
  );
}