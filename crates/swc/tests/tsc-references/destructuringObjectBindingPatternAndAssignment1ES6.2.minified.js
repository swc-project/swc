//// [destructuringObjectBindingPatternAndAssignment1ES6.ts]
var { a1  } = void 0, { a2  } = {}, { b1 ,  } = {
    b1: 1
}, { b2: { b21  } = {
    b21: "string"
}  } = {
    b2: {
        b21: "world"
    }
}, { 1: b3  } = {
    1: "string"
}, { b4 =1  } = {
    b4: 100000
}, { b5: { b52  }  } = {
    b5: {
        b52
    }
}, { 1: c0  } = {
    1: !0
}, { 1: c1  } = {
    2: !0
};
function foo1() {
    return {
        prop1: 2
    };
}
var { prop1: d1  } = foo1(), { prop2: d1  } = foo1();
