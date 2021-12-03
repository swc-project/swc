var a = 100, b = 10;
function f() {
    var a1 = (a1--, (delete a1) && --b);
}
f();
console.log(a, b);
