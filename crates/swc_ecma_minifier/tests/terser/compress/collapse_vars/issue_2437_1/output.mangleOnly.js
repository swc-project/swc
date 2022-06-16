function a() {
    this.onreadystatechange = "PASS";
}
global.xhrDesc = {};
function b() {
    return c();
}
function c() {
    if (xhrDesc) {
        var b = new a();
        var c = b.onreadystatechange;
        Object.defineProperty(a.prototype, "onreadystatechange", xhrDesc || {});
        return c;
    }
}
console.log(b());
