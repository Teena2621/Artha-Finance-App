# 💰 Artha – Smart Finance Management Companion App

🚀 **Live Demo:** [Watch Here](https://drive.google.com/file/d/1u0n9Yh5a2pcRRamr_q8l8B8NfEC-yq_B/view?usp=drive_link)

## 📌 Overview

**Artha** is a modern fintech-style mobile application designed to help users efficiently manage their finances. It provides real-time expense tracking, budget monitoring, and insightful analytics through a clean and intuitive user interface.

---

## 🚀 Features

### 📊 Dashboard

* Displays total balance, income, and expenses
* Quick navigation to all modules
* Interactive charts for financial overview

### 💸 Transactions

* Add, edit, and delete transactions
* Search and filter (by type & time)
* Long press for edit/delete options

### 🎯 Goals (Budget Tracking)

* Monthly budget monitoring
* Dynamic progress bar
* Smart alerts based on spending behavior

### 📈 Insights

* Category-wise expense analysis
* Weekly comparison
* Visual charts for better understanding

### 👤 Profile

* User information management
* Input validation
* Smooth UI with feedback notifications

### 🔔 Notifications

* Tracks important financial alerts
* Stored using AsyncStorage
* Accessible via bell icon

---

## 🛠️ Tech Stack

* **Frontend:** React Native (Expo)
* **State Management:** Context API
* **Storage:** AsyncStorage
* **Navigation:** Expo Router
* **UI Components:** React Native + Linear Gradients
* **Charts:** react-native-chart-kit

---

## 🧠 Key Concepts Used

* Context API for global state management
* AsyncStorage for persistent data handling
* Functional programming (map, reduce, filter)
* Modular and reusable component structure

---

## 📂 Project Structure

```
app/
  ├── (tabs)/
  │     ├── index.tsx
  │     ├── goals.tsx
  │     ├── insights.tsx
  │     ├── transactions.tsx
  ├── addTransaction.tsx
  ├── notifications.tsx
  ├── profile.tsx

components/
  └── screens/HomeScreen.js

context/
  └── AppContext.js

utils/
  ├── calculation.js
  └── notification.js
```

---

## 📱 How to Run

```bash
npm install
npx expo start
```

---

## 🎯 Future Improvements

* Push notifications
* Cloud database integration
* User authentication
* AI-based spending insights

---

## 👨‍💻 Author
Teena
Developed as part of a full-stack mobile app project.

---

## ⭐ Conclusion

Artha demonstrates a complete end-to-end mobile application with real-world fintech use cases, clean UI/UX, and efficient state management.

---
