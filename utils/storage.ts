import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  set: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.error('Storage set error');
    }
  },

  get: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (err) {
      console.error('Storage get error');
      return null;
    }
  },

  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.error('Storage remove error');
    }
  },
};
