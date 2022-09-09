var e = 100,
    o = 10;
function l() {
    var e = (e--, delete e && --o);
}
l();
console.log(e, o);
