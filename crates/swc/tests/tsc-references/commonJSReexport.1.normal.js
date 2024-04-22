//// [commonJSReexport.ts]
// #41422, based on prettier's exports
//// [first.js]
var hardline = {
    type: "hard"
};
module.exports = {
    hardline: hardline
};
//// [second.js]
module.exports = {
    nested: require('./first')
};
//// [main.js]
var hardline = require('./second').nested.hardline;
hardline;
