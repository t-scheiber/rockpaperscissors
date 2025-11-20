# Rock Paper Scissors - Enhanced with AI

Welcome to the Rock Paper Scissors Webapp, an innovative, browser-based adaptation of the timeless game, first launched in 2022 and most recently refreshed in 2025. Built with Next.js, this application leverages advanced AI for input recognition, while gameplay pits you against programmed computer moves.

**🌐 Live Site (English):** [rock-paper-scissors.thomasscheiber.com](https://rock-paper-scissors.thomasscheiber.com) | **🌐 Live Site (German):** [schere-stein-papier.thomasscheiber.com](https://schere-stein-papier.thomasscheiber.com)

> **Note:** A German version of this description is available below.

## Features

- **Multiple Input Methods**: Play using the method that suits you best:

  - **Mouse**: A classic point-and-click interface.
  - **Keyboard**: Responsive gameplay using keyboard shortcuts.
  - **Webcam**: Leverage state-of-the-art AI to interpret your hand gestures through real-time image recognition powered by TensorFlow.js.

- **AI Integration for Gesture Recognition**: The webcam mode utilizes TensorFlow.js to analyze your hand gestures and accurately determine your move (rock, paper, or scissors).

- **Localized Experience**: Available in both German and English, facilitated by the `next-intl` package, making the game accessible to a diverse set of players.

- **Responsive and Stylish UI**: Designed with Tailwind CSS for a clean, modern look that adjusts seamlessly across devices.

- **Cutting-Edge Technology**: Incorporates the latest Next.js 16 features, including the App Router and Turbopack build pipeline. The application is fully implemented in TypeScript to enhance code quality and maintainability.

## How It Works

1. **Select Input Method**: Begin by choosing how you want to interact with the game: mouse, keyboard, or webcam.
2. **Make Your Move**: In webcam mode, show your choice of rock, paper, or scissors to the camera. The TensorFlow.js model processes this input to identify your gesture.
3. **Computer's Turn**: A computer-generated move is created randomly at the same time.
4. **Determine the Winner**: The app compares both choices based on classic Rock Paper Scissors rules to decide the winner.

## Requirements

- Node.js >= 20.9 (required by Next.js 16)
- [Bun](https://bun.sh) >= 1.3 (used for dependency management and scripts)

## Getting Started

```bash
git clone https://github.com/t-scheiber/rockpaperscissors.git
cd rockpaperscissors
bun install
bun run dev
```

Visit `http://localhost:3000` to enjoy the game! Or play directly online at [rock-paper-scissors.thomasscheiber.com](https://rock-paper-scissors.thomasscheiber.com/).

### Useful Scripts

```bash
bun run lint
bun run build
bun run start
```

## Technologies Used

- **Next.js 16**: Empowers server-side rendering and static generation with Turbopack by default.
- **TypeScript**: Provides strong typing to reduce runtime errors.
- **Tailwind CSS**: Ensures a responsive, mobile-first design.
- **TensorFlow.js**: Facilitates real-time hand gesture recognition.
- **Next-Intl**: Offers comprehensive internationalization support.

This application showcases the integration of modern web technologies and AI, providing a unique and engaging user experience. First launched in 2022, it continues to evolve—most recently refreshed in 2025—to stay aligned with the latest Next.js capabilities. Test your strategy against the computer's random moves and enjoy a modern twist on the classic game of Rock Paper Scissors!

---

## Deutsche Version

Willkommen bei der Web-App "Schere Stein Papier", einer innovativen browserbasierten Adaption des zeitlosen Spiels, ursprünglich 2022 veröffentlicht und 2025 modernisiert. Entwickelt mit Next.js, nutzt diese Anwendung fortschrittliche KI für die Eingabeerkennung, während das Gameplay gegen zufällige Züge des Computers stattfindet.

## Funktionen

- **Mehrere Eingabemethoden**: Spielen Sie auf die Weise, die Ihnen am besten gefällt:

  - **Maus**: Eine klassische Point-and-Click-Schnittstelle.
  - **Tastatur**: Reaktionsfähiges Gameplay mit Tastaturkürzeln.
  - **Webcam**: Nutzen Sie modernste KI, um Ihre Handgesten durch Echtzeit-Bilderkennung mittels TensorFlow.js zu interpretieren.

- **KI-Integration zur Gestenerkennung**: Der Webcam-Modus verwendet TensorFlow.js, um Ihre Handgesten zu analysieren und Ihre Bewegung (Schere, Stein oder Papier) genau zu bestimmen.

- **Lokalisierte Erfahrung**: Verfügbar in Deutsch und Englisch, ermöglicht durch das `next-intl` Paket, macht das Spiel zugänglich für eine diverse Spielerbasis.

- **Responsives und Stilvolles UI**: Entworfen mit Tailwind CSS für ein sauberes, modernes Aussehen, das sich nahtlos über Geräte hinweg anpasst.

- **Spitzentechnologie**: Beinhaltet die neuesten Funktionen von Next.js 16, einschließlich App Router und Turbopack. Die Anwendung ist vollständig in TypeScript implementiert, um die Qualität und Wartbarkeit des Codes zu verbessern.

## Funktionsweise

1. **Wählen Sie die Eingabemethode**: Beginnen Sie, indem Sie auswählen, wie Sie mit dem Spiel interagieren möchten: Maus, Tastatur oder Webcam.
2. **Machen Sie Ihren Zug**: Im Webcam-Modus zeigen Sie Ihre Wahl von Schere, Stein oder Papier vor der Kamera. Das TensorFlow.js-Modell verarbeitet diese Eingabe, um Ihre Geste zu identifizieren.
3. **Zug des Computers**: Gleichzeitig wird ein zufälliger Zug für den Computer generiert.
4. **Ermitteln des Gewinners**: Die App vergleicht beide Wahlen anhand der klassischen Regeln von Schere, Stein, Papier, um den Gewinner zu ermitteln.

## Voraussetzungen

- Node.js >= 20.9 (Pflicht für Next.js 16)
- [Bun](https://bun.sh) >= 1.3 (für Installation und Skripte)

## Erste Schritte

```bash
git clone https://github.com/t-scheiber/rockpaperscissors.git
cd rockpaperscissors
bun install
bun run dev
```

Besuchen Sie `http://localhost:3000`, um das Spiel zu genießen! Oder spielen Sie direkt online unter [schere-stein-papier.thomasscheiber.com](https://schere-stein-papier.thomasscheiber.com/).

### Nützliche Skripte

```bash
bun run lint
bun run build
bun run start
```

## Verwendete Technologien

- **Next.js 16**: Ermöglicht serverseitiges Rendering und statische Generierung mit Turbopack.
- **TypeScript**: Bietet starke Typisierung, um Laufzeitfehler zu reduzieren.
- **Tailwind CSS**: Gewährleistet ein responsives, mobile-first Design.
- **TensorFlow.js**: Ermöglicht die Echtzeit-Erkennung von Handgesten.
- **Next-Intl**: Bietet umfassende Unterstützung für Internationalisierung.

Diese Anwendung zeigt die Integration von modernen Webtechnologien und KI, bietet ein einzigartiges und fesselndes Spielerlebnis. Ursprünglich 2022 veröffentlicht und 2025 modernisiert, bleibt sie technisch auf dem neuesten Stand. Testen Sie Ihre Strategie gegen die zufälligen Züge des Computers und genießen Sie eine moderne Wendung des klassischen Spiels Schere Stein Papier!
