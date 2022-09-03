//// [a.js]
function A() {
    this.unknown = null, this.unknowable = void 0, this.empty = [];
}
var n, a = new A();
function f() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    var l = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [];
    l.push(1), l.push("ok");
}
a.unknown = 1, a.unknown = !0, a.unknown = {}, a.unknown = "hi", a.unknowable = 1, a.unknowable = !0, a.unknowable = {}, a.unknowable = "hi", a.empty.push(1), a.empty.push(!0), a.empty.push({}), a.empty.push("hi");
var u = void 0, l = [];
u = void 0, u = 1, u = !0, u = {}, u = "ok", l.push("ok");
var isUndef = function(v) {
    return void 0 === v;
}, e = [
    1,
    void 0
], g = e.filter(isUndef);
