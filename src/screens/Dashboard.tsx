import React, { useContext, useEffect, useState } from "react";
import { 
  Text,
  View,
  Image,
  Keyboard,
  FlatList,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import { api } from "../services/api";
import { socket } from "../services/socket";
import { AuthContext } from "../contexts/Authentication";
import { Loading } from "../components/Loading";
import colors from "tailwindcss/colors";
import BackgroundImage from '../assets/backgorund.png';
import Toast from "react-native-toast-message";
import { Item, ItemDto } from "../components/Item";

const schema = z.object({
  name: z.string().nonempty(),
  amount: z.string().min(1),
  amountType: z
  .union([ z.literal("und"), z.literal("l"), z.literal("kg")]),
  category: z
  .union([ z.literal("Padaria"), z.literal("Legume"), z.literal("Carne"), z.literal("Fruta"), z.literal("Bebida") ])
}).required();

type schemaType = z.infer<typeof schema>;

const units: Array<ItemDto["amount_type"]> = ["und", "l", "kg"];
const categories: Array<ItemDto["category"]> = ["Padaria", "Legume", "Carne", "Fruta", "Bebida"];

export function Dashboard(){
  const { user, handleLogout } = useContext(AuthContext);
  const [ items, setItems] = useState<ItemDto[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const { 
    control,
    setValue,
    getValues,
    handleSubmit
   } = useForm<schemaType>({ resolver: zodResolver(schema) });

  useEffect(() => {
    handleResetForm();
    handleListItems();
  }, []);

  useEffect(() => {
    socket.on("update-list", async (data) => {
      await handleResetForm();
      await  handleListItems();
    });
  },[]);

  async function handleResetForm(): Promise<void>{
    setValue('name', "");
    setValue('amount', "1");
    setValue('amountType', "und");
    setValue('category', "Padaria");
  };

  async function handleListItems(): Promise<void> {
    try {
      setIsLoading(true);

      const response = await api.get("/items");

      setItems(response.data.data);

    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";

      Toast.show({
        type: "error",
        text1: message,
      });
    } finally{
      setIsLoading(false);
    }
  };
 
  async function handleAddItem(data: schemaType): Promise<void>{
    try {
      await api.post("/items", data);

      Toast.show({
        type: "success",
        text1: "Item adicionado com sucesso",
      });

    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";

      Toast.show({
        type: "error",
        text1: message,
      });
    };
  };

  async function handleDeleteItem(id: string): Promise<void>{
    try {

      await api.delete(`/items/${id}`);

      Toast.show({
        type: "success",
        text1: "Item deletado com sucesso",
      });

    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";

      Toast.show({
        type: "error",
        text1: message,
      });
    };
  };

  async function handleUpdateItem(data:ItemDto): Promise<void>{
    try {
      const payload = {...data, amountType: data.amount_type};

      await api.patch(`/items/${data.id}`, payload);

      Toast.show({
        type: "success",
        text1: "Item atualizado com sucesso",
      });

    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";

      Toast.show({
        type: "error",
        text1: message,
      });
    };
  };

  if(isLoading){
    return <Loading/>
  }

  return(
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 p-6 bg-zinc-950">
        <Image 
          source={BackgroundImage}
          className="h-44"
        />
        
        <View className="flex-1 mt-[-150px]">
          <View className="flex items-end">
            <TouchableOpacity 
              className="flex items-center justify-center h-12 w-12 p-1 bg-purple-500 rounded-md"
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={24} color={colors.gray[50]} />
            </TouchableOpacity>
          </View>
          
          <Text className="text-zinc-50 text-2xl font-bold">Olá, {user?.name}</Text>

          <Text className="text-zinc-50 text-xl font-bold mt-1 mb-6">Segue sua lista de compras</Text>

          <View className="mb-3">
            <Text className="text-zinc-50 text-sm mb-2">Item</Text>

            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  className="h-12 p-3 bg-zinc-900 border-2 border-zinc-800 rounded-md text-zinc-50 focus:border-purple-500"
                  {...field}
                  onChangeText={(text) => {
                    field.onChange(text);
                    setValue('name', text);
                  }}
                  value={getValues('name')}
                />
              )}
            />
          </View>

          <View className="mb-3 flex flex-row items-end justify-between gap-2">
            <View className="flex-1">
              <Text className="text-zinc-50 text-sm mb-2">Quantidade</Text>

              <View className="flex-1 flex-row">
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <TextInput
                      className="w-[50px] h-full p-3 bg-zinc-900 border-2 border-zinc-800 text-zinc-50 focus:border-purple-500 rounded-md"
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                      }}
                      {...field}
                      onChangeText={(text) => {
                        field.onChange(text);
                        setValue('amount', text);
                      }}
                      value={getValues('amount')}
                      keyboardType="numeric"
                    />
                  )}
                />

                <SelectDropdown
                  data={units}
                  onSelect={(selectedItem, index) => setValue('amountType', selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) => selectedItem} 
                  rowTextForSelection={(item, index) => item }
                  dropdownIconPosition="right"
                  renderDropdownIcon={() => <MaterialIcons name="arrow-drop-down" size={24} color={colors.zinc[50]} />}
                  buttonTextStyle={{
                    color: colors.zinc[50]
                  }}
                  buttonStyle={{
                    backgroundColor: colors.zinc[900],
                    borderWidth: 2,
                    borderRadius: 6,
                    borderColor: colors.zinc[800],
                    width:92,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0
                  }}
                  defaultValueByIndex={0}
                />
              </View> 
            </View>

            <View className="flex-1">
              <Text className="text-zinc-50 text-sm mb-2">Categoria</Text>

              <SelectDropdown
                data={categories}
                onSelect={(selectedItem, index) => setValue('category', selectedItem)}
                buttonTextAfterSelection={(selectedItem, index) =>  selectedItem }
                rowTextForSelection={(item, index) => item }
                dropdownIconPosition="right"
                renderDropdownIcon={() => <MaterialIcons name="arrow-drop-down" size={24} color={colors.zinc[50]} />}
                buttonTextStyle={{
                  color: colors.zinc[50]
                }}
                buttonStyle={{
                  backgroundColor: colors.zinc[900],
                  borderWidth: 2,
                  borderRadius: 6,
                  borderColor: colors.zinc[800],
                  width:"100%"
                }}
                defaultValueByIndex={0}
              />
            </View>

            <TouchableOpacity 
              className="flex items-center justify-center h-12 w-12 p-2 bg-purple-500 rounded-full"
              onPress={handleSubmit(handleAddItem)}
              >
              <AntDesign name="plus" size={24} color={colors.gray[50]} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={items} 
            keyExtractor={item => (item.id)}
            renderItem={({ item }) => (
              <Item 
                item={item}
                handleUpdateItem={handleUpdateItem}
                handleDeleteItem={handleDeleteItem}
              />
            )}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="my-1"></View>}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center mt-10">
                <MaterialIcons name="mark-chat-unread" size={24} color={colors.zinc[800]} />
                <Text className="text-zinc-800 text-center mt-2">Você ainda não possui {"\n"} items</Text>
              </View>
            )}
          />
        </View>

      </View>
    </TouchableWithoutFeedback>
  )
}