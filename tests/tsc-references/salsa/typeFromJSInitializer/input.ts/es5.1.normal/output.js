// @allowJs: true
// @checkJs: true
// @noEmit: true
// @strictNullChecks: true
// @noImplicitAny: true
// @Filename: a.js
function A() {
    // should get any on this-assignments in constructor
    this.unknown = null;
    this.unknowable = undefined;
    this.empty = [];
}
var a = new A();
a.unknown = 1;
a.unknown = true;
a.unknown = {
};
a.unknown = 'hi';
a.unknowable = 1;
a.unknowable = true;
a.unknowable = {
};
a.unknowable = 'hi';
a.empty.push(1);
a.empty.push(true);
a.empty.push({
});
a.empty.push('hi');
/** @type {number | undefined} */ var n;
// should get any on parameter initialisers
function f(param, param1, param2) {
    var a1 = param === void 0 ? null : param, b = param1 === void 0 ? n : param1, l = param2 === void 0 ? [] : param2;
    // a should be any
    a1 = undefined;
    a1 = null;
    a1 = 1;
    a1 = true;
    a1 = {
    };
    a1 = 'ok';
    // b should be number | undefined, not any
    b = 1;
    b = undefined;
    b = 'error';
    // l should be any[]
    l.push(1);
    l.push('ok');
}
// should get any on variable initialisers
var u = undefined;
var l = [];
u = undefined;
u = 1;
u = true;
u = {
};
u = 'ok';
l.push('ok');
