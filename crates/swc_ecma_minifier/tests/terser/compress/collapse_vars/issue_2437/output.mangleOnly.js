function e() {
    t();
}
function t() {
    if (xhrDesc) {
        var e = new XMLHttpRequest();
        var t = !!e.onreadystatechange;
        Object.defineProperty(
            XMLHttpRequest.prototype,
            "onreadystatechange",
            xhrDesc || {}
        );
        return t;
    } else {
        var e = new XMLHttpRequest();
        var n = function () {};
        e.onreadystatechange = n;
        var t = e[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === n;
        e.onreadystatechange = null;
        return t;
    }
}
e();
