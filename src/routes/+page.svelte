<script lang="ts">
  import { onMount } from 'svelte';
  import GameScreen from '$lib/components/GameScreen.svelte';

  let showGame = false;

  onMount(() => {
    // This code only runs in the browser, not on the server.
    showGame = true;
  });
</script>

{#if showGame}
  <GameScreen />
{/if}
