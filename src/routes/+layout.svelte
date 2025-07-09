<script lang="ts">
  import '../app.css'; // This imports the Tailwind CSS styles
  import { onMount } from 'svelte';
  import { telegram, initTelegramSdk } from '$lib/stores/telegram';

  onMount(() => {
    initTelegramSdk();
  });
</script>

<div class="bg-gray-900 text-white min-h-screen p-4">
  <h1 class="text-xl font-bold text-golden-yellow">Welcome to ቃላት, {$telegram.userFirstName}!</h1>
  
  <!-- The main content of our pages will be rendered here -->
  <slot />
</div>