<script lang="ts">
  import { onMount } from 'svelte';
  import levels from '$lib/levels.json';
  import { telegram } from '$lib/stores/telegram';

  // --- State Management ---
  let currentLevelIndex = 0;
  let currentGuess = '';
  let isLoading = true; // To show a loading message initially
  
  // Notification state
  let notification = { show: false, message: '', type: 'success' as 'success' | 'error' };

  // --- Reactive variables ---
  $: currentLevel = levels[currentLevelIndex];
  $: correctAnswer = currentLevel.answer.replace(/\s/g, '');
  

  // --- Core Functions ---
  onMount(async () => {
    console.log("GameScreen: onMount started.");
    // Wait for the SDK to be ready from the store
    const unsubscribe = telegram.subscribe(async ($telegram) => {
      console.log("GameScreen: telegram store updated. isReady:", $telegram.isReady, "sdk:", !!$telegram.sdk);
      if ($telegram.isReady) {
        if ($telegram.sdk) {
          $telegram.sdk.MainButton.setParams({
            text: 'Submit',
            is_visible: true,
            is_active: false, // Initially disabled
          });

          $telegram.sdk.MainButton.onClick(checkAnswer);

          try {
            // Attempt to load saved progress from Telegram Cloud
            const savedLevelIndex = await $telegram.sdk.cloudStorage.getItem('currentLevelIndex');
            if (savedLevelIndex && !isNaN(parseInt(savedLevelIndex))) {
              currentLevelIndex = parseInt(savedLevelIndex);
              console.log("GameScreen: Loaded saved level index:", currentLevelIndex);
            }
          } catch (e) {
            console.error("GameScreen: Error loading saved progress:", e);
          }
        }
        isLoading = false; // Stop loading, show the game
        console.log("GameScreen: isLoading set to false.");
        unsubscribe(); // Unsubscribe once ready
      } else {
        console.log("GameScreen: SDK not yet ready.");
      }
    });
  });

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    currentGuess = input.value;
    if ($telegram.sdk) {
      $telegram.sdk.MainButton.setParams({ is_active: currentGuess.length > 0 });
    }
  }

  async function checkAnswer() {
    if (!$telegram.sdk) {
      showNotification('Telegram SDK not available.', 'error');
      return;
    }

    $telegram.sdk.MainButton.showProgress();

    if (currentGuess.toLowerCase() === correctAnswer.toLowerCase()) {
      $telegram.sdk.hapticFeedback.notificationOccurred('success');
      showNotification('Correct!', 'success');
      
      // Check if there is a next level
      if (currentLevelIndex < levels.length - 1) {
        const nextLevelIndex = currentLevelIndex + 1;
        // Save the *next* level index to the cloud
        await $telegram.sdk.cloudStorage.setItem('currentLevelIndex', nextLevelIndex.toString());
        // Move to the next level after a short delay
        setTimeout(() => {
          currentLevelIndex = nextLevelIndex;
          currentGuess = '';
        }, 1000);
      } else {
        // Game finished!
        showNotification('You finished all the levels!', 'success');
        await $telegram.sdk.cloudStorage.setItem('currentLevelIndex', '0'); // Reset for next time
      }
    } else {
      $telegram.sdk.hapticFeedback.notificationOccurred('error');
      showNotification('Incorrect. Try again.', 'error');
    }
    $telegram.sdk.MainButton.hideProgress();
  }

  function share() {
    if ($telegram.sdk) {
      $telegram.sdk.switchInlineQuery(`I'm on level ${currentLevelIndex + 1} in ቃላት!`);
    }
  }
  
  function showNotification(message: string, type: 'success' | 'error') {
    if ($telegram.sdk) {
      $telegram.sdk.showAlert(message);
    } else {
      // Fallback for when the SDK is not available
      notification = { show: true, message, type };
      setTimeout(() => {
        notification.show = false;
      }, 2000);
    }
  }

  
</script>

{#if isLoading}
  <p class="text-center mt-10 text-golden-yellow">Loading your game...</p>
{:else}
  <div class="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-4 relative">
    
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

    <!-- Letter Boxes -->
    <div class="flex justify-center gap-2">
      {#each currentLevel.answer.split('') as char, i}
        <div class="w-10 h-10 rounded-lg flex items-center justify-center text-2xl font-bold" style="background-color: var(--button-color); color: var(--button-text-color);">
          {currentGuess[i] || (char === ' ' ? '' : '_')}
        </div>
      {/each}
    </div>

    <!-- Input Field -->
    <input
      type="text"
      bind:value={currentGuess}
      on:input={handleInput}
      class="w-full p-3 text-center text-xl rounded-lg"
      style="background-color: var(--bg-color); color: var(--text-color); border: 1px solid var(--hint-color);"
      placeholder="Type your answer here"
    />

    <!-- Share Button -->
    <div class="w-full mt-2">
      <button on:click={share} class="w-full p-3 rounded-lg text-white font-bold" style="background-color: var(--link-color);">Share</button>
    </div>

    
  </div>
{/if}