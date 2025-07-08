<script lang="ts">
  import { onMount } from 'svelte';
  import { SDK } from '@telegram-apps/sdk';
  import type { HapticFeedback } from '@telegram-apps/sdk';
  import levels from '$lib/levels.json';

  // --- SDK and Haptic Feedback ---
  let sdk: SDK;
  let haptic: HapticFeedback;

  // --- State Management ---
  let currentLevelIndex = 0;
  let currentGuess = '';
  let isLoading = true; // To show a loading message initially
  
  // Notification state
  let notification = { show: false, message: '', type: 'success' as 'success' | 'error' };

  // --- Reactive variables ---
  $: currentLevel = levels[currentLevelIndex];
  $: correctAnswer = currentLevel.answer.replace(/\s/g, '');
  $: formattedGuess = formatGuess(currentGuess, currentLevel.answer);

  // --- Keyboard ---
  const amharicAlphabet = [
    'ሀ', 'ለ', 'ሐ', 'መ', 'ሠ', 'ረ', 'ሰ', 'ሸ', 'ቀ', 'በ', 'ተ', 'ቸ',
    'ኀ', 'ነ', 'ኘ', 'አ', 'ከ', 'ኸ', 'ወ', 'ዐ', 'ዘ', 'ዠ', 'የ', 'ደ',
    'ጀ', 'ገ', 'ጠ', 'ጨ', 'ጰ', 'ጸ', 'ፀ', 'ፈ', 'ፐ'
  ];

  // --- Core Functions ---
  onMount(async () => {
    try {
      sdk = new SDK();
      await sdk.init();
      haptic = sdk.hapticFeedback;

      // Attempt to load saved progress from Telegram Cloud
      const savedLevelIndex = await sdk.cloudStorage.getItem('currentLevelIndex');
      if (savedLevelIndex && !isNaN(parseInt(savedLevelIndex))) {
        currentLevelIndex = parseInt(savedLevelIndex);
      }
      sdk.ready();
    } catch (e) {
      console.error("Could not initialize Telegram SDK or load data.", e);
    } finally {
      isLoading = false; // Stop loading, show the game
    }
  });

  function handleKeyPress(char: string) {
    haptic.impactOccurred('light');
    if (currentGuess.length < correctAnswer.length) {
      currentGuess += char;
    }
  }

  function handleDelete() {
    haptic.impactOccurred('light');
    currentGuess = currentGuess.slice(0, -1);
  }

  async function checkAnswer() {
    if (currentGuess.toLowerCase() === correctAnswer.toLowerCase()) {
      haptic.notificationOccurred('success');
      showNotification('Correct!', 'success');
      
      // Check if there is a next level
      if (currentLevelIndex < levels.length - 1) {
        const nextLevelIndex = currentLevelIndex + 1;
        // Save the *next* level index to the cloud
        await sdk.cloudStorage.setItem('currentLevelIndex', nextLevelIndex.toString());
        // Move to the next level after a short delay
        setTimeout(() => {
          currentLevelIndex = nextLevelIndex;
          currentGuess = '';
        }, 1000);
      } else {
        // Game finished!
        showNotification('You finished all the levels!', 'success');
        await sdk.cloudStorage.setItem('currentLevelIndex', '0'); // Reset for next time
      }
    } else {
      haptic.notificationOccurred('error');
      showNotification('Incorrect. Try again.', 'error');
    }
  }
  
  function showNotification(message: string, type: 'success' | 'error') {
    notification = { show: true, message, type };
    setTimeout(() => {
      notification.show = false;
    }, 2000);
  }

  // Helper function to format the guess display
  function formatGuess(guess: string, answerFormat: string): string {
    if (!answerFormat) return '';
    let result = '';
    let guessIndex = 0;
    for (const char of answerFormat) {
      if (char === ' ') {
        result += ' ';
      } else {
        result += guess[guessIndex] ?? '_';
        guessIndex++;
      }
    }
    return result;
  }
</script>

{#if isLoading}
  <p class="text-center mt-10">Loading your game...</p>
{:else}
  <div class="w-full max-w-md mx-auto flex flex-col items-center gap-4 mt-8 relative">
    
    <!-- Notification Popup -->
    {#if notification.show}
      <div class="absolute -top-6 px-4 py-2 rounded-lg text-white font-semibold shadow-xl
        {notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}">
        {notification.message}
      </div>
    {/if}

    <!-- Image Display -->
    <div class="flex gap-2 justify-center">
      <img src={currentLevel.image1} alt="Hint 1" class="w-32 h-32 object-cover bg-gray-700 rounded-lg shadow-lg" />
      <img src={currentLevel.image2} alt="Hint 2" class="w-32 h-32 object-cover bg-gray-700 rounded-lg shadow-lg" />
    </div>

    <!-- Answer Display -->
    <div class="text-3xl tracking-[0.5em] font-mono text-center p-4 bg-gray-800 rounded-lg w-full">
      {formattedGuess || correctAnswer.replace(/./g, '_')}
    </div>

    <!-- Keyboard -->
    <div class="grid grid-cols-7 gap-1.5 w-full">
      {#each amharicAlphabet as char}
        <button on:click={() => handleKeyPress(char)} class="p-2 bg-gray-700 rounded-md text-xl active:bg-gray-500 transition-colors">
          {char}
        </button>
      {/each}
    </div>

    <!-- Control Buttons -->
    <div class="flex gap-2 w-full mt-2">
      <button on:click={handleDelete} class="flex-1 p-3 bg-red-600 rounded-lg text-white font-bold">Delete</button>
      <button on:click={checkAnswer} class="flex-1 p-3 bg-green-600 rounded-lg text-white font-bold">Submit</button>
    </div>
  </div>
{/if}