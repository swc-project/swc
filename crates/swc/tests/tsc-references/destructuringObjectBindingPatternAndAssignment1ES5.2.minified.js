//// [destructuringObjectBindingPatternAndAssignment1ES5.ts]
var a1 = (void 0).a1, a2 = {}.a2, b1 = 1, ref = {
    b2: {
        b21: "world"
    }
}, tmp = ref.b2, b21 = (void 0 === tmp ? {
    b21: "string"
} : tmp).b21, ref1 = {
    1: "string"
}, b3 = ref1[1], ref2 = {
    b4: 100000
}, _b4 = ref2.b4, b4 = void 0 === _b4 ? 1 : _b4, ref3 = {
    b5: {
        b52: b52
    }
}, b52 = ref3.b5.b52;
function foo() {
    return {
        1: !0
    };
}
function bar() {
    return {
        2: !0
    };
}
var ref4 = foo(), c0 = ref4[1], ref5 = bar(), c1 = ref5[1];
function foo1() {
    return {
        prop1: 2
    };
}
var ref6 = foo1(), d1 = ref6.prop1, ref7 = foo1(), d1 = ref7.prop2;
