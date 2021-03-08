<script>
	export let previous
	export let next
</script>

<style>
	.navigation {
		display: flex;
		justify-content: space-between;
		margin-top: 1em;
	}
</style>

<div class="navigation">
	{#if previous}
		<a rel="prefetch" href="blog/{previous.slug}">{previous.title}</a>
	{:else}
		<span></span>
	{/if}
	{#if next}
		<a rel="prefetch" href="blog/{next.slug}">{next.title}</a>
	{:else}
		<span></span>
	{/if}
</div>