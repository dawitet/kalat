<script lang="ts">
  import '../app.css'; // This imports the Tailwind CSS styles
  import { onMount } from 'svelte';
  import { SDK } from '@telegram-apps/sdk';

  let sdk: SDK;
  let userName = '...'; // Default name

  onMount(() => {
    try {
      // Initialize the SDK
      sdk = new SDK();
      sdk.init();

      // Get user's first name, with a fallback
      userName = sdk.initData?.user?.firstName ?? 'Guest';

      // Tell Telegram the app is ready to be shown
      sdk.ready();
    } catch (e) {
      console.error(e);
      userName = 'Not in Telegram';
    }
  });
</script>

<div class="bg-gray-900 text-white min-h-screen p-4">
  <h1 class="text-xl font-bold">Welcome to ቃላት, {userName}!</h1>
  
  <!-- The main content of our pages will be rendered here -->
  <slot />
</div>
