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
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
})(E1 || (E1 = {
}));
function f3() {
}
(function(f) {
    f.bar = 1;
})(f3 || (f3 = {
}));
class c1 {
}
(function(c) {
    c.bar = 1;
})(c1 || (c1 = {
}));
// errors throughout
function f2(x1, y) {
    var r0 = true ? x1 : null;
    var r0 = true ? null : x1;
    var u;
    var r0b = true ? u : x1;
    var r0b = true ? x1 : u;
    var r1 = true ? 1 : x1;
    var r1 = true ? x1 : 1;
    var r2 = true ? '' : x1;
    var r2 = true ? x1 : '';
    var r3 = true ? true : x1;
    var r3 = true ? x1 : true;
    var r4 = true ? new Date() : x1;
    var r4 = true ? x1 : new Date();
    var r5 = true ? /1/ : x1;
    var r5 = true ? x1 : /1/;
    var r6 = true ? {
        foo: 1
    } : x1;
    var r6 = true ? x1 : {
        foo: 1
    };
    var r7 = true ? ()=>{
    } : x1;
    var r7 = true ? x1 : ()=>{
    };
    var r8 = true ? (x)=>{
        return x;
    } : x1;
    var r8b = true ? x1 : (x)=>{
        return x;
    }; // type parameters not identical across declarations
    var i1;
    var r9 = true ? i1 : x1;
    var r9 = true ? x1 : i1;
    var c1;
    var r10 = true ? c1 : x1;
    var r10 = true ? x1 : c1;
    var c2;
    var r12 = true ? c2 : x1;
    var r12 = true ? x1 : c2;
    var r13 = true ? E1 : x1;
    var r13 = true ? x1 : E1;
    var r14 = true ? E1.A : x1;
    var r14 = true ? x1 : E1.A;
    var af;
    var r15 = true ? af : x1;
    var r15 = true ? x1 : af;
    var ac;
    var r16 = true ? ac : x1;
    var r16 = true ? x1 : ac;
    function f17(a) {
        var r17 = true ? x1 : a;
        var r17 = true ? a : x1;
    }
    function f18(a) {
        var r18 = true ? x1 : a;
        var r18 = true ? a : x1;
    }
    var r19 = true ? new Object() : x1; // BCT is Object
    var r19 = true ? x1 : new Object(); // BCT is Object
    var r20 = true ? {
    } : x1; // ok
    var r20 = true ? x1 : {
    }; // ok
}
