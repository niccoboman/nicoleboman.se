<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';
  import { page } from '$app/state';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  const isLogin = $derived(page.url.pathname === '/workout/login');
</script>

<div class="min-h-screen bg-paper text-ink">
  {#if !isLogin && data.user}
    <header class="border-b border-line px-4 py-3 flex items-center justify-between">
      <a href="/workout" class="font-display text-lg font-medium tracking-tight">
        Workout
      </a>
      <form method="POST" action="/workout/logout">
        <button type="submit" class="text-sm text-stone hover:text-ink transition">
          Logga ut
        </button>
      </form>
    </header>
  {/if}

  {@render children()}
</div>
