<script lang="ts">
  import { onMount } from 'svelte';

  let GameScreen: any;

  onMount(async () => {
    // Dynamically import the component only on the client-side.
    const module = await import('$lib/components/GameScreen.svelte');
    GameScreen = module.default;
  });
</script>

{#if GameScreen}
  <svelte:component this={GameScreen} />
{:else}
  <p class="text-center mt-10">Loading game...</p>
{/if}