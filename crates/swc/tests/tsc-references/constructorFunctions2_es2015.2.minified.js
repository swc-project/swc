const A = require("./other");
new A().id;
const B = function() {
    this.id = 1;
};
B.prototype.m = function() {
    this.x = 2;
};
const b = new B();
b.id, b.x;
module.exports = function() {
    this.id = 1;
};
