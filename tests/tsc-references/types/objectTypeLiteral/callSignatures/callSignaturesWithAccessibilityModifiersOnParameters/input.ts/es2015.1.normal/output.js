// Call signature parameters do not allow accessibility modifiers
function foo(x, y) {
}
var f = function foo(x, y) {
};
var f2 = function(x, y) {
};
var f3 = (x, y)=>{
};
var f4 = (x, y)=>{
};
function foo2(x, y) {
}
var f5 = function foo(x, y) {
};
var f6 = function(x, y) {
};
var f7 = (x, y)=>{
};
var f8 = (x, y)=>{
};
class C {
    foo(x, y) {
    }
    foo2(x, y) {
    }
    foo3(x, y) {
    }
}
var a;
var b = {
    foo (x, y) {
    },
    a: function foo(x, y) {
    },
    b: (x, y)=>{
    }
};
