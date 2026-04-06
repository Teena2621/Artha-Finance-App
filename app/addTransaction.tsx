import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../context/AppContext";

export default function AddTransaction() {
  const {
    transactions = [],
    addTransaction,
    updateTransaction,
  } = useContext(AppContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const safeParam = (value: string | string[] | undefined): string =>
    Array.isArray(value) ? value[0] : value || "";
  const [amount, setAmount] = useState(safeParam(params.amount) || "");
  const [category, setCategory] = useState(safeParam(params.category) || "");
  const [notes, setNotes] = useState(safeParam(params.notes) || "");
  const [type, setType] = useState(safeParam(params.type) || "expense");
  const [added, setAdded] = useState(false);

  // Calculate balance
  const balance = Array.isArray(transactions)
    ? transactions.reduce((acc, t) => {
        return t.type === "income"
          ? acc + Number(t.amount || 0)
          : acc - Number(t.amount || 0);
      }, 0)
    : 0;
  const amountNum = Number(amount || 0);

  let cardColors: [string, string];

  if (type === "income") {
    cardColors = ["#00C896", "#00E6A8"];
  } else {
    if (amountNum > balance) {
      cardColors = ["#FF8C00", "#FF3B3B"];
    } else {
      cardColors = ["#4FACFE", "#6C63FF"];
    }
  }
  const handleAdd = () => {
    if (!amount || !category) {
      alert("Please fill all fields");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const txData = {
      id: params.id || Date.now().toString(),
      amount: Number(amount),
      category,
      notes,
      type,
      date: new Date().toISOString(),
    };

    if (params.id) {
      updateTransaction(txData);
    } else {
      addTransaction(txData);
    }

    router.push("/transactions");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {params.id
            ? "Update Transaction"
            : added
              ? "View Transactions"
              : "Add Transaction"}
        </Text>

        <View style={{ width: 30 }} />
      </View>

      <Animated.View entering={FadeInRight.duration(600)}>
        <LinearGradient colors={cardColors} style={styles.card}>
          <Text style={styles.cardLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.cardBalance}>₹{balance}</Text>
        </LinearGradient>
      </Animated.View>

      {/* AMOUNT */}
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* TYPE */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "income" && styles.active]}
          onPress={() => setType("income")}
        >
          <Text style={styles.typeText}>Income</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeBtn, type === "expense" && styles.active]}
          onPress={() => setType("expense")}
        >
          <Text style={styles.typeText}>Expense</Text>
        </TouchableOpacity>
      </View>

      {/*CATEGORY */}
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Food, Travel..."
        placeholderTextColor="#888"
        value={category}
        onChangeText={setCategory}
      />

      {/*NOTES */}
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional notes"
        placeholderTextColor="#888"
        value={notes}
        onChangeText={setNotes}
      />

      {/* DATE */}
      <Text style={styles.label}>Date</Text>
      <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          added ? router.push("/(tabs)/transactions") : handleAdd()
        }
      >
        <Text style={styles.btnText}>
          {params.id
            ? "Update Transaction"
            : added
              ? "View Transactions"
              : "Add Transaction"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0C10",
    padding: 20,
  },

  card: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 60,
  },

  cardLabel: {
    color: "#ddd",
    fontSize: 12,
  },

  cardBalance: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },

  label: {
    color: "#aaa",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#151922",
    padding: 14,
    borderRadius: 12,
    color: "white",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },

  typeBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#151922",
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },

  active: {
    backgroundColor: "#6C63FF",
  },

  typeText: {
    color: "white",
    fontWeight: "bold",
  },

  date: {
    color: "white",
    marginTop: 5,
  },

  btn: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  back: {
    color: "white",
    fontSize: 22,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
