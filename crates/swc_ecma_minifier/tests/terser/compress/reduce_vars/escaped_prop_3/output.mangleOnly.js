var c;
function n(n) {
    if (c) console.log(c === n.c);
    c = n.c;
}
function f() {}
function i() {
    n({
        c: f
    });
}
i();
i();
