import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../context/AppContext";

export default function Transactions() {
  const router = useRouter();
  const { transactions = [], deleteTransaction } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [timeFilter, setTimeFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedTx, setSelectedTx] = useState<any>(null); // edit/delete
  const [viewTx, setViewTx] = useState<any>(null); // view

  const timeOptions = [
    { label: "All", value: "all" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
  ];

  // FILTER LOGIC
  const filteredData = transactions.filter((t: any) => {
    const matchesSearch = (t.category || "").toLowerCase();

    const matchesType = filter === "all" ? true : t.type === filter;

    const today = new Date();
    const txDate = new Date(t.date);

    let matchesTime = true;

    if (timeFilter === "week") {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      matchesTime = txDate >= lastWeek;
    }

    if (timeFilter === "month") {
      matchesTime =
        txDate.getMonth() === today.getMonth() &&
        txDate.getFullYear() === today.getFullYear();
    }

    if (timeFilter === "year") {
      matchesTime = txDate.getFullYear() === today.getFullYear();
    }

    return matchesSearch && matchesType && matchesTime;
  });

  // ITEM
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setViewTx(item)}
      onLongPress={() => setSelectedTx(item)}
    >
      <View>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>

      <Text
        style={{
          color: item.type === "income" ? "#00C896" : "#FF5C5C",
          fontWeight: "bold",
        }}
      >
        ₹{item.amount}
      </Text>
    </TouchableOpacity>
  );

  const selectedLabel =
    timeOptions.find((t) => t.value === timeFilter)?.label || "Filter";

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Transactions</Text>
      </View>

      {/* SEARCH + FILTER */}
      <View style={styles.topRow}>
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#888"
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={styles.filterDropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.filterTextBtn}>{selectedLabel} ▼</Text>
        </TouchableOpacity>
      </View>

      {/* DROPDOWN */}
      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {timeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                setTimeFilter(option.value);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* TYPE FILTER */}
      <View style={styles.filters}>
        {["all", "income", "expense"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text style={styles.filterText}>{f.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No transactions found 🚀{"\n"}Start adding now
          </Text>
        }
      />

      {/* EDIT / DELETE */}
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

      {/* VIEW */}
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
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0C10",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  back: {
    color: "white",
    fontSize: 22,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },

  topRow: {
    flexDirection: "row",
    marginBottom: 15,
  },

  search: {
    flex: 1,
    backgroundColor: "#151922",
    padding: 12,
    borderRadius: 10,
    color: "white",
    marginRight: 10,
  },

  filterDropdown: {
    backgroundColor: "#151922",
    padding: 12,
    borderRadius: 10,
  },

  filterTextBtn: {
    color: "white",
    fontSize: 12,
  },

  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },

  filterBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#151922",
  },

  activeFilter: {
    backgroundColor: "#6C63FF",
  },

  filterText: {
    color: "white",
    fontSize: 12,
  },

  dropdownMenu: {
    backgroundColor: "#151922",
    borderRadius: 10,
    marginBottom: 10,
  },

  dropdownItem: {
    padding: 12,
  },

  dropdownItemText: {
    color: "white",
  },

  card: {
    backgroundColor: "#151922",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  category: {
    color: "white",
  },

  date: {
    color: "#888",
    fontSize: 12,
  },

  empty: {
    color: "#888",
    textAlign: "center",
    marginTop: 50,
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

  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
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

  detail: {
    color: "white",
    marginTop: 8,
  },
});
