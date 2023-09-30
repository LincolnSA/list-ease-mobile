import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalStorageDto {
  key: string;
  value: unknown;
}

export const setLocalStorage = async (input: LocalStorageDto) => {
  try {
    const { key, value } = input;
    const valueInString = JSON.stringify(value);

    await AsyncStorage.setItem(key, valueInString);
  } catch (error) {
    console.error(error);
  };
};

export const getLocalStorage = async (input: Pick<LocalStorageDto, "key">) => {
  try {
    const { key } = input;

    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(error);
  };
};

export const deleteLocalStorage = async (input: Pick<LocalStorageDto, "key">) => {
  try {
    const { key } = input;

    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};