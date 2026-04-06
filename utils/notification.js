import AsyncStorage from "@react-native-async-storage/async-storage";

export const addNotification = async (message) => {
  const existing = await AsyncStorage.getItem("notifications");
  let notifications = existing ? JSON.parse(existing) : [];

  const newNotification = {
    id: Date.now(),
    message,
    time: new Date().toLocaleString(),
  };

  notifications.unshift(newNotification);

  await AsyncStorage.setItem("notifications", JSON.stringify(notifications));
};
