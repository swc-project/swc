function n() {
    this.onreadystatechange = "PASS";
}
global.SYMBOL_FAKE_ONREADYSTATECHANGE_1 = Symbol();
global.xhrDesc = null;
function e() {
    return t();
}
function t() {
    if (!xhrDesc) {
        var e = new n();
        var t = function() {};
        e.onreadystatechange = t;
        var a = e[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === t;
        e.onreadystatechange = null;
        return a;
    }
}
console.log(e());
