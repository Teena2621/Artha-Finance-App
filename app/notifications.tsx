import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const stored = await AsyncStorage.getItem("notifications");
    if (stored) {
      setData(JSON.parse(stored));
    }
  };

  const clearAll = async () => {
    await AsyncStorage.removeItem("notifications");
    setData([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔙 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>

        <TouchableOpacity onPress={clearAll}>
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* 📭 EMPTY STATE */}
      {data.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="notifications-off" size={40} color="#555" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Ionicons name="alert-circle" size={18} color="#F59E0B" />
                <Text style={styles.msg}>{item.message}</Text>
              </View>

              <Text style={styles.time}>{item.time}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#666",
    marginTop: 10,
  },

  card: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  msg: {
    color: "white",
    fontSize: 14,
  },

  time: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
});
