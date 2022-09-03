//// [a.js]
function Instance() {
    this.i = "simple";
}
var i = new Instance();
function StaticToo() {
    this.i = "more complex";
}
StaticToo.property = "yep";
var s = new StaticToo();
function A() {
    this.x = 1, this.second = 1;
}
A.prototype.z = function(n) {
    return n + this.x;
}, A.t = function(m) {
    return m + 1;
};
var a = new A();
a.z(3), A.t(2), a.second = 1;
