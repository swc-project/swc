function b() {
    this.onreadystatechange = "PASS";
}
global.xhrDesc = {};
function a() {
    return c();
}
function c() {
    if (xhrDesc) {
        var a = new b();
        var c = a.onreadystatechange;
        Object.defineProperty(b.prototype, "onreadystatechange", xhrDesc || {});
        return c;
    }
}
console.log(a());
