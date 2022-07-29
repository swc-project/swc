new (require("./other"))().id;
var B = function() {
    this.id = 1;
};
B.prototype.m = function() {
    this.x = 2;
};
var b = new B();
b.id, b.x;
module.exports = function() {
    this.id = 1;
};
