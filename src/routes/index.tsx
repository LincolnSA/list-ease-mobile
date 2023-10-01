import { useAuthentication } from '../hooks/useAuthentication';
import {AppStack} from './stacks/App';
import { AuthenticationStack } from './stacks/Authentication';

export function AppRoutes(){
  const { user } = useAuthentication();

  return ( user ? <AppStack/> : <AuthenticationStack/> );
}