var a = 10;
function b() {
    var b;
    if (delete b) a--;
}
b();
console.log(a);
