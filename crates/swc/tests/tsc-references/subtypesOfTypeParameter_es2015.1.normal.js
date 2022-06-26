// checking whether other types are subtypes of type parameters
class C3 {
}
class D1 extends C3 {
}
function f1(x, y) {
    var r = true ? x : y; // error
    var r = true ? y : x; // error
}
class C1 {
}
class C2 {
}
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
function f() {}
(function(f) {
    var bar = f.bar = 1;
})(f || (f = {}));
class c {
}
(function(c) {
    var bar = c.bar = 1;
})(c || (c = {}));
// errors throughout
function f2(x, y) {
    var r0 = true ? x : null;
    var r0 = true ? null : x;
    var u;
    var r0b = true ? u : x;
    var r0b = true ? x : u;
    var r1 = true ? 1 : x;
    var r1 = true ? x : 1;
    var r2 = true ? '' : x;
    var r2 = true ? x : '';
    var r3 = true ? true : x;
    var r3 = true ? x : true;
    var r4 = true ? new Date() : x;
    var r4 = true ? x : new Date();
    var r5 = true ? /1/ : x;
    var r5 = true ? x : /1/;
    var r6 = true ? {
        foo: 1
    } : x;
    var r6 = true ? x : {
        foo: 1
    };
    var r7 = true ? ()=>{} : x;
    var r7 = true ? x : ()=>{};
    var r8 = true ? (x)=>{
        return x;
    } : x;
    var r8b = true ? x : (x)=>{
        return x;
    }; // type parameters not identical across declarations
    var i1;
    var r9 = true ? i1 : x;
    var r9 = true ? x : i1;
    var c1;
    var r10 = true ? c1 : x;
    var r10 = true ? x : c1;
    var c2;
    var r12 = true ? c2 : x;
    var r12 = true ? x : c2;
    var r13 = true ? E : x;
    var r13 = true ? x : E;
    var r14 = true ? E.A : x;
    var r14 = true ? x : E.A;
    var af;
    var r15 = true ? af : x;
    var r15 = true ? x : af;
    var ac;
    var r16 = true ? ac : x;
    var r16 = true ? x : ac;
    function f17(a) {
        var r17 = true ? x : a;
        var r17 = true ? a : x;
    }
    function f18(a) {
        var r18 = true ? x : a;
        var r18 = true ? a : x;
    }
    var r19 = true ? new Object() : x; // BCT is Object
    var r19 = true ? x : new Object(); // BCT is Object
    var r20 = true ? {} : x; // ok
    var r20 = true ? x : {}; // ok
}
