function n() {
    this.isFoo = function(o) {
        return o instanceof n;
    };
}
function s() {
    this.foos = [
        1,
        1
    ].map(function() {
        return new n();
    });
}
var o = new s();
console.log(o.foos[0].isFoo(o.foos[0]));
console.log(o.foos[0].isFoo(o.foos[1]));
console.log(o.foos[1].isFoo(o.foos[0]));
console.log(o.foos[1].isFoo(o.foos[1]));
