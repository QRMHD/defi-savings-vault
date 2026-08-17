# DeFi Savings Vault

An Internet Computer (ICP) decentralized application simulating an automated compound yield savings vault[cite: 1, 3]. The Motoko backend computes continuous compound interest based on elapsed time epochs[cite: 7], while the React and TypeScript frontend provides real-time balance updates, deposits, and withdrawal management[cite: 3].

## Features

* **Continuous Compounding:** Accrues 5% interest automatically across 10-second epochs calculated on-chain[cite: 3, 7].
* **Real-Time Tracking:** Frontend polls and updates live balance growth with an active yield indicator[cite: 2, 3].
* **Vault Operations:** Supports top-up deposits and balance-validated withdrawals[cite: 3, 7].
* **Canister Backend:** Fully on-chain logic written in Motoko with elapsed time calculation using `mo:base/Time`[cite: 7].

## Tech Stack

* **Smart Contract / Backend:** Motoko[cite: 7], DFX SDK
* **Frontend:** React 18[cite: 3], TypeScript, Vite[cite: 1, 6]
* **Styling:** CSS3 (Dark Mode Vault UI)[cite: 2, 4]
