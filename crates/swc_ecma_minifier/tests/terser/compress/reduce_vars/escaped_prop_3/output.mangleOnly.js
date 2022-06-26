var a;
function b(b) {
    if (a) console.log(a === b.c);
    a = b.c;
}
function c() {}
function d() {
    b({
        c: c
    });
}
d();
d();
