var b = 10;
function f() {
    var a;
    if (delete a) b--;
}
f();
console.log(b);
