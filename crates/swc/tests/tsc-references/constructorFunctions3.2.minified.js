//// [a.js]
function StaticToo() {
    this.i = "more complex";
}
// Both!
function A() {
    this.x = 1, /** @type {1} */ this.second = 1;
}
new function() {
    this.i = "simple";
}(), StaticToo.property = "yep", new StaticToo(), /** @param {number} n */ A.prototype.z = function(n) {
    return n + this.x;
}, /** @param {number} m */ A.t = function(m) {
    return m + 1;
};
var a = new A();
a.z(3), A.t(2), a.second = 1;
