// all of these are valid
var x;
x = 1;
var a1 = 2;
x = a1;
x = true;
var b = true;
x = b;
x = "";
var c = "";
x = c;
var d;
x = d;
var e = undefined;
x = e;
var e2;
x = e2;
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
x = E1.A;
var f = E1.A;
x = f;
var g;
x = g;
class C {
}
var h;
x = h;
var i;
x = i;
x = {
    f () {
        return 1;
    }
};
x = {
    f (x1) {
        return x1;
    }
};
function j(a) {
    x = a;
}
