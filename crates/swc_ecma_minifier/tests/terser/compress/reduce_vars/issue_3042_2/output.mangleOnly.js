function o() {
    this.isFoo = function(s) {
        return s instanceof o;
    };
}
function s() {
    this.foos = [
        1,
        1
    ].map(function() {
        return new o();
    });
}
var f = new s();
console.log(f.foos[0].isFoo(f.foos[0]));
console.log(f.foos[0].isFoo(f.foos[1]));
console.log(f.foos[1].isFoo(f.foos[0]));
console.log(f.foos[1].isFoo(f.foos[1]));
