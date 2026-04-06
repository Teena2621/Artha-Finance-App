import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../context/AppContext";

const screenWidth = Dimensions.get("window").width;

export default function Insights() {
  const { transactions = [] } = useContext(AppContext);
  const router = useRouter();

  const today = new Date();

  const categoryMap: Record<string, number> = {};

  transactions.forEach((t: any) => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + Number(t.amount);
    }
  });

  let topCategory = "None";
  let max = 0;

  for (let cat in categoryMap) {
    if (categoryMap[cat] > max) {
      max = categoryMap[cat];
      topCategory = cat;
    }
  }

  // WEEKLY COMPARISON
  let thisWeek = 0;
  let lastWeek = 0;

  transactions.forEach((t: any) => {
    const txDate = new Date(t.date);
    const diffDays =
      (today.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24);

    if (t.type === "expense") {
      if (diffDays <= 7) thisWeek += Number(t.amount);
      else if (diffDays <= 14) lastWeek += Number(t.amount);
    }
  });

  // CHART DATA (Top 5 categories)
  const sorted = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const chartData = {
    labels: sorted.map((item) => item[0]),
    datasets: [
      {
        data: sorted.map((item) => item[1]),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 🔙 BACK */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>Understand your spending patterns</Text>

        {/* TOP CATEGORY */}
        <LinearGradient colors={["#1F2937", "#4F46E5"]} style={styles.card}>
          <Text style={styles.cardTitle}>Top Spending Category</Text>
          <Text style={styles.value}>{topCategory}</Text>
        </LinearGradient>

        {/* WEEK COMPARISON */}
        <LinearGradient colors={["#0F172A", "#0072FF"]} style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Comparison</Text>
          <Text style={styles.text}>This Week: ₹{thisWeek}</Text>
          <Text style={styles.text}>Last Week: ₹{lastWeek}</Text>
        </LinearGradient>

        {/* CHART */}
        <LinearGradient colors={["#0F172A", "#065F46"]} style={styles.card}>
          <Text style={styles.cardTitle}>Spending by Category</Text>

          {sorted.length > 0 ? (
            <BarChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              yAxisLabel="₹"
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: "#111827",
                backgroundGradientTo: "#111827",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              }}
              style={{
                marginTop: 10,
                borderRadius: 12,
              }}
            />
          ) : (
            <Text style={styles.text}>No data available</Text>
          )}
        </LinearGradient>
      </ScrollView>
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
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
  },

  cardTitle: {
    color: "#9CA3AF",
    marginBottom: 5,
  },

  value: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  text: {
    color: "#CBD5F5",
    marginTop: 5,
  },
});
