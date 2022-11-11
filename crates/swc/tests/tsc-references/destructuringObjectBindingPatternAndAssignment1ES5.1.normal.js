//// [destructuringObjectBindingPatternAndAssignment1ES5.ts]
// In a destructuring assignment expression, the type of the expression on the right must be assignable to the assignment target on the left.
// An expression of type S is considered assignable to an assignment target V if one of the following is true
// V is an object assignment pattern and, for each assignment property P in V,
//      S is the type Any, or
var a1 = undefined.a1;
var a2 = {}.a2;
// V is an object assignment pattern and, for each assignment property P in V,
//      S has an apparent property with the property name specified in
//          P of a type that is assignable to the target given in P, or
var b1 = {
    b1: 1
}.b1;
var _ref = {
    b2: {
        b21: "world"
    }
}, tmp = _ref.b2, b21 = (tmp === void 0 ? {
    b21: "string"
} : tmp).b21;
var _ref1 = {
    1: "string"
}, b3 = _ref1[1];
var _ref2 = {
    b4: 100000
}, _ref_b4 = _ref2.b4, b4 = _ref_b4 === void 0 ? 1 : _ref_b4;
var _ref3 = {
    b5: {
        b52: b52
    }
}, b52 = _ref3.b5.b52;
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
var _foo = foo(), c0 = _foo[1];
var _bar = bar(), c1 = _bar[1];
function foo1() {
    return {
        "prop1": 2
    };
}
var _foo1 = foo1(), d1 = _foo1["prop1"];
var _foo11 = foo1(), d1 = _foo11["prop2"];
