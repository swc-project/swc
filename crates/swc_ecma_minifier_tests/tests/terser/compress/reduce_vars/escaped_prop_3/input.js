var a;
function f(b) {
    if (a) console.log(a === b.c);
    a = b.c;
}
function g() {}
function h() {
    f({ c: g });
}
h();
h();
