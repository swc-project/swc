// @target: es6
// In a destructuring assignment expression, the type of the expression on the right must be assignable to the assignment target on the left.
// An expression of type S is considered assignable to an assignment target V if one of the following is true
// V is an object assignment pattern and, for each assignment property P in V,
//      S is the type Any, or
var a1 = undefined.a1;
var ref = {
}, a2 = ref.a2;
// V is an object assignment pattern and, for each assignment property P in V,
//      S has an apparent property with the property name specified in
//          P of a type that is assignable to the target given in P, or
var ref1 = {
    b1: 1
}, b1 = ref1.b1;
var ref2 = {
    b2: {
        b21: "world"
    }
}, tmp = ref2.b2, ref3 = tmp === void 0 ? {
    b21: "string"
} : tmp, b21 = ref3.b21;
var ref4 = {
    1: "string"
}, b3 = ref4[1];
var ref5 = {
    b4: 100000
}, _b4 = ref5.b4, b4 = _b4 === void 0 ? 1 : _b4;
var ref6 = {
    b5: {
        b52: b52
    }
}, _b5 = ref6.b5, b52 = _b5.b52;
function foo() {
    return {
        1: true
    };
}
function bar() {
    return {
        2: true
    };
}
var ref7 = foo(), c0 = ref7[1];
var ref8 = bar(), c1 = ref8[1];
function foo1() {
    return {
        "prop1": 2
    };
}
var ref9 = foo1(), d1 = ref9["prop1"];
var ref10 = foo1(), d1 = ref10["prop2"];
