Object.prototype.c = function() {
    this.a++;
};
var a = {
    a: 1,
    b: 2
};
a.c();
console.log(a.a, a.b);
