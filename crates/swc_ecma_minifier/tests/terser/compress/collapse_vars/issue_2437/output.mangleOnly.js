function e() {
    n();
}
function n() {
    if (xhrDesc) {
        var e = new XMLHttpRequest();
        var n = !!e.onreadystatechange;
        Object.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", xhrDesc || {});
        return n;
    } else {
        var e = new XMLHttpRequest();
        var a = function() {};
        e.onreadystatechange = a;
        var n = e[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === a;
        e.onreadystatechange = null;
        return n;
    }
}
e();
