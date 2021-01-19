Object.prototype.c = function () {
    this.a++;
};
var o = { a: 1, b: 2 };
o.c();
console.log(o.a, o.b);
