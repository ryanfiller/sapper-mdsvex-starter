---
title: Colocate images and content
order: 70
---

<style>

.images {
  display: flex;
  justify-content: center;
  align-items: center;
}

.images p img {
  max-width: 15em;
}

.images span {
  font-size: 2em;
  padding: 0 1em;
}

</style>

You can also put images inside the `_images` directory for each post, and rollup will use `rollup-plugin-copy` to move them into the `static/images` directory at build time. It doesn't handle files with the same name, so be sure to name images with something unique or else they will overwrite each other.

<div class='images'>

  ![mdsvex penguin](/images/mdsvex_penguin.gif)

  <span>🧡</span>

  ![sapper logo](/images/sapper_logo.svg)

</div>
