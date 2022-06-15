function a() {
    this.onreadystatechange = "PASS";
}
global.SYMBOL_FAKE_ONREADYSTATECHANGE_1 = Symbol();
global.xhrDesc = null;
function b() {
    return c();
}
function c() {
    if (!xhrDesc) {
        var b = new a();
        var c = function() {};
        b.onreadystatechange = c;
        var d = b[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === c;
        b.onreadystatechange = null;
        return d;
    }
}
console.log(b());
