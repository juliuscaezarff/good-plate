import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

import { Recognition } from './src/screens/Recognition';
import { Loading } from './src/components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if(!fontsLoaded) {
    return <Loading />;
  }
  return (
    <>
     <StatusBar 
      style='dark'
      backgroundColor='transparent'
      translucent
     />

     <Recognition />
    </>
  );
}
