import { useCallback, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from "react-native-toast-message";
import { Ionicons } from '@expo/vector-icons';
import { useAuthentication } from "../hooks/useAuthentication";
import colors from "tailwindcss/colors";
import BackgroundImage from '../assets/backgorund.png';
import { handleErrorTextFormatting } from "../utils/handleErrorTextFormatting";

const schema = z.object({
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

export function SignIn(){
  const navigation = useNavigation();
  const { handleSignIn } = useAuthentication();
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ showPassword, setShowPassword ] = useState<boolean>(true);
  const { 
    control,
    setValue, 
    getValues,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<schemaType>({ resolver: zodResolver(schema) });

  useFocusEffect(useCallback( reset, [] ));

  async function handleOnSubmit(data: schemaType): Promise<void>{
    try {
      setIsLoading(true);

      await handleSignIn({
        email: data.email,
        password: data.password
      });

    } catch (error) {
      const message = error?.response?.data?.message || "Error internal server";

      Toast.show({
        type: "error",
        text1: message,
      });

    } finally{
      setIsLoading(false);
    };
  };

  async function navigateForSignUp(): Promise<void>{
    navigation.navigate("sign-up");
  };

  return(
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 p-6 bg-zinc-950">
        <Image 
          source={BackgroundImage}
          className="h-44"
        />

        <View className="mt-[-150px]">
          <Text className="text-zinc-50 text-3xl text-center font-bold mt-16 mb-14">Login</Text>

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

          <View className="flex-row items-center justify-center gap-1">
            <Text className="text-zinc-50 text-base">Não tem conta ainda?</Text>

            <TouchableOpacity onPress={navigateForSignUp}>
              <Text className="text-purple-500 text-base font-bold">Registre-se</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className="h-12 p-3 bg-purple-500 rounded-md mt-6"
            onPress={handleSubmit(handleOnSubmit)}  
          >
            {
              isLoading
              ? <ActivityIndicator size="small" color={colors.purple[50]} />
              : <Text className="text-zinc-50 text-base text-center font-bold">Entrar</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}