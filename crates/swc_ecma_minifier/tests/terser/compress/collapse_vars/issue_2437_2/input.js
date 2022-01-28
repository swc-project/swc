function XMLHttpRequest() {
    this.onreadystatechange = "PASS";
}
global.SYMBOL_FAKE_ONREADYSTATECHANGE_1 = Symbol();
global.xhrDesc = null;
function foo() {
    return bar();
}
function bar() {
    if (!xhrDesc) {
        var req = new XMLHttpRequest();
        var detectFunc = function () {};
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
console.log(foo());
