//// [commonJSReexport.ts]
// #41422, based on prettier's exports
//// [first.js]
module.exports = {
    hardline: {
        type: "hard"
    }
};
//// [second.js]
module.exports = {
    nested: require("./first")
};
//// [main.js]
require("./second").nested.hardline;
