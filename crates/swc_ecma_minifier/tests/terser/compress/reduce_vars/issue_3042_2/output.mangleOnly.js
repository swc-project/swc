function c() {
    this.isFoo = function(a) {
        return a instanceof c;
    };
}
function b() {
    this.foos = [
        1,
        1
    ].map(function() {
        return new c();
    });
}
var a = new b();
console.log(a.foos[0].isFoo(a.foos[0]));
console.log(a.foos[0].isFoo(a.foos[1]));
console.log(a.foos[1].isFoo(a.foos[0]));
console.log(a.foos[1].isFoo(a.foos[1]));
