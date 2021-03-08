---
title: Svex up your markdown
count: 25
color: cadetblue
list: [1, 2, 3, 4, "boo"]
order: 60

---

<script>
	import Boinger from '._components/Boinger.svelte';
	import Section from '._components/Section.md';
	import Count from '._components/Count.svelte';
  import Seriously from '._components/Seriously.svelte';

	let number = 45;
</script>

# { title }

## Good stuff in your markdown

Markdown is pretty good but sometimes you just need more.

Sometimes you need a boinger like this:

<Boinger color="{ color }"/>

Not many people have a boinger right in their markdown.

## Markdown in your markdown

Sometimes what you wrote last week is so good that you just *have* to include it again.

I'm not gonna stand in the way of your egomania.
>
><Section />
> <Count />
>
>— *Me, May 2019*

Yeah, thats right you can put wigdets in markdown (`.svx` files or otherwise). You can put markdown in widgets too.

<Seriously>

### I wasn't joking

```
	This is real life
```

</Seriously>

Sometimes you need your widgets **inlined** (like this:<Count count="{number}"/>) because why shouldn't you.
Obviously you have access to values defined in YAML (namespaced under `metadata`) and anything defined in an fenced `js exec` block can be referenced directly.

Normal markdown stuff works too:

| like  | this |
|-------|------|
| table | here |

And *this* and **THIS**. And other stuff. You can also use all your favorite Svelte features, like `each` blocks:

<ul>
{#each list as item}
  <li>{item}</li>
{/each}
</ul>

and all the other good Svelte stuff.

