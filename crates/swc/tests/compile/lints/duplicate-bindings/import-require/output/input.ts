// ok
// ok
var _ = exports._ = require("lodash");
var x = "x";
// error
var y = exports.y = require("y");
export { };
