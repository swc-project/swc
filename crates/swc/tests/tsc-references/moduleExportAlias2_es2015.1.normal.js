// @Filename: semver.js
/// <reference path='node.d.ts' />
exports = module.exports = C;
exports.f = (n)=>n + 1;
function C() {
    this.p = 1;
}
// @filename: index.js
/// <reference path='node.d.ts' />
const C = require("./semver");
var two = C.f(1);
var c = new C;
