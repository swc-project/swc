var a, b;
function c() {
    a = 42;
    b = 42;
    return 42;
}
var d = c();
console.log(a === b, b === d, d === a);
