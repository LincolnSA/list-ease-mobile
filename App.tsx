import { StatusBar } from 'expo-status-bar';
import { AppProviders } from './src/providers';
import { AppRoutes } from './src/routes';

export default function App() {
  return (
    <AppProviders>
      <AppRoutes/>
      
      <StatusBar
        style='light'
        translucent
      />
    </AppProviders>
  );
}
 