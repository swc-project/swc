function n() {
    this.onreadystatechange = "PASS";
}
global.xhrDesc = {};
function e() {
    return t();
}
function t() {
    if (xhrDesc) {
        var e = new n();
        var t = e.onreadystatechange;
        Object.defineProperty(n.prototype, "onreadystatechange", xhrDesc || {});
        return t;
    }
}
console.log(e());
