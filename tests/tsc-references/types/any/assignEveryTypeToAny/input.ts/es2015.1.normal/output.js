// all of these are valid
var x1;
x1 = 1;
var a = 2;
x1 = a;
x1 = true;
var b = true;
x1 = b;
x1 = "";
var c = "";
x1 = c;
var d;
x1 = d;
var e = undefined;
x1 = e;
var e2;
x1 = e2;
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {
}));
x1 = E.A;
var f = E.A;
x1 = f;
var g;
x1 = g;
class C {
}
var h;
x1 = h;
var i;
x1 = i;
x1 = {
    f () {
        return 1;
    }
};
x1 = {
    f (x) {
        return x;
    }
};
function j(a) {
    x1 = a;
}
