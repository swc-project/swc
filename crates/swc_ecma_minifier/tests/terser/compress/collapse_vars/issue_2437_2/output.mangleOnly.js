function XMLHttpRequest() {
    this.onreadystatechange = "PASS";
}
global.SYMBOL_FAKE_ONREADYSTATECHANGE_1 = Symbol();
global.xhrDesc = null;
function n() {
    return e();
}
function e() {
    if (!xhrDesc) {
        var n = new XMLHttpRequest();
        var e = function() {};
        n.onreadystatechange = e;
        var a = n[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === e;
        n.onreadystatechange = null;
        return a;
    }
}
console.log(n());
