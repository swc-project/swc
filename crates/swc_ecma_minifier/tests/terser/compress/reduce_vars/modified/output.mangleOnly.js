function o() {
    var o = 1,
        l = 2;
    l++;
    console.log(o + 1);
    console.log(l + 1);
}
function l() {
    var o = 1,
        l = 2;
    --l;
    console.log(o + 1);
    console.log(l + 1);
}
function n() {
    var o = 1,
        l = 2,
        n = 3;
    l = n;
    console.log(o + l);
    console.log(l + n);
    console.log(o + n);
    console.log(o + l + n);
}
function c() {
    var o = 1,
        l = 2,
        n = 3;
    l *= n;
    console.log(o + l);
    console.log(l + n);
    console.log(o + n);
    console.log(o + l + n);
}
function e() {
    var o = 1,
        l = 2,
        n = 3;
    if (o) {
        l = n;
    } else {
        n = l;
    }
    console.log(o + l);
    console.log(l + n);
    console.log(o + n);
    console.log(o + l + n);
}
function s(o) {
    B = o;
    console.log(typeof A ? "yes" : "no");
    console.log(typeof B ? "yes" : "no");
}
o(), l(), n(), c(), e(), s();
