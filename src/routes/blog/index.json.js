const unified = require('unified')
const remarkParse = require('remark-parse')
const remarkStringify = require('remark-stringify')
const remarkFrontmatter = require('remark-frontmatter')
const remarkExtractFrontmatter = require('remark-extract-frontmatter')
const yaml = require('yaml').parse
const remarkToRehype = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')

import fs from 'fs'
import path from 'path'

function isDir(path) {
	try {
		const stat = fs.lstatSync(path)
		return stat.isDirectory()
	} catch (e) { return false }
}

const directory = `src/routes/blog/_posts`

// read each file
const pages = {}
fs.readdirSync(directory).map(file => {
	// if a there is a [file].md or [file]/index.md...
	if (isDir(`${directory}/${file}`)) {
		// get the index.md file
		pages[file] = `${directory}/${file}/index.md`
	} else {
		pages[file] = `${directory}/${file}`
	}
})

// create data from each file
const data = Object.entries(pages).map(page => {

	const [ key, value ] = page

	const file = fs.readFileSync(value, 'utf-8')
	let frontmatter
	
	// process using unified, can insert other plugins here
	unified()
	.use(remarkParse)
	.use(remarkFrontmatter, ['yaml'])
	.use(remarkExtractFrontmatter, { yaml: yaml })
	.use(remarkStringify)
	.use(remarkToRehype)
	.use(rehypeStringify)
	.process(file, function (err, file) {
		if (err) {
			console.error('error getting page', err)
		}
		frontmatter = file.data
	})

	return ({
		...frontmatter,
		slug: key,
	})
}).sort((a, b) => (a.order > b.order) ? 1 : -1)

export function get(_req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	})

	res.end(JSON.stringify(data))
} 