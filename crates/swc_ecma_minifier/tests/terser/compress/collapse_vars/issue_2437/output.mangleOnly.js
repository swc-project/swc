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
        var r = function() {};
        e.onreadystatechange = r;
        var n = e[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === r;
        e.onreadystatechange = null;
        return n;
    }
}
e();
