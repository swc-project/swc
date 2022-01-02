// @strict: true
function f(b) {
    function d1() {}
    d1.e = 12;
    d1.e;
    if (b) {
        d1.q = false;
    }
    // error d.q might not be assigned
    d1.q;
    if (b) {
        d1.q = false;
    } else {
        d1.q = true;
    }
    d1.q;
    if (b) {
        d1.r = 1;
    } else {
        d1.r = 2;
    }
    d1.r;
    if (b) {
        d1.s = 'hi';
    }
    return d1;
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
const g = function() {};
if (!!false) {
    g.expando = 1;
}
g.expando // error
;
if (!!false) {
    g.both = 'hi';
} else {
    g.both = 0;
}
g.both;
