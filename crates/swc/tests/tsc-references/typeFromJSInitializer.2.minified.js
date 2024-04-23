//// [a.js]
var a = new function() {
    this.unknown = null, this.unknowable = void 0, this.empty = [];
}();
a.unknown = 1, a.unknown = !0, a.unknown = {}, a.unknown = 'hi', a.unknowable = 1, a.unknowable = !0, a.unknowable = {}, a.unknowable = 'hi', a.empty.push(1), a.empty.push(!0), a.empty.push({}), a.empty.push('hi'), [].push('ok'), [
    1,
    void 0
].filter(function(v) {
    return void 0 === v;
});
