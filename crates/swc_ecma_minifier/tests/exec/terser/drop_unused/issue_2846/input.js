function f(a, b) {
    var a = 0;
    b && b(a);
    return a++;
}
var c = f();
console.log(c);
