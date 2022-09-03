//// [mod1.js]
module.exports = C;
function C() {
    this.p = 1;
}
//// [use.js]
function f(k) {
    return k({
        ok: !0
    });
}
