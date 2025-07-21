# 📱 KooPaa Mobile — Ajo Savings on Solana

**KooPaa** is a decentralized savings protocol inspired by Africa’s communal savings system — *Ajo*, *Esusu*, *Tontine*, etc. This mobile client brings KooPaa to the Solana Mobile ecosystem, enabling trustless group savings, wallet-native interactions, and seamless payouts — all in your pocket.

---

## 🧠 Background

KooPaa reimagines traditional savings groups for the blockchain age, removing the need for a central coordinator. With KooPaa:
- Groups are transparent
- Contributions are tracked on-chain
- Payouts are automated
- Members can join using just a wallet

This mobile app complements the [KooPaa Web App](https://github.com/your-org/koopaa-web), and interacts directly with the [KooPaa Solana Anchor Program](https://github.com/your-org/koopaa-anchor).

---

## 🚀 Features

- 🔐 Wallet-native login (Solana Mobile dApp browser / mobile wallet connect)
- 👥 Create and join savings groups
- 💸 Contribute to your group on-chain
- 🧾 View group history and upcoming payouts
- 📆 Track savings duration and progress
- 🔔 Get notified when it's your payout turn

---

## 📦 Tech Stack

- **Framework**: React Native + Expo 
- **Blockchain**: Solana + Anchor
- **Wallet**: Solana Mobile Wallet Adapter, Backpack / Phantom / other wallet integrations
- **API**: Optional backend services (e.g., Neon + Prisma, for metadata)

---

## 🛠 Setup

```bash
git clone https://github.com/your-org/koopaa-mobile-app.git
cd koopaa-mobile-app
npm install
npx expo start
```

Ensure you're on:

Node.js v18+

Expo CLI installed globally (npm i -g expo-cli)

A Solana Mobile-compatible wallet for testing

📄 Contracts
This app interacts with the deployed Anchor Program:

Repo: koopaa-anchor

Program ID: koopaa...replace_this...id

💡 Inspiration
Millions rely on communal savings for survival. KooPaa makes it secure, automated, and transparent — no more defaulting collectors, no more invisible books. Just pure trust through code.

🏆 Solana Mobile Hackathon Submission
This repo is part of our submission for the Solana Mobile App Hackathon. We’re building fast and shipping real.

✨ Contributors

@steffqing — Mobile Lead
