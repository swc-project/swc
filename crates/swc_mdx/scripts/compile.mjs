import { compile } from '@mdx-js/mdx'

const output = await compile({ path: process.argv[2] }, { jsx: true })
console.log(output)