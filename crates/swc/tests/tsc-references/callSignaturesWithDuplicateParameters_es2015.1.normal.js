// Duplicate parameter names are always an error
function foo(x, x) {}
var f = function foo(x, x) {};
var f2 = function(x, x) {};
var f3 = (x, x)=>{};
var f4 = (x, x)=>{};
function foo2(x, x) {}
var f5 = function foo(x, x) {};
var f6 = function(x, x) {};
var f7 = (x, x)=>{};
var f8 = (x, y)=>{};
class C {
    foo(x, x) {}
    foo2(x, x) {}
    foo3(x, x) {}
}
var a;
var b = {
    foo (x, x) {},
    a: function foo(x, x) {},
    b: (x, x)=>{}
};
