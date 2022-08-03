function o() {
    var o = 1, l = 2;
    l++;
    console.log(o + 1);
    console.log(l + 1);
}
function l() {
    var o = 1, l = 2;
    --l;
    console.log(o + 1);
    console.log(l + 1);
}
function g() {
    var o = 1, l = 2, g = 3;
    l = g;
    console.log(o + l);
    console.log(l + g);
    console.log(o + g);
    console.log(o + l + g);
}
function n() {
    var o = 1, l = 2, g = 3;
    l *= g;
    console.log(o + l);
    console.log(l + g);
    console.log(o + g);
    console.log(o + l + g);
}
function f() {
    var o = 1, l = 2, g = 3;
    if (o) {
        l = g;
    } else {
        g = l;
    }
    console.log(o + l);
    console.log(l + g);
    console.log(o + g);
    console.log(o + l + g);
}
function _(o) {
    B = o;
    console.log(typeof A ? "yes" : "no");
    console.log(typeof B ? "yes" : "no");
}
o(), l(), g(), n(), f(), _();
