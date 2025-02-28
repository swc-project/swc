var n;
function o(c) {
    if (n) console.log(n === c.c);
    n = c.c;
}
function f() {}
function c() {
    o({
        c: f
    });
}
c();
c();
