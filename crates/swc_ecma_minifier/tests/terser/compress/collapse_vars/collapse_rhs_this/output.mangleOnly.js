var a, b;
function c() {
    a = this;
    b = this;
    return this;
}
var d = c();
console.log(a === b, b === d, d === a);
