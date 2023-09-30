import React from "react";
import { 
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Checkbox from 'expo-checkbox';
import { FontAwesome5, MaterialIcons, Feather} from '@expo/vector-icons';
import colors from "tailwindcss/colors";

export interface ItemDto{
  id: string,
	name: string,
	amount: string,
	amount_type: "und" | "l" | "kg",
	category: "Padaria" | "Legume" | "Carne" | "Fruta" | "Bebida",
	checked: boolean,
}

interface ItemProps{
  item: ItemDto,
  handleUpdateItem: (item: ItemDto) => Promise<void>;
  handleDeleteItem: (id: string) => Promise<void>;
}

const categoriesType = {
  Padaria:{
    colors:"bg-yellow-500",
    icon: <FontAwesome5 name="hamburger" size={21} color={colors.yellow[800]} />
  },
  Legume:{
    colors:"bg-green-500",
    icon: <FontAwesome5 name="carrot" size={21} color={colors.green[800]}/>
  },
  Carne:{
    colors:"bg-pink-500",
    icon: <FontAwesome5 name="fish" size={21} color={colors.pink[800]}/>
  },
  Fruta:{
    colors:"bg-orange-500",
    icon: <FontAwesome5 name="apple-alt" size={21} color={colors.orange[800]}/>
  },
  Bebida:{
    colors:"bg-blue-500",
    icon: <FontAwesome5 name="beer" size={21} color={colors.blue[800]}/>
  }
};

export function Item(props: ItemProps){
  const { item, handleUpdateItem, handleDeleteItem } = props;
  const {id, name, amount, amount_type, category, checked} = item;

  return(
    <View /* className={`flex-row items-center bg-zinc-900 p-4 rounded-md border-2 border-zinc-800 ${checked ? "opacity-60" : ""}`} */
      style={{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor: colors.zinc[900],
        padding:16,
        borderRadius: 6,
        borderWidth: 2,
        borderColor:colors.zinc[800],
        opacity: checked ? 0.6 : 1,
      }}
    >
      <Checkbox
        value={checked}
        onValueChange={() => handleUpdateItem({id, name, amount, amount_type, category, checked: !checked})}  
        color={checked ? colors.green[500] : undefined} 
      />

      <View className="flex-1 mx-2">
        <Text className="text-zinc-50 text-base font-bold">{name}</Text>
        <Text className="text-zinc-50 text-sm">{`${amount} ${amount_type}`}</Text>
      </View>

      <View className={`items-center justify-center h-8 w-8 rounded-full ${categoriesType[category].colors}`}>
        { categoriesType[category].icon }
      </View>

      <TouchableOpacity className="items-center justify-center h-8 w-8 mx-1" disabled>
        <Feather name="edit-3" size={24} color={colors.zinc[800]} />
      </TouchableOpacity>

      <TouchableOpacity 
        className="items-center justify-center h-8 w-8"
        onPress={() => handleDeleteItem(id)}
      >
        <MaterialIcons name="delete" size={24} color={colors.zinc[50]} />
      </TouchableOpacity>
    </View>
  )
}