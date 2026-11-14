# Rock Paper Scissors

Rock paper scissors against the computer, in the browser. You pick your move with the mouse, with the keyboard, or by holding your hand up to the webcam. A TensorFlow.js model classifies the webcam photo as rock, paper or scissors. The computer's move is random.

This was my bachelor project at FH Technikum Wien. I first built it in 2022 and refreshed it in 2025.

Live at [rock-paper-scissors.thomasscheiber.com](https://rock-paper-scissors.thomasscheiber.com) (English) and [schere-stein-papier.thomasscheiber.com](https://schere-stein-papier.thomasscheiber.com) (German). The app itself is available in both languages, and a flag link in the header switches between them.

## How it plays

- **Mouse.** Click the rock, paper or scissors image.
- **Keyboard.** Press `R`, `P` or `S`. Shortcuts with Ctrl, Alt or Meta, and key presses inside text fields, are ignored.
- **Webcam.** Press the capture button. The app takes one still frame, center-crops it to a square, scales it to 224 by 224 pixels and passes it to the model. It shows the model's guess, and you continue to the result page or retry.

The result page compares your move with the computer's random move and shows win, lose or draw. Each locale lives under its own path (`/en`, `/de`), and `/` redirects to `/en`.

## The model

I trained the model myself in Google's Teachable Machine. It is an image classifier with the labels Rock, Paper and Scissors and a 224 by 224 input (`public/AI/metadata.json`). It loads in the browser with `tf.loadLayersModel` from `public/AI/model.json` and `weights.bin`, so no server-side inference runs.

`Trainingsdaten_AI_Modell/` holds the 5,671 training images, 1,838 for rock, 1,914 for paper and 1,919 for scissors. I combined public rock-paper-scissors datasets from Kaggle with photos of my own hands to get the most accurate model I could. Teachable Machine trains in the browser, so the repo has no training scripts. To retrain, upload the three folders as classes in Teachable Machine, train, and export the TensorFlow.js model into `public/AI/`.

## Stack

- Next.js 16.4 with the App Router, React 19.3, TypeScript 6.0
- Tailwind CSS 4.3, Radix UI, lucide-react
- next-intl 4.15 for English and German, with routing in `i18n/routing.ts` and texts in `dictionaries/`
- TensorFlow.js 4.22 and react-webcam
- Vercel Speed Insights, loaded in the root layout

## Run it locally

You need Node.js 22 (`engines` in `package.json` asks for `>=22.23.2 <23`) and [Bun](https://bun.sh).

```bash
git clone https://github.com/t-scheiber/rockpaperscissors.git
cd rockpaperscissors
bun install
bun run dev
```

Open `http://localhost:3000`. The app reads no environment variables. Browsers only allow webcam access on `localhost` or over HTTPS.

## Scripts

| Script | What it runs |
| --- | --- |
| `bun run dev` | `next dev` |
| `bun run build` | `next build` |
| `bun run start` | `next start`, after a build |
| `bun run lint` | `eslint .` |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run test` | `node --test tests/*.test.mjs` |

The tests cover the game rules, keyboard handling, image preprocessing for the model, model loading with retry, and a production-server check of both locales and every public asset. The server check needs a prior `bun run build`. TensorFlow.js is stubbed in the model tests, so they do not run a real prediction.

`tests/production.test.mjs` also hashes every training image, model file and public asset. It compares those hashes byte for byte, so it fails on a Windows checkout where Git converts line endings in `AI/teachablemachine-image.min.js` and `public/manifest.json`.

## Repository layout

- `app/[locale]/` has the home, mouse, keyboard, camera and result pages.
- `components/` has the game components and the webcam component.
- `lib/teachableModel.ts` loads the model and runs a prediction.
- `public/AI/` holds the model the app serves. `AI/` holds a second export from two days later (`AI/metadata.json` is dated 2024-03-14, `public/AI/metadata.json` 2024-03-12) with different weights. The app does not load it.
- `Trainingsdaten_AI_Modell/` has the training images.
- `.github/renovate/` and `renovate.json` configure automated dependency updates.
