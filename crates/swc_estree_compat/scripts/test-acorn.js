// File to parse input as an AST using acorn

const parserOptions = {
    ranges: true,
    locations: true,
    ecmaVersion: "latest",
    // https://github.com/tc39/proposal-hashbang
    allowHashBang: true,
};

const acorn = require("acorn");
const res = acorn.parse(process.argv[1], parserOptions);
console.log(JSON.stringify(res, void 0, 2));
