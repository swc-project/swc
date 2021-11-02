function foo(x) {
    return x;
}
var f = function foo(x) {
    return x;
};
var f2 = (x)=>x
;
var f3 = (x)=>x
;
class C {
    foo(x1) {
        return x1;
    }
}
var a;
var b = {
    foo (x) {
        return x;
    },
    a: function foo(x) {
        return x;
    },
    b: (x)=>x
};
