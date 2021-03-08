import path from 'path';
import svelte from 'rollup-plugin-svelte';
import { mdsvex } from 'mdsvex';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'
import url from '@rollup/plugin-url';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	onwarn(warning);

const extensions = ['.svelte', '.md'];
const preprocess = [
	mdsvex({
		extension: '.md',
		layout: {
			blog: 'src/layouts/blog.svelte'
		},
	})
]

const dynamicImportVarsOptions = {
	include: [
		`src/routes/**/*.svelte`
	]
}

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				preventAssignment: true,
				values:{
					'process.browser': true,
					'process.env.NODE_ENV': JSON.stringify(mode)
				},
			}),
			svelte({
				compilerOptions: {
					dev,
					hydratable: true
				},
				extensions,
				preprocess
			}),
			url({
				sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/'
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			dynamicImportVars(dynamicImportVarsOptions),

			copy({
				targets: [
					// dunno why, but this breaks the server.js process if its `_images`
					{ src: 'src/**/images/*.*', dest: 'static/images' }
				]
			}),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				preventAssignment: true,
				values:{
					'process.browser': false,
					'process.env.NODE_ENV': JSON.stringify(mode)
				},
			}),
			svelte({
				compilerOptions: {
					dev,
					generate: 'ssr',
					hydratable: true
				},
				extensions,
				preprocess
			}),
			url({
				sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
				publicPath: '/client/',
				emitFiles: false // already emitted by client build
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs(),
			dynamicImportVars(dynamicImportVarsOptions),
			copy({
				targets: [
					{ src: 'src/**/_images/*.*', dest: 'static/images' }
				]
			})
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),
		preserveEntrySignatures: 'strict',
		onwarn,
	},

	// serviceworker: {
	// 	input: config.serviceworker.input(),
	// 	output: config.serviceworker.output(),
	// 	plugins: [
	// 		resolve(),
	// 		replace({
	// 			preventAssignment: true,
	// 			values:{
	// 				'process.browser': true,
	// 				'process.env.NODE_ENV': JSON.stringify(mode)
	// 			},
	// 		}),
	// 		commonjs(),
	// 		dynamicImportVars(dynamicImportVarsOptions),
	// 		!dev && terser()
	// 	],
	// 	preserveEntrySignatures: false,
	// 	onwarn,
	// }
};
