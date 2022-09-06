function o() {
    this.isFoo = function (s) {
        return s instanceof o;
    };
}
function s() {
    this.foos = [1, 1].map(function () {
        return new o();
    });
}
var n = new s();
console.log(n.foos[0].isFoo(n.foos[0]));
console.log(n.foos[0].isFoo(n.foos[1]));
console.log(n.foos[1].isFoo(n.foos[0]));
console.log(n.foos[1].isFoo(n.foos[1]));
