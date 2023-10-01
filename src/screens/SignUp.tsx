import { useState } from "react";
import { 
  View, 
  Text,
  Image,
  Keyboard,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import colors from "tailwindcss/colors";
import BackgroundImage from '../assets/backgorund.png';
import { api } from "../services/api";
import { useAuthentication } from "../hooks/useAuthentication";
import { handleErrorTextFormatting } from "../utils/handleErrorTextFormatting";

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: "Campo obrigatório" }),
  email: z
    .string()
    .nonempty({ message: "Campo obrigatório" })
    .email({  message: "Deve ser um e-mail válido"}),
  password: z
    .string()
    .nonempty({ message: "Campo obrigatório" })
    .min(3, { message: "A senha deve ter pelo menos 3 caracteres" }),
});

type schemaType = z.infer<typeof schema>;

export function SignUp(){
  const navigation = useNavigation();
  const { handleSignIn } = useAuthentication();
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ showPassword, setShowPassword ] = useState<boolean>(true);
  const { 
    control,
    setValue, 
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<schemaType>({ resolver: zodResolver(schema) });

  async function handleOnSubmit(data:schemaType): Promise<void>{
    try {
      setIsLoading(true);

      await api.post("/users", data);

      await handleSignIn({
        email: data.email,
        password: data.password
      });

    } catch (error: any) {
      const message = error?.response?.data?.message || "Error internal server";

      Toast.show({
        type: "error",
        text1: message,
      });
    } finally{
      setIsLoading(false);
    };
  };

  async function navigateForSignIn(): Promise<void>{
    navigation.navigate("sign-in");
  };

  return(
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
      <View className="flex-1 p-6 bg-zinc-950">
        <Image 
          source={BackgroundImage}
          className="h-44"
        />

        <View className="mt-[-150px]">
          <TouchableOpacity 
            className="flex items-center justify-center h-12 w-12 p-1 bg-purple-500 rounded-md"
            onPress={navigateForSignIn}  
          >
            <MaterialIcons name="keyboard-arrow-left" size={24} color={colors.gray[50]} />
          </TouchableOpacity>

          <Text className="text-zinc-50 text-3xl text-center font-bold mt-2 mb-14">Crie sua conta</Text>

          <View className="mb-3">
            <Text className="text-zinc-50 text-sm mb-2">Nome</Text>
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

            {
              errors.name && 
              <Text className="text-red-500 text-xs mt-1">
                { handleErrorTextFormatting({ message: errors.name.message }) }
              </Text>
            }
          </View>

          <View className="mb-3">
            <Text className="text-zinc-50 text-sm mb-2">E-mail</Text>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextInput
                  className="h-12 p-3 bg-zinc-900 border-2 border-zinc-800 rounded-md text-zinc-50 focus:border-purple-500"
                  {...field}
                  onChangeText={(text) => {
                    field.onChange(text);
                    setValue('email', text);
                  }}
                  value={getValues('email')}
                />
              )}
            />

            {
              errors.email && 
              <Text className="text-red-500 text-xs mt-1">
                { handleErrorTextFormatting({ message: errors.email.message }) }
              </Text>
            }
          </View>

          <View className="mb-3">
            <Text className="text-zinc-50 text-sm mb-2">Senha</Text>

            <View className="flex-row items-end justify-between bg-zinc-900 border-2 border-zinc-800 rounded-md focus:border-purple-500">
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <TextInput
                    className="flex-1 h-12 p-3 text-zinc-50"
                    {...field}
                    onChangeText={(text) => {
                      field.onChange(text);
                      setValue('password', text);
                    }}
                    value={getValues('password')}
                    secureTextEntry = { showPassword }
                  />
                )}
              />

              <TouchableOpacity  
                className="w-12 h-12 p-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                {
                  showPassword
                  ? <Ionicons name="eye-off-outline" size={24} color={colors.gray[50]} />
                  : <Ionicons name="eye-outline" size={24} color={colors.gray[50]} />
                }
              </TouchableOpacity>
            </View>

            {
              errors.password && 
              <Text className="text-red-500 text-xs mt-1">
                { handleErrorTextFormatting({ message: errors.password.message }) }
              </Text>
            }
          </View>

          <TouchableOpacity 
            className="h-12 p-3 bg-purple-500 rounded-md mt-6"
            onPress={handleSubmit(handleOnSubmit)}  
          > 
            {
              isLoading
              ? <ActivityIndicator size="small" color={colors.purple[50]} />
              : <Text className="text-zinc-50 text-base text-center font-bold">Cadastrar</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}