import { View, ActivityIndicator } from "react-native";
import colors from 'tailwindcss/colors';

export function Loading(){
  return(
    <View className="flex-1 items-center justify-center bg-zinc-950">
       <ActivityIndicator size="large" color={colors.purple[500]} />
    </View>
  );
};