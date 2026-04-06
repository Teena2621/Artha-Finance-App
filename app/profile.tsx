import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState("Teena");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [showCard, setShowCard] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      const data = await AsyncStorage.getItem("profile");
      if (data) {
        const parsed = JSON.parse(data);
        setName(parsed.name || "");
        setPhone(parsed.phone || "");
        setAddress(parsed.address || "");
        setEmail(parsed.email || "");
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    // Validation
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      showToast("Please fill all fields");
      return;
    }

    if (phone.length < 10) {
      showToast("Invalid phone number");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showToast("Invalid email");
      return;
    }

    // Save data
    const profileData = { name, phone, address, email };
    await AsyncStorage.setItem("profile", JSON.stringify(profileData));

    showToast("Profile Updated");
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setShowCard(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowCard(false));
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* AVATAR */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#6C63FF" />
        </View>
        <Text style={styles.nameText}>{name}</Text>
      </View>

      {/* FORM CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} />

        <Text style={styles.label}>Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={[styles.input, { height: 80 }]}
          multiline
        />
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      {/* TOAST */}
      {showCard && (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
          <Ionicons name="information-circle" size={20} color="#00C896" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
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
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#151922",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  nameText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#11151D",
    padding: 15,
    borderRadius: 15,
  },

  label: {
    color: "#aaa",
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#1A1F2B",
    color: "white",
    padding: 12,
    borderRadius: 10,
  },

  saveBtn: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontWeight: "bold",
  },

  toast: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#1E2A24",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    gap: 8,
  },

  toastText: {
    color: "#00C896",
    fontWeight: "600",
  },
});
