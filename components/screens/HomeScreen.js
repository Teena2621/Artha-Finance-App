import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../context/AppContext";
import { calculateSummary } from "../../utils/calculations";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const router = useRouter();
  const slideAnim = useState(new Animated.Value(-100))[0];
  const [notificationCount, setNotificationCount] = useState(0);
  const {
    transactions,
    deleteTransaction,
    liveNotification,
    setLiveNotification,
  } = useContext(AppContext);

  const { balance, income, expense } = calculateSummary(transactions);

  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [viewTx, setViewTx] = useState(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);
  useEffect(() => {
    if (liveNotification) {
      slideAnim.setValue(-100);

      Animated.timing(slideAnim, {
        toValue: 60,
        duration: 400,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setLiveNotification(null));
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [liveNotification?.id]);
  useEffect(() => {
    const loadCount = async () => {
      const data = await AsyncStorage.getItem("notifications");
      if (data) {
        const parsed = JSON.parse(data);
        setNotificationCount(parsed.length);
      }
    };

    loadCount();
  }, [liveNotification]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/addTransaction")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push("/profile")}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=3" }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>Teena</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="search-outline" size={22} color="white" />
            <TouchableOpacity onPress={() => router.push("/notifications")}>
              <View>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />

                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* BALANCE */}
        <Animated.View entering={FadeIn.duration(800)}>
          <LinearGradient colors={["#FF7A7A", "#6C63FF"]} style={styles.card}>
            <Text style={styles.cardLabel}>TOTAL BALANCE</Text>
            <Text style={styles.balance}>₹{balance}</Text>
          </LinearGradient>
        </Animated.View>

        {/* NAVIGATION */}
        <View style={styles.navCards}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push("/transactions")}
          >
            <Text style={styles.navTitle}>Transactions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push("/goals")}
          >
            <Text style={styles.navTitle}>Goals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => router.push("/insights")}
          >
            <Text style={styles.navTitle}>Insights</Text>
          </TouchableOpacity>
        </View>

        {/* EXPENSE / INCOME */}
        <View style={styles.quickActions}>
          <View style={styles.actionCard}>
            <Text style={{ color: "#FF5C5C" }}>Expense</Text>
            <Text style={styles.actionValue}>₹{expense}</Text>
          </View>

          <View style={styles.actionCard}>
            <Text style={{ color: "#00C896" }}>Income</Text>
            <Text style={styles.actionValue}>₹{income}</Text>
          </View>
        </View>

        {/* CHART */}
        <BarChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            datasets: [{ data: [200, 300, 400, 500, 600] }],
          }}
          width={screenWidth - 30}
          height={220}
          yAxisLabel="₹"
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: "#1A1F2B",
            backgroundGradientTo: "#1A1F2B",
            color: () => "#6C63FF",
            labelColor: () => "#aaa",
          }}
          style={styles.chart}
        />

        {/* TRANSACTIONS */}
        <Text style={styles.section}>Recent Transactions</Text>

        {transactions.length === 0 ? (
          <Text style={styles.empty}>
            No transactions yet 🚀{"\n"}Start adding now
          </Text>
        ) : (
          transactions.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.tx}
              onPress={() => setViewTx(t)}
              onLongPress={() => setSelectedTx(t)}
            >
              <View>
                <Text style={styles.txCategory}>{t.category}</Text>

                <Text style={styles.txDate}>
                  {new Date(t.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <Text
                style={{
                  color: t.type === "income" ? "#00C896" : "#FF5C5C",
                }}
              >
                ₹{t.amount}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* EDIT / DELETE MODAL */}
      {selectedTx && (
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedTx(null)}
            >
              <Text style={{ color: "white" }}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Options</Text>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                router.push({
                  pathname: "/addTransaction",
                  params: selectedTx,
                });
                setSelectedTx(null);
              }}
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#FF5C5C" }]}
              onPress={() => {
                deleteTransaction(selectedTx.id);
                setSelectedTx(null);
              }}
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewTx && (
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setViewTx(null)}
            >
              <Text style={{ color: "white" }}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Transaction</Text>

            <Text style={styles.detail}>Category: {viewTx.category}</Text>
            <Text style={styles.detail}>Amount: ₹{viewTx.amount}</Text>
            <Text style={styles.detail}>Type: {viewTx.type}</Text>
            <Text style={styles.detail}>Date: {viewTx.date}</Text>
          </View>
        </View>
      )}
      {liveNotification && (
        <Animated.View
          style={[styles.popup, { transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.popupText}>{liveNotification?.message}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0C10",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 10,
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    color: "white",
    fontSize: 16,
    marginRight: 5,
  },

  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },

  card: {
    margin: 15,
    padding: 20,
    borderRadius: 18,
  },

  cardLabel: {
    color: "#ddd",
    fontSize: 12,
    marginBottom: 5,
  },

  balance: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  actionCard: {
    backgroundColor: "#151922",
    padding: 15,
    borderRadius: 12,
    width: "48%",
  },

  actionTitle: {
    color: "#aaa",
    marginTop: 5,
  },

  actionValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },

  chart: {
    borderRadius: 16,
    marginHorizontal: 15,
    marginBottom: 20,
  },

  section: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 10,
  },

  empty: {
    color: "gray",
    marginLeft: 15,
    marginTop: 10,
  },

  tx: {
    backgroundColor: "#151922",
    padding: 14,
    marginHorizontal: 15,
    marginTop: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  txCategory: {
    color: "white",
    fontSize: 16,
  },

  txDate: {
    color: "gray",
    fontSize: 12,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#6C63FF",
    width: 65,
    height: 65,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",

    elevation: 10,
    zIndex: 999,
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    backgroundColor: "#151922",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },

  modalTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },

  modalBtn: {
    color: "white",
    paddingVertical: 10,
  },

  modalCancel: {
    color: "#888",
    marginTop: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  detail: {
    color: "white",
    marginTop: 8,
  },

  actionBtn: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  actionText: {
    color: "white",
    fontWeight: "bold",
  },
  navCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  navCard: {
    backgroundColor: "#495e8f",
    padding: 15,
    borderRadius: 12,
    width: "30%",
  },

  navTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },

  navSub: {
    color: "#888",
    fontSize: 11,
    marginTop: 5,
  },
  popup: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 10,
    zIndex: 1000,
  },

  popupText: {
    color: "white",
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
