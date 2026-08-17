# DeFi Savings Vault

An Internet Computer (ICP) decentralized application simulating an automated compound yield savings vault. The Motoko backend computes continuous compound interest based on elapsed time epochs, while the React and TypeScript frontend provides real-time balance updates, deposits, and withdrawal management[cite: 3].

## Features

* **Continuous Compounding:** Accrues 5% interest automatically across 10-second epochs calculated on-chain.
* **Real-Time Tracking:** Frontend polls and updates live balance growth with an active yield indicator.
* **Vault Operations:** Supports top-up deposits and balance-validated withdrawals.
* **Canister Backend:** Fully on-chain logic written in Motoko with elapsed time calculation using `mo:base/Time`.

## Tech Stack

* **Smart Contract / Backend:** Motoko, DFX SDK
* **Frontend:** React 18[cite: 3], TypeScript, Vite
* **Styling:** CSS3 (Dark Mode Vault UI)
