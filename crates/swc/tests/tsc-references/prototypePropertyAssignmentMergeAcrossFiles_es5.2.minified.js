(function() {
    this.a = 1;
}).prototype.foo = function() {
    return this.a;
};
