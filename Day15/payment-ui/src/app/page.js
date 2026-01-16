"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function WalletUI() {
  const [userId, setUserId] = useState("");
  const [joined, setJoined] = useState(false);

  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  const [logs, setLogs] = useState([]);
  const [balances, setBalances] = useState({
    user1: 1000,
    user2: 500,
  });

  useEffect(() => {
    socket = io("http://localhost:3001");

    socket.on("notification", (msg) => {
      setLogs((prev) => [...prev, msg]);
      fetchBalances(); // refresh balances on every notification
    });

    return () => socket.disconnect();
  }, []);

  const joinSocket = () => {
    socket.emit("join", userId);
    setJoined(true);
  };

  const fetchBalances = async () => {
    // Fake fetch for demonstration; replace with real backend endpoint if you implement it
    // Currently using local balances state
    setBalances((prev) => ({ ...prev }));
  };

  const sendMoney = async () => {
    if (!sender || !receiver || !amount) {
      alert("Please fill all fields");
      return;
    }
    if (sender === receiver) {
      alert("Sender and Receiver cannot be same");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/wallet/send-money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender,
          receiver,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      setLogs((prev) => [...prev, data.message]);
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>💳 MiniPay</h2>

        {!joined ? (
          <>
            <input
              style={styles.input}
              placeholder="Enter your userId"
              onChange={(e) => setUserId(e.target.value.toLowerCase())}
            />
            <button style={styles.button} onClick={joinSocket}>
              Join Wallet
            </button>
          </>
        ) : (
          <>
            <div style={styles.balanceBox}>
              <h4>Wallet Balances</h4>
              <p>user1: ₹{balances.user1}</p>
              <p>user2: ₹{balances.user2}</p>
            </div>

            <select
              style={styles.input}
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            >
              <option value="">Select Sender</option>
              <option value="user1">user1</option>
              <option value="user2">user2</option>
            </select>

            <select
              style={styles.input}
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            >
              <option value="">Select Receiver</option>
              <option value="user1">user1</option>
              <option value="user2">user2</option>
            </select>

            <input
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />

            <button style={styles.button} onClick={sendMoney}>
              Send Money
            </button>

            <div style={styles.logBox}>
              <h4>Transactions / Notifications</h4>
              {logs.map((l, i) => (
                <p key={i}>🔔 {l}</p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    padding: 30,
    borderRadius: 20,
    width: 400,
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    animation: "fadeIn 0.6s ease",
  },
  title: {
    marginBottom: 20,
    color: "#444",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
    marginBottom: 15,
  },
  balanceBox: {
    background: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "left",
    fontSize: 14,
  },
  logBox: {
    marginTop: 20,
    height: 150,
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: 10,
    borderRadius: 10,
    textAlign: "left",
    background: "#fafafa",
    fontSize: 13,
  },
};
