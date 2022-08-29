//// [typeFromPropertyAssignment36.ts]
function f(b) {
    var _$d = function _$d() {};
    _$d.e = 12;
    _$d.e;
    if (b) {
        _$d.q = false;
    }
    // error d.q might not be assigned
    _$d.q;
    if (b) {
        _$d.q = false;
    } else {
        _$d.q = true;
    }
    _$d.q;
    if (b) {
        _$d.r = 1;
    } else {
        _$d.r = 2;
    }
    _$d.r;
    if (b) {
        _$d.s = "hi";
    }
    return _$d;
}
// OK to access possibly-unassigned properties outside the initialising scope
var test = f(true).s;
function d() {}
d.e = 12;
d.e;
if (!!false) {
    d.q = false;
}
d.q;
if (!!false) {
    d.q = false;
} else {
    d.q = true;
}
d.q;
if (!!false) {
    d.r = 1;
} else {
    d.r = 2;
}
d.r;
// test function expressions too
var g = function g() {};
if (!!false) {
    g.expando = 1;
}
g.expando // error
;
if (!!false) {
    g.both = "hi";
} else {
    g.both = 0;
}
g.both;
