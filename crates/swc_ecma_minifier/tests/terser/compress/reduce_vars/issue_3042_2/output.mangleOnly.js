function a() {
    this.isFoo = function(b) {
        return b instanceof a;
    };
}
function b() {
    this.foos = [
        1,
        1
    ].map(function() {
        return new a();
    });
}
var c = new b();
console.log(c.foos[0].isFoo(c.foos[0]));
console.log(c.foos[0].isFoo(c.foos[1]));
console.log(c.foos[1].isFoo(c.foos[0]));
console.log(c.foos[1].isFoo(c.foos[1]));
