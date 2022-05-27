function b() {
    this.onreadystatechange = "PASS";
}
global.SYMBOL_FAKE_ONREADYSTATECHANGE_1 = Symbol();
global.xhrDesc = null;
function a() {
    return c();
}
function c() {
    if (!xhrDesc) {
        var a = new b();
        var c = function() {};
        a.onreadystatechange = c;
        var d = a[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === c;
        a.onreadystatechange = null;
        return d;
    }
}
console.log(a());
