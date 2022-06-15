var a = 0;
function b(b) {
    a = 200;
    return 100;
}
function c() {
    var c = b();
    a += c;
    return a;
}
console.log(c());
