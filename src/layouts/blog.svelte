<script>
	import PostNavigator from '../components/PostNavigator.svelte'

	// Get the data that is stored in context in blog/[slug].svelte
	import { getContext } from 'svelte'
  const data = getContext('blog')

	// We need to use reactive statement here to make sure this data is fresh on every page
	// https://svelte.dev/tutorial/reactive-statements
	let previous
  let next

  $: if (data) {
		if (data.previous) {
			previous = data.previous
		}
		if (data.next) {
			next = data.next
		}
	}
</script>

<style>
	/*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content

    Since this layout uses a <slot/> to render mdsvex content, 
    it needs to use the :global(...) modifier to apply styles
	*/
	:global(.content h2) {
		font-size: 1.4em;
		font-weight: 500;
	}

	:global(.content pre) {
		background-color: #f9f9f9;
		box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
		padding: 0.5em;
		border-radius: 2px;
		overflow-x: auto;
	}

	:global(.content pre) :global(.content code) {
		background-color: transparent;
		padding: 0;
	}

	:global(.content ul) {
		line-height: 1.5;
	}

	:global(.content li) {
		margin: 0 0 0.5em 0;
	}
</style>

<svelte:head>
	<title>{$$props.title}</title>
</svelte:head>

<h1>{$$props.title}</h1>

<slot />

<PostNavigator {previous} {next} />