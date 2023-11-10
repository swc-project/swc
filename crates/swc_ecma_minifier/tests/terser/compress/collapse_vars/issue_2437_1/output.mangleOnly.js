function XMLHttpRequest() {
    this.onreadystatechange = "PASS";
}
global.xhrDesc = {};
function e() {
    return n();
}
function n() {
    if (xhrDesc) {
        var e = new XMLHttpRequest();
        var n = e.onreadystatechange;
        Object.defineProperty(XMLHttpRequest.prototype, "onreadystatechange", xhrDesc || {});
        return n;
    }
}
console.log(e());
