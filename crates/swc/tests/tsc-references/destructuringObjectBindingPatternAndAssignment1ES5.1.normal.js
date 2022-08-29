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
var ref = {
    b2: {
        b21: "world"
    }
}, tmp = ref.b2, b21 = (tmp === void 0 ? {
    b21: "string"
} : tmp).b21;
var ref1 = {
    1: "string"
}, b3 = ref1[1];
var ref2 = {
    b4: 100000
}, _b4 = ref2.b4, b4 = _b4 === void 0 ? 1 : _b4;
var ref3 = {
    b5: {
        b52: b52
    }
}, b52 = ref3.b5.b52;
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
var ref4 = foo(), c0 = ref4[1];
var ref5 = bar(), c1 = ref5[1];
function foo1() {
    return {
        "prop1": 2
    };
}
var ref6 = foo1(), d1 = ref6["prop1"];
var ref7 = foo1(), d1 = ref7["prop2"];
