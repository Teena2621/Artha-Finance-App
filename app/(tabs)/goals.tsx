import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../context/AppContext";

export default function Goals() {
  const { transactions = [] } = useContext(AppContext);
  const router = useRouter();

  const budget = 5000;
  const today = new Date();

  // Monthly expenses
  const monthlyExpenses = transactions.reduce((total: number, t: any) => {
    const txDate = new Date(t.date);

    const isThisMonth =
      txDate.getMonth() === today.getMonth() &&
      txDate.getFullYear() === today.getFullYear();

    if (isThisMonth && t.type === "expense") {
      return total + Number(t.amount);
    }

    return total;
  }, 0);

  const progress = monthlyExpenses / budget;

  // Smart alert
  let message = "";
  let color = "#22C55E";

  if (progress > 0.9) {
    message = "Overspending! Slow down 🚨";
    color = "#EF4444";
  } else if (progress > 0.7) {
    message = "Careful! You're close ⚠️";
    color = "#F59E0B";
  } else {
    message = "You're doing great 💪";
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* BACK */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      {/*TITLE */}
      <Text style={styles.title}>Smart Spending Guardian</Text>
      <Text style={styles.subtitle}>
        Track your monthly budget and get real-time alerts
      </Text>

      {/* HERO CARD */}
      <LinearGradient colors={["#00C896", "#111827"]} style={styles.card}>
        <Text style={styles.heroText}>
          You are likely to stay within your budget
        </Text>
        <Text style={styles.heroDate}>This Month 🎯</Text>
      </LinearGradient>

      {/*MAIN CARD */}
      <LinearGradient colors={["#1F2937", "#4F46E5"]} style={styles.card}>
        <Text style={styles.cardTitle}>Budget Usage</Text>

        <Text style={styles.amount}>₹{monthlyExpenses}</Text>
        <Text style={styles.sub}>of ₹{budget}</Text>

        <View style={styles.bar}>
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>

        <Text style={styles.percent}>{(progress * 100).toFixed(1)}%</Text>
      </LinearGradient>

      {/* ALERT */}
      <LinearGradient colors={["#111827", "#020617"]} style={styles.card}>
        <Text style={[styles.alertText, { color }]}>{message}</Text>
      </LinearGradient>

      {/* GO TO INSIGHTS SCREEN */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/insights")}
      >
        <Text style={styles.buttonText}>View Detailed Insights →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
  },

  back: {
    color: "white",
    fontSize: 22,
    marginBottom: 10,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94A3B8",
    marginBottom: 20,
  },

  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
  },

  heroText: {
    color: "#CBD5F5",
  },

  heroDate: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
  },

  cardTitle: {
    color: "#9CA3AF",
  },

  amount: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },

  sub: {
    color: "#9CA3AF",
    marginBottom: 10,
  },

  bar: {
    height: 10,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
  },

  percent: {
    color: "#CBD5F5",
    marginTop: 10,
  },

  alertText: {
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#6895df",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  insightTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
  },

  insightText: {
    color: "#CBD5F5",
  },
});
