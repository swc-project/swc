var a = 100, b = 10;
function f() {
    var a = (a--, (delete a) && --b);
}
f();
console.log(a, b);
