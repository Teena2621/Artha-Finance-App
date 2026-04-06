import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { addNotification } from "../utils/notification";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [liveNotification, setLiveNotification] = useState(null);
  // LOAD DATA ON START
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("transactions");

      if (data !== null) {
        setTransactions(JSON.parse(data));
      } else {
        // Initial data only if empty
        const initialData = [
          {
            id: "init",
            amount: 5000,
            type: "income",
            category: "Initial Balance",
            date: new Date().toLocaleDateString(),
          },
        ];
        setTransactions(initialData);
        await AsyncStorage.setItem("transactions", JSON.stringify(initialData));
      }
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  // SAVE DATA
  const saveData = async (data) => {
    try {
      setTransactions(data);
      await AsyncStorage.setItem("transactions", JSON.stringify(data));
    } catch (error) {
      console.log("Error saving data", error);
    }
  };

  const addTransaction = async (tx) => {
    const updated = [...transactions, tx];
    setTransactions(updated);
    await AsyncStorage.setItem("transactions", JSON.stringify(updated));

    // Calculate expense
    const totalExpense = updated
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const budget = 5000;
    const progress = totalExpense / budget;

    const lastAlert = await AsyncStorage.getItem("lastAlert");

    if (progress > 0.9 && lastAlert !== "over") {
      const msg = "🚨 Overspending! You crossed your budget!";

      setLiveNotification({
        message: msg,
        id: Date.now(),
      });

      await addNotification(msg);
      await AsyncStorage.setItem("lastAlert", "over");
    } else if (progress > 0.7 && lastAlert !== "warning") {
      const msg = "⚠️ Warning: You're nearing your budget";

      setLiveNotification({
        message: msg,
        id: Date.now(),
      });

      await addNotification(msg);
      await AsyncStorage.setItem("lastAlert", "warning");
    } else if (progress <= 0.7) {
      await AsyncStorage.removeItem("lastAlert");
    }
  };

  //update
  const updateTransaction = (updatedTx) => {
    setTransactions((prev) => {
      const updated = prev.map((t) => (t.id === updatedTx.id ? updatedTx : t));

      AsyncStorage.setItem("transactions", JSON.stringify(updated));
      return updated;
    });
  };

  //  DELETE
  const deleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    saveData(updated);
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        liveNotification,
        setLiveNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
