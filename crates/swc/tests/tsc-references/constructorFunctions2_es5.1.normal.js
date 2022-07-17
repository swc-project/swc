// @allowJs: true
// @checkJs: true
// @noEmit: true
// @module: commonjs
// @filename: node.d.ts
// @filename: index.js
var A = require("./other");
var a = new A().id;
var B = function B() {
    this.id = 1;
};
B.prototype.m = function() {
    this.x = 2;
};
var b = new B();
b.id;
b.x;
// @filename: other.js
function A() {
    this.id = 1;
}
module.exports = A;
