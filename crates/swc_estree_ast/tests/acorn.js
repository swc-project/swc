// File to parse input as an AST using acorn


const acorn = require("acorn");
const res = acorn.parse(process.argv[1], {
    ecmaVersion: 2020,
    ranges: true
})
console.log(JSON.stringify(res, void 0, 4));