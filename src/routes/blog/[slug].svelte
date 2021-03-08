<script context='module'>
  export async function preload(page) {

    const { slug } = page.params
    const component = await import(`./_posts/${slug}/index.md`)

    return {
      page: component.default,
      metadata: component.metadata
    }
  }
</script>

<script>
  export let page
  // import { setContext } from 'svelte'
  // setContext('series', series)
</script>

<svelte:component this={page} />