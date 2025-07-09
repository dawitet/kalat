<script lang="ts">
  import '../app.css'; // This imports the Tailwind CSS styles
  import { onMount } from 'svelte';
  import { telegram, initTelegramSdk } from '$lib/stores/telegram';

  onMount(() => {
    initTelegramSdk();
  });
</script>

<div class="min-h-screen p-4" style="background-color: var(--bg-color); color: var(--text-color);">
  <h1 class="text-xl font-bold text-golden-yellow">Welcome to ቃላት, {$telegram.userFirstName}!</h1>
  
  <!-- The main content of our pages will be rendered here -->
  <slot />
</div>