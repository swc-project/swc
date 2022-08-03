function e() {
    this.onreadystatechange = "PASS";
}
global.xhrDesc = {};
function n() {
    return t();
}
function t() {
    if (xhrDesc) {
        var n = new e();
        var t = n.onreadystatechange;
        Object.defineProperty(e.prototype, "onreadystatechange", xhrDesc || {});
        return t;
    }
}
console.log(n());
