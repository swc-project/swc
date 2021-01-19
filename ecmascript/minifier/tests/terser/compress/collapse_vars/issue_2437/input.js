function foo() {
    bar();
}
function bar() {
    if (xhrDesc) {
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        Object.defineProperty(
            XMLHttpRequest.prototype,
            "onreadystatechange",
            xhrDesc || {}
        );
        return result;
    } else {
        var req = new XMLHttpRequest();
        var detectFunc = function () {};
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
foo();
