var b;
function c(a) {
    if (b) console.log(b === a.c);
    b = a.c;
}
function d() {}
function a() {
    c({
        c: d
    });
}
a();
a();
