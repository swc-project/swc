function e() {
    this.onreadystatechange = "PASS";
}
global.SYMBOL_FAKE_ONREADYSTATECHANGE_1 = Symbol();
global.xhrDesc = null;
function n() {
    return a();
}
function a() {
    if (!xhrDesc) {
        var n = new e();
        var a = function() {};
        n.onreadystatechange = a;
        var o = n[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === a;
        n.onreadystatechange = null;
        return o;
    }
}
console.log(n());
