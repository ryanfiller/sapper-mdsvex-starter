<script context='module'>
  export async function preload(page) {
    const { slug } = page.params
    
    const component = await import(`./_posts/${slug}/index.md`)

    const data = await this.fetch(`/blog/${slug}.json`)
		.then(response => response.json())
		.then(data => ({
      previous: data.previous,
      next: data.next
    }))

    return {
      page: component.default,
      previous: data.previous,
      next: data.next
    }
  }
</script>

<script>
  export let page
  export let previous
  export let next

  // Since we don't have direct access to the mdsvex component, use context to pass data down
  import { setContext } from 'svelte'
  
  // We need to use reactive statement here to make sure this data is fresh on every page
	// https://svelte.dev/tutorial/reactive-statements
  $: setContext('blog', { previous, next })
</script>

<svelte:component this={page} />