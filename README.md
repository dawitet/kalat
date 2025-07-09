# ቃላት (Qalat) - Amharic Pictionary Game

This is a simple Pictionary-style game built as a Telegram Web App. The game is written in Amharic and presents the user with two images that hint at a two-word Amharic phrase.

## How it Works

The game is built using SvelteKit and the Telegram Web App SDK. Here's a breakdown of the project structure:

- **`src/`**: This directory contains the main source code for the application.
  - **`lib/`**: This directory contains the core logic and components of the game.
    - **`components/GameScreen.svelte`**: This is the main game component. It handles the game logic, state management, and UI.
    - **`levels.json`**: This file contains the game levels. Each level has two images and an answer.
    - **`stores/telegram.ts`**: This file initializes the Telegram Web App SDK and handles communication with the Telegram client.
  - **`routes/`**: This directory contains the pages for the application.
    - **`+layout.svelte`**: This is the main layout for the application. It sets up the overall page structure and theme.
    - **`+page.svelte`**: This is the main page of the application. It dynamically loads the `GameScreen.svelte` component.
    - **`+page.ts`**: This file contains the page load logic.
- **`static/`**: This directory contains static assets, such as images.
- **`package.json`**: This file contains the project dependencies and scripts.

## Features

The game includes the following features:

- **Telegram Web App Integration**: The game is fully integrated with the Telegram Web App SDK.
- **Fullscreen Mode**: The game launches in fullscreen mode for an immersive experience.
- **Native Main Button**: The game uses Telegram's native main button for submitting answers.
- **Native Popups**: The game uses Telegram's native popups for notifications.
- **Dynamic Theming**: The game adapts to the user's Telegram color scheme.
- **Sharing**: Users can share their progress with their friends.
- **Cloud Storage**: The game saves the user's progress to Telegram's cloud storage.

## Development

To run the game locally, you'll need to have Node.js and npm installed. Then, follow these steps:

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Run the development server with `npm run dev`.
4. To see the game in action, you'll need to create a Telegram bot and configure it to point to your local development server.

## Deployment

The game is deployed to Vercel. Any changes pushed to the `main` branch will automatically trigger a new deployment.