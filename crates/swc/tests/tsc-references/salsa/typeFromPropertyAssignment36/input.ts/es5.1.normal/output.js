// @strict: true
function f(b) {
    var d = function d() {
    };
    d.e = 12;
    d.e;
    if (b) {
        d.q = false;
    }
    // error d.q might not be assigned
    d.q;
    if (b) {
        d.q = false;
    } else {
        d.q = true;
    }
    d.q;
    if (b) {
        d.r = 1;
    } else {
        d.r = 2;
    }
    d.r;
    if (b) {
        d.s = 'hi';
    }
    return d;
}
// OK to access possibly-unassigned properties outside the initialising scope
var test = f(true).s;
function d1() {
}
d1.e = 12;
d1.e;
if (!!false) {
    d1.q = false;
}
d1.q;
if (!!false) {
    d1.q = false;
} else {
    d1.q = true;
}
d1.q;
if (!!false) {
    d1.r = 1;
} else {
    d1.r = 2;
}
d1.r;
// test function expressions too
var g = function g() {
};
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
