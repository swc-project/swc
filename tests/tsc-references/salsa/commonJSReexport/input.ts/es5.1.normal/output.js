// #41422, based on prettier's exports
// @noEmit: true
// @checkJS: true
// @filename: first.js
var hardline = {
    type: "hard"
};
module.exports = {
    hardline: hardline
};
// @filename: second.js
module.exports = {
    nested: require('./first')
};
// @filename: main.js
var _nested = require('./second').nested, hardline = _nested.hardline;
hardline;
