//// [destructuringObjectBindingPatternAndAssignment1ES6.ts]
// In a destructuring assignment expression, the type of the expression on the right must be assignable to the assignment target on the left.
// An expression of type S is considered assignable to an assignment target V if one of the following is true
// V is an object assignment pattern and, for each assignment property P in V,
//      S is the type Any, or
var { a1 } = undefined;
var { a2 } = {};
// V is an object assignment pattern and, for each assignment property P in V,
//      S has an apparent property with the property name specified in
//          P of a type that is assignable to the target given in P, or
var { b1 } = {
    b1: 1
};
var { b2: { b21 } = {
    b21: "string"
} } = {
    b2: {
        b21: "world"
    }
};
var { 1: b3 } = {
    1: "string"
};
var { b4 = 1 } = {
    b4: 100000
};
var { b5: { b52 } } = {
    b5: {
        b52
    }
};
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
var { 1: c0 } = foo();
var { 1: c1 } = bar();
function foo1() {
    return {
        "prop1": 2
    };
}
var { "prop1": d1 } = foo1();
var { "prop2": d1 } = foo1();
