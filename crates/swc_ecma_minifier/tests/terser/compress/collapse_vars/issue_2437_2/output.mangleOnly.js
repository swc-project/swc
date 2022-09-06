function n() {
    this.onreadystatechange = "PASS";
}
global.SYMBOL_FAKE_ONREADYSTATECHANGE_1 = Symbol();
global.xhrDesc = null;
function e() {
    return a();
}
function a() {
    if (!xhrDesc) {
        var e = new n();
        var a = function () {};
        e.onreadystatechange = a;
        var o = e[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === a;
        e.onreadystatechange = null;
        return o;
    }
}
console.log(e());
