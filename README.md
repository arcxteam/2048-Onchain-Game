# Game 2048: A Familiar Favorite, Powered by Onchain game - Credit 0xgr3y

# 🕹️ 2048

Implementation of the famous 2048 game in Next.js. You can play it
[here](https://2048-zeta-neon.vercel.app/).

## Pre-requisites

- [pnpm](https://pnpm.io/)
- [Node.js](https://nodejs.org/en/) (version 16 or higher)

## Installation

Clone the repository. Make sure to have pnpm installed. If you don't have it,
run the following command:

```bash
npm install -g pnpm
```

Then, install the dependencies and run the development server:

```bash
pnpm install
pnpm dev --turbopack
```

Finally, open your browser and go to http://localhost:3000 to play the game.

```diff
Struktur File Asli (FINAL) - Versi Terkonfirmasi

game/
├── .env.local
├── .eslintrc.cjs
├── .gitignore
├── .npmrc
├── .prettierrc
├── LICENSE
├── README.md
├── commitlint.config.cjs
├── lint-staged.config.cjs
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml (dihapus nanti setelah update package.json)
├── postcss.config.cjs
├── prettier.config.cjs
├── tailwind.config.cjs
├── tsconfig.json
└── public/
    ├── game-assets/
    │   ├── 2.jpg
    │   ├── 4.jpg
    │   ├── 8.jpg
    │   ├── 16.jpg
    │   ├── 32.jpg
    │   ├── 64.jpg
    │   ├── 128.jpg
    │   ├── 256.jpg
    │   ├── 512.jpg
    │   ├── 1024.jpg
    │   └── 2048.jpg
    ├── 2048-black.png
    ├── 2048-color.png
    ├── android-192x192.png
    ├── android-512x512.png
    ├── apple-180x180.png
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── favicon.ico
    ├── manifest.json
    ├── og.webp
    └── safari-pinned-tab.svg
└── src/
    ├── components/
    │   ├── Board.tsx
    │   ├── Control.tsx
    │   ├── Footer.tsx
    │   ├── Header.tsx
    │   ├── Overlay.tsx
    │   └── Tile.tsx
    ├── hooks/
    │   ├── useAppDispatch.ts
    │   └── useAppSelector.ts
    ├── pages/
    │   ├── _app.tsx
    │   ├── _document.tsx
    │   ├── index.tsx
    │   └── api/
    │       ├── confirmpayment.ts
    │       └── startpayment.ts
    ├── store/
    │   ├── action.ts
    │   ├── game.ts
    │   └── index.ts
    ├── styles/
    │   └── globals.css
    ├── types/
    │   ├── ActionType.ts
    │   ├── Animations.ts
    │   ├── Direction.ts
    │   └── Models.ts
    ├── utils/
    │   ├── board.ts
    │   └── localStorage.ts
    └── web3/
        ├── providers.tsx
        ├── onchainMove.tsx
        ├── offchainMove.tsx
        ├── contractInteractions.ts
        ├── useWalletConnect.ts
        ├── leaderboard.ts
        ├── nftClaim.ts
        ├── networks.ts
        ├── modeSelection.ts
        ├── gameState.ts
        ├── utils.ts
        ├── types.ts
        ├── stateManagement.ts
        ├── errorHandler.ts
        ├── uiComponents.tsx
        ├── api/
        │   ├── abi.json
        │   └── abi.ts

