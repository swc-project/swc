var a;
function g() {}
function h() {
    (function (b) {
        if (a) console.log(a === b.c);
        a = b.c;
    })({ c: g });
}
h();
h();
