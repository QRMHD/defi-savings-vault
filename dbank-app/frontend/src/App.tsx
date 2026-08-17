import React, { useState, useEffect, useCallback } from "react";
import { createActor } from "./backend/api/backend";
import { getCanisterEnv } from "@icp-sdk/core/agent/canister-env";
import "./App.css";

interface CanisterEnv {
  readonly "PUBLIC_CANISTER_ID:backend": string;
  readonly IC_ROOT_KEY?: any;
}

const canisterEnv = getCanisterEnv<CanisterEnv>();
const canisterId = canisterEnv["PUBLIC_CANISTER_ID:backend"];

const backendActor = createActor(canisterId, {
  agentOptions: {
    rootKey: canisterEnv.IC_ROOT_KEY,
  },
});

export default function App() {
  const [balance, setBalance] = useState<number>(0.0);
  const [depositInput, setDepositInput] = useState<string>("");
  const [withdrawInput, setWithdrawInput] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<"deposit" | "withdraw" | null>(null);
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: "",
  });

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setStatus({ message, type });
    setTimeout(() => {
      setStatus({ message: "", type: "" });
    }, 4000);
  };

  const fetchBalance = useCallback(async () => {
    try {
      // Calls backend checkBalance()[cite: 1]
      const current = await (backendActor as any).checkBalance();
      setBalance(Number(current));
    } catch (err) {
      console.error("Balance query failed:", err);
    }
  }, []);

  // Poll balance every 5 seconds to track 10s compound intervals[cite: 1]
  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  // Handle deposit top-up[cite: 1]
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositInput);
    if (isNaN(amount) || amount <= 0) return;

    setLoadingAction("deposit");
    try {
      const updatedBalance = await (backendActor as any).topUp(amount);
      setBalance(Number(updatedBalance));
      setDepositInput("");
      showNotification(`Successfully deposited $${amount.toFixed(2)}`, "success");
    } catch (err) {
      showNotification("Deposit failed. Please try again.", "error");
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle withdrawal[cite: 1]
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawInput);
    if (isNaN(amount) || amount <= 0) return;

    setLoadingAction("withdraw");
    try {
      const response = await (backendActor as any).withdraw(amount);
      if (response === "Withdrawal successful") {
        showNotification(`Successfully withdrew $${amount.toFixed(2)}`, "success");
        setWithdrawInput("");
        await fetchBalance();
      } else {
        // Displays backend "Insufficient funds" response[cite: 1]
        showNotification(response, "error");
      }
    } catch (err) {
      showNotification("Withdrawal failed.", "error");
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="vault-page">
      <div className="background-glow"></div>

      <main className="vault-card">
        <header className="vault-header">
          <span className="badge">Live Yield Vault</span>
          <h1>Compound Savings</h1>
          <p className="subtitle">Earning 5% yield every 10-second epoch</p>
        </header>

        {/* Balance Card */}
        <section className="balance-container">
          <span className="label">Current Balance</span>
          <div className="balance-wrapper">
            <span className="currency">$</span>
            <span className="balance-value">
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </span>
          </div>
          <div className="yield-badge">
            <span className="pulse-dot"></span>
            Compounding active
          </div>
        </section>

        {/* Action Grid */}
        <section className="actions-grid">
          {/* Top Up Form */}
          <form className="action-box" onSubmit={handleDeposit}>
            <h3>Deposit Funds</h3>
            <div className="input-group">
              <span className="prefix">$</span>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={depositInput}
                onChange={(e) => setDepositInput(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loadingAction !== null}
            >
              {loadingAction === "deposit" ? "Processing..." : "Top Up"}
            </button>
          </form>

          {/* Withdraw Form */}
          <form className="action-box" onSubmit={handleWithdraw}>
            <h3>Withdraw Funds</h3>
            <div className="input-group">
              <span className="prefix">$</span>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={withdrawInput}
                onChange={(e) => setWithdrawInput(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={loadingAction !== null}
            >
              {loadingAction === "withdraw" ? "Processing..." : "Withdraw"}
            </button>
          </form>
        </section>

        {/* Status Toast */}
        {status.message && (
          <div className={`status-banner ${status.type}`}>
            {status.message}
          </div>
        )}
      </main>
    </div>
  );
}