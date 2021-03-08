# sapper-mdsvex-starter

[See it in action.](https://ryanfiller-sapper-mdsvex-starter.netlify.app/)

A template for setting up a [Sapper](https://github.com/sveltejs/sapper) project with [mdsvex](https://mdsvex.com/) using Rollup. This template is different than default [sapper-mdsvex-template](https://github.com/pngwn/sapper-mdsvex-template) in that it uses [dynamic module importing]([sapper-mdsvex-template](https://github.com/pngwn/sapper-mdsvex-template)) to combine [Sapper dyanmic pages](https://sapper.svelte.dev/docs#Pages) with [mdsvex templates](https://mdsvex.com/docs#layouts).

## Getting started

### Using `degit`

To create a new Sapper project based on Rollup locally, run

```bash
npx degit "ryanfiller/sapper-mdsvex-starter#main" my-app
```

[`degit`](https://github.com/Rich-Harris/degit) is a scaffolding tool that lets you create a directory from a branch in a repository.

Replace `my-app` with the path where you wish to create the project.


### Using GitHub templates

Alternatively, you can create the new project as a GitHub repository using GitHub's template feature.

Go to [ryanfiller/sapper-mdsvex-starter](https://github.com/ryanfiller/sapper-mdsvex-starter) and click on "Use this template" to create a new project repository initialized by the template.

### Running the project

Once you have created the project, install dependencies and run the project in development mode:

```bash
cd my-app
npm install
npm run dev
```

This will start the development server on [localhost:3000](http://localhost:3000). Open it and click around.

You now have a fully functional Sapper project! To get started developing, consult [sapper.svelte.dev](https://sapper.svelte.dev).

### Using TypeScript

By default, the template uses plain JavaScript. I have removed the `setupTypeScript.js ` script that comes with new Sapper projects, but theoretically it is possible to run this with TypeScript if you set it up on your own.

## Directory structure

Sapper expects to find two directories in the root of your project —  `src` and `static`.

### src

The [src](src) directory contains the entry points for your app — `client.js`, `server.js` and (optionally) a `service-worker.js` — along with a `template.html` file and a `routes` directory.

#### src/routes

This is the heart of your Sapper app. There are two kinds of routes — *pages*, and *server routes*.

**Pages** are Svelte components written in `.svelte` files. When a user first visits the application, they will be served a server-rendered version of the route in question, plus some JavaScript that 'hydrates' the page and initialises a client-side router. From that point forward, navigating to other pages is handled entirely on the client for a fast, app-like feel. (Sapper will preload and cache the code for these subsequent pages, so that navigation is instantaneous.)

**Server routes** are modules written in `.js` files, that export functions corresponding to HTTP methods. Each function receives Express `request` and `response` objects as arguments, plus a `next` function. This is useful for creating a JSON API, for example.

There are three simple rules for naming the files that define your routes:

* A file called `src/routes/about.svelte` corresponds to the `/about` route. A file called `src/routes/blog/[slug].svelte` corresponds to the `/blog/:slug` route, in which case `params.slug` is available to the route
* The file `src/routes/index.svelte` (or `src/routes/index.js`) corresponds to the root of your app. `src/routes/about/index.svelte` is treated the same as `src/routes/about.svelte`.
* Files and directories with a leading underscore do *not* create routes. This allows you to colocate helper modules and components with the routes that depend on them — for example you could have a file called `src/routes/_helpers/datetime.js` and it would *not* create a `/_helpers/datetime` route.

#### src/templates

This directory is where components used a [mdsvex templates](https://github.com/pngwn/sapper-mdsvex-template) live. They can be configured in `rollup.config.js` and will have the transformed markdown content passed to them as children. 

#### src/**/_posts

Markdown files are transformed into Svelte components via `mdsvex`, and are found by their file name and dynamically loaded as components into `[slug].svelte` files using [@rollup/plugin-dynamic-import-vars](https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars).

#### src/node_modules/@sapper

This directory is managed by Sapper and generated when building. It contains all the code you import from `@sapper` modules.

### static

The [static](static) directory contains static assets that should be served publicly. Files in this directory will be available directly under the root URL, e.g. an `image.jpg` will be available as `/image.jpg`.

The default [service-worker.js](src/service-worker.js) will preload and cache these files, by retrieving a list of `files` from the generated manifest:

```js
import { files } from '@sapper/service-worker';
```

If you have static files you do not want to cache, you should exclude them from this list after importing it (and before passing it to `cache.addAll`).

Static files are served using [sirv](https://github.com/lukeed/sirv).

### static/images

Files from `src/routes/blog/[slug]/_images` are copied into the `static/images` directory using [rollup-plugin-copy](https://www.npmjs.com/package/rollup-plugin-copy). The root of this directory is added to `.gitignore` so images aren't tracked twice, but inside of `static/images` there is a ``static/images/site-assets` directory that _will_ be tracked to git. Images copied with the same name will overwrite each other, so please be careful.

## Bundler configuration

This template uses Rollup to provide code-splitting and dynamic imports, as well as compiling your Svelte components. As long as you don't do anything daft, you can edit the configuration files to add whatever plugins you'd like.

## Production mode and deployment

To start a production version of your app, run `npm run build && npm start`. This will disable live reloading, and activate the appropriate bundler plugins.

You can deploy your application to any environment that supports Node 10 or above. As an example, to deploy to [Vercel Now](https://vercel.com) when using `sapper export`, run these commands:

```bash
npm install -g vercel
vercel
```

If your app can't be exported to a static site, you can use the [vercel-sapper](https://github.com/thgh/vercel-sapper) builder. You can find instructions on how to do so in its [README](https://github.com/thgh/vercel-sapper#basic-usage).

## Using external components

When using Svelte components installed from npm, such as [@sveltejs/svelte-virtual-list](https://github.com/sveltejs/svelte-virtual-list), Svelte needs the original component source (rather than any precompiled JavaScript that ships with the component). This allows the component to be rendered server-side, and also keeps your client-side app smaller.

Because of that, it's essential that the bundler doesn't treat the package as an *external dependency*. You can either modify the `external` option under `server` in [rollup.config.js](rollup.config.js) or simply install the package to `devDependencies` rather than `dependencies`, which will cause it to get bundled (and therefore compiled) with your app:

```bash
npm install -D @sveltejs/svelte-virtual-list
```

## Troubleshooting

Using Windows and WSL2? 

If your project lives outside the WSL root directory, [this limitation](https://github.com/microsoft/WSL/issues/4169) is known to cause live-reloading to fail. See [this issue](https://github.com/sveltejs/sapper/issues/1150) for details.

## Bugs and feedback

Sapper is in early development, and may have the odd rough edge here and there. Please be vocal over on the [Sapper issue tracker](https://github.com/sveltejs/sapper/issues).

If there are issues with this template specifically, issues can be filed (here)[https://github.com/ryanfiller/sapper-mdsvex-starter/issues].
