function a() {
    b();
}
function b() {
    if (xhrDesc) {
        var a = new XMLHttpRequest();
        var b = !!a.onreadystatechange;
        Object.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", xhrDesc || {});
        return b;
    } else {
        var a = new XMLHttpRequest();
        var c = function() {};
        a.onreadystatechange = c;
        var b = a[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === c;
        a.onreadystatechange = null;
        return b;
    }
}
a();
