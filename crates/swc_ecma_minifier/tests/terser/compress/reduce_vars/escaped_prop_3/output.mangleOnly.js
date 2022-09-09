var c;
function n(n) {
    if (c) console.log(c === n.c);
    c = n.c;
}
function o() {}
function f() {
    n({ c: o });
}
f();
f();
