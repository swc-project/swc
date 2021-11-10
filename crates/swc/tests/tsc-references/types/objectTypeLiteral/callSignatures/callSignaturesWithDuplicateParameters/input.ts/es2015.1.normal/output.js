// Duplicate parameter names are always an error
function foo(x, x) {
}
var f = function foo(x, x) {
};
var f2 = function(x, x) {
};
var f3 = (x, x)=>{
};
var f4 = (x, x)=>{
};
function foo2(x, x) {
}
var f5 = function foo(x, x) {
};
var f6 = function(x, x) {
};
var f7 = (x, x)=>{
};
var f8 = (x, y)=>{
};
class C {
    foo(x, x) {
    }
    foo2(x1, x1) {
    }
    foo3(x2, x2) {
    }
}
var a;
var b = {
    foo (x, x) {
    },
    a: function foo(x, x) {
    },
    b: (x, x)=>{
    }
};
