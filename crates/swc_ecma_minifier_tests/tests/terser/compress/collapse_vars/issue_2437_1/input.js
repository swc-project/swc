function XMLHttpRequest() {
    this.onreadystatechange = "PASS";
}
global.xhrDesc = {};
function foo() {
    return bar();
}
function bar() {
    if (xhrDesc) {
        var req = new XMLHttpRequest();
        var result = req.onreadystatechange;
        Object.defineProperty(
            XMLHttpRequest.prototype,
            "onreadystatechange",
            xhrDesc || {}
        );
        return result;
    }
}
console.log(foo());
